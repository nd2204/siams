import { type Pool } from "pg";
import { IRepository, IPaginated } from "@shared/interfaces";

export abstract class PostgresRepositoryBase<T> implements IRepository<T> {
  protected readonly jsonColumns: Set<string> = new Set();
  constructor(
    protected readonly pool: Pool,
    protected readonly tableName: string,
    protected readonly columns: Record<keyof T, string>, // map key entity -> column DB
    protected readonly toEntity: (row: any) => T,
    jsonColumns?: (keyof T)[] // optional
  ) {
    this.jsonColumns = new Set(jsonColumns?.map(k => this.columns[k]));
  }

  protected buildWhere(filters: Partial<T>) {
    const keys = Object.keys(filters) as (keyof T)[];
    const conditions: string[] = [];
    const values: any[] = [];

    keys.forEach((key, idx) => {
      const column = this.getColumn(key);
      const value = (filters as any)[key];

      if (value === undefined) return;

      if (this.jsonColumns.has(column)) {
        // Use @> for JSON containment (Postgres jsonb operator)
        // Example: column @> '{"field":"value"}'
        conditions.push(`${column} @> $${idx + 1}::jsonb`);
        values.push(JSON.stringify(value));
      } else {
        conditions.push(`${column} = $${idx + 1}`);
        values.push(value);
      }
    });

    const whereClause = conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";
    return { whereClause, values };
  }

  protected getColumn(key: keyof T): string {
    const col = this.columns[key]
    if (!col) throw new Error(`Column mapping not found for key \"${String(key)}\"`);
    return col
  }

  async findOneBy(filters: Partial<T>): Promise<T | undefined> {
    const { whereClause, values } = this.buildWhere(filters);
    const sql = `SELECT * FROM ${this.tableName} ${whereClause} LIMIT 1`;
    const res = await this.pool.query(sql, values);
    if (res.rows.length === 0) return undefined;
    return this.toEntity(res.rows[0]);
  }

  async findAllBy(filters: Partial<T>): Promise<T[]> {
    const { whereClause, values } = this.buildWhere(filters);
    const sql = `SELECT * FROM ${this.tableName} ${whereClause}`;
    const res = await this.pool.query(sql, values);
    return res.rows.map(this.toEntity);
  }

  async listBy(filters: Partial<T>, page: number, perPage: number): Promise<IPaginated<T>> {
    const { whereClause, values } = this.buildWhere(filters);

    const sql = `SELECT * FROM ${this.tableName} ${whereClause} OFFSET $${values.length + 1} LIMIT $${values.length + 2}`;
    const countSql = `SELECT COUNT(*) FROM ${this.tableName} ${whereClause}`;

    const offset = (page - 1) * perPage;
    const res = await this.pool.query(sql, [...values, offset, perPage]);
    const countRes = await this.pool.query(countSql, values);

    return {
      data: res.rows.map(this.toEntity),
      pagination: {
        total: parseInt(countRes.rows[0].count, 10),
        page,
        perPage,
      }
    };
  }

  async create(payload: Partial<T>): Promise<T> {
    const keys = Object.keys(payload) as (keyof T)[];
    const cols = keys.map(k => this.getColumn(k));
    const placeholders = keys.map((_, i) => `$${i + 1}`);
    const values = keys.map(k => {
      const col = this.getColumn(k);
      const val = (payload as any)[k];
      return this.jsonColumns.has(col) ? JSON.stringify(val) : val;
    });

    const sql = `INSERT INTO ${this.tableName} (${cols.join(",")}) VALUES (${placeholders.join(",")}) RETURNING *`;
    const res = await this.pool.query(sql, values);
    return this.toEntity(res.rows[0]);
  }

  async update(id: number | string, payload: Partial<T>): Promise<T> {
    const keys = Object.keys(payload) as (keyof T)[];
    const sets = keys.map((k, i) => `${this.getColumn(k)} = $${i + 1}`);
    const values = keys.map(
      k => {
        const col = this.getColumn(k);
        const val = (payload as any)[k];
        return this.jsonColumns.has(col) ? JSON.stringify(val) : val;
      }
    );

    const sql = `UPDATE ${this.tableName} SET ${sets.join(",")} WHERE id = $${keys.length + 1} RETURNING *`;
    const res = await this.pool.query(sql, [...values, id]);
    if (res.rows.length === 0) throw new Error(`Entity not found with id=${id}`);
    return this.toEntity(res.rows[0]);
  }

  async delete(id: number | string): Promise<boolean> {
    const sql = `DELETE FROM ${this.tableName} WHERE id = $1`;
    const res = await this.pool.query(sql, [id]);
    return (res.rowCount ?? -1) > 0;
  }
}
