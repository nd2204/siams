import { type Pool } from "pg";
import { IRepository, IPaginated } from "@shared/interfaces";
import { NotFoundError } from "@shared/errors";
import { GroupByDateType } from "@domain/interfaces/group-by-date";
import { IBucketOf } from "@shared/interfaces/bucket";

export abstract class PostgresRepositoryBase<T> implements IRepository<T> {
  protected readonly jsonColumns: Set<string> = new Set();
  protected readonly geometryColumns: Set<string> = new Set();
  constructor(
    protected readonly pool: Pool,
    protected readonly tableName: string,
    protected readonly columns: Record<keyof T, string>, // map key entity -> column DB
    protected readonly toEntity: (row: any) => T,
    jsonColumns?: (keyof T)[], // optional
    geometryColumns?: (keyof T)[] // optional
  ) {
    this.jsonColumns = new Set(jsonColumns?.map(k => this.columns[k]));
    this.geometryColumns = new Set(geometryColumns?.map(k => this.columns[k]));
  }

  protected buildWhere(filters: Partial<T>) {
    const keys = Object.keys(filters) as (keyof T)[];
    const conditions: string[] = [];
    const values: any[] = [];

    let i = 1;
    keys.forEach((key) => {
      const column = this.getColumn(key);
      const value = (filters as any)[key];
      if (value === undefined) return;

      if (this.jsonColumns.has(column)) {
        conditions.push(`${column} @> $${i++}::jsonb`);
        values.push(JSON.stringify(value));
      } else {
        conditions.push(`${column} = $${i++}`);
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
    const sql = `SELECT *${this.geometrySelectSql()} FROM ${this.tableName} ${whereClause} LIMIT 1`;
    const res = await this.pool.query(sql, values);
    if (res.rows.length === 0) return undefined;
    return this.toEntity(this.postProcessGeometry(res.rows[0]));
  }

  async findAllBy(filters: Partial<T>): Promise<T[]> {
    const { whereClause, values } = this.buildWhere(filters);
    const sql = `SELECT *${this.geometrySelectSql()} FROM ${this.tableName} ${whereClause}`;
    const res = await this.pool.query(sql, values);
    return res.rows.map(r => this.toEntity(this.postProcessGeometry(r)));
  }

  async listBy(filters: Partial<T>, page: number, perPage: number): Promise<IPaginated<T>> {
    const { whereClause, values } = this.buildWhere(filters);

    const sql = `
      SELECT *${this.geometrySelectSql()}
      FROM ${this.tableName} ${whereClause}
      OFFSET $${values.length + 1}
      LIMIT $${values.length + 2}
    `;
    const countSql = `SELECT COUNT(*) FROM ${this.tableName} ${whereClause}`;

    const offset = (page - 1) * perPage;
    const res = await this.pool.query(sql, [...values, offset, perPage]);
    const countRes = await this.pool.query(countSql, values);

    return {
      data: res.rows.map(r => this.toEntity(this.postProcessGeometry(r))),
      pagination: {
        total: parseInt(countRes.rows[0].count, 10),
        page,
        perPage,
      }
    };
  }

  async upsert(payload: Partial<T>, conflict_keys: (keyof T)[]): Promise<T> {
    const keys = Object.keys(payload) as (keyof T)[];
    const cols = keys.map(k => this.getColumn(k));
    const conflict_cols = conflict_keys.map(k => this.getColumn(k))
    const placeholders: string[] = []
    const values: any[] = []
    let i = 1;
    keys.forEach((k) => {
      const col = this.getColumn(k);
      const val = (payload as any)[k];

      if (this.jsonColumns.has(col)) {
        placeholders.push(`$${i++}::jsonb`);
        values.push(JSON.stringify(val));
      } else if (this.geometryColumns.has(col)) {
        const v = val as { lat: number, lon: number };
        placeholders.push(`ST_SetSRID(ST_MakePoint($${i++}, $${i++}), 4326)`);
        values.push(v.lon, v.lat)
      } else {
        placeholders.push(`$${i++}`)
        values.push(val)
      }
    });

    const update_cols = cols.filter(col => !conflict_cols.includes(col));

    const sql = `
      INSERT INTO ${this.tableName} (${cols.join(",")})
      VALUES (${placeholders.join(",")})
      ON CONFLICT (${conflict_cols.join(",")})
      DO UPDATE SET
        ${update_cols.map(col => `${col} = EXCLUDED.${col}`).join(", ")}
      RETURNING *
    `;
    const res = await this.pool.query(sql, values);
    return this.toEntity(this.postProcessGeometry(res.rows[0]));
  }

  async create(payload: Partial<T>): Promise<T> {
    const keys = Object.keys(payload) as (keyof T)[];
    const cols = keys.map(k => this.getColumn(k));
    const placeholders: string[] = []
    const values: any[] = []
    let i = 1;
    keys.forEach((k) => {
      const col = this.getColumn(k);
      const val = (payload as any)[k];

      if (this.jsonColumns.has(col)) {
        placeholders.push(`$${i++}:: jsonb`);
        values.push(JSON.stringify(val));
      } else if (this.geometryColumns.has(col)) {
        const v = val as { lat: number, lon: number };
        placeholders.push(`ST_SetSRID(ST_MakePoint($${i++}, $${i++}), 4326)`);
        values.push(v.lon, v.lat)
      } else {
        placeholders.push(`$${i++} `)
        values.push(val)
      }
    });

    const sql = `INSERT INTO ${this.tableName} (${cols.join(",")}) VALUES(${placeholders.join(",")}) RETURNING * `;
    const res = await this.pool.query(sql, values);
    return this.toEntity(this.postProcessGeometry(res.rows[0]));
  }

  async update(id: number | string, payload: Partial<T>): Promise<T> {
    const keys = Object.keys(payload) as (keyof T)[];
    const sets: string[] = [];
    const values: any[] = []
    let i = 1;
    keys.forEach((k) => {
      const col = this.getColumn(k);
      const val = (payload as any)[k];

      if (this.jsonColumns.has(col)) {
        sets.push(`${col} = $${i++}::jsonb`);
        values.push(JSON.stringify(val));
      } else if (this.geometryColumns.has(col)) {
        const v = val as { lat: number, lon: number };
        sets.push(`${col} = ST_SetSRID(ST_MakePoint($${i++}, $${i++}), 4326)`)
        values.push(v.lon, v.lat)
      } else {
        sets.push(`${col} = $${i++}`);
        values.push(val);
      }
    });

    const sql = `UPDATE ${this.tableName} SET ${sets.join(",")} WHERE id = $${i} RETURNING *`;
    const res = await this.pool.query(sql, [...values, id]);
    if (res.rows.length === 0) throw new NotFoundError(`[${this.tableName}] Entity not found with id=${id}`);
    return this.toEntity(this.postProcessGeometry(res.rows[0]));
  }

  async delete(id: number | string): Promise<boolean> {
    const sql = `DELETE FROM ${this.tableName} WHERE id = $1`;
    const res = await this.pool.query(sql, [id]);
    return (res.rowCount ?? -1) > 0;
  }

  /** Add geometry column projections as GeoJSON */
  protected geometrySelectSql(prefix: string = ''): string {
    if (prefix.length > 0) {
      prefix = prefix + "."
    }
    if (this.geometryColumns.size === 0) return '';
    return ", " + Array.from(this.geometryColumns)
      .map(col => `ST_AsGeoJSON(${prefix}${col}) as ${prefix}${col}_geojson`)
      .join(", ");
  }

  async groupByDateBuckets(params: {
    tsColumn: keyof T | string;
    granularity: GroupByDateType;
    filters?: Partial<T>;
    limitPerBucket?: number;
    order?: "ASC" | "DESC";
  }) {
    const {
      tsColumn,
      granularity,
      filters = {},
      limitPerBucket = undefined,
      order = "DESC"
    } = params;

    // map key entity -> DB column
    const colTs = typeof tsColumn === "string" ? tsColumn : this.getColumn(tsColumn);

    // Build group expression
    const groupExpr = this.buildGroupByDateExpression(granularity, colTs);

    // WHERE
    const { whereClause, values } = this.buildWhere(filters);

    // Query raw rows (bucket + data)
    const sql = `
    SELECT 
      ${groupExpr} AS bucket,
      *,
      ${colTs} AS ts_original
    FROM ${this.tableName}
    ${whereClause}
    ORDER BY bucket ${order}, ${colTs} ${order}
  `;

    const res = await this.pool.query(sql, values);

    // Convert to buckets
    return this.bucketMapper(res.rows, {
      bucketField: "bucket",
      metaField: null,
      limitPerBucket,
      entityMapper: (row) => {
        // Remove helper columns
        delete row.bucket;
        delete row.ts_original;
        return this.toEntity(this.postProcessGeometry(row));
      }
    });
  }

  protected bucketMapper<TEntity = T>(rows: any[], opts: {
    bucketField: string;
    metaField?: string | null;
    limitPerBucket?: number;
    entityMapper: (row: any) => TEntity;
  }): IBucketOf<TEntity>[] {

    const {
      bucketField,
      metaField = null,
      limitPerBucket = undefined,
      entityMapper
    } = opts;

    const map = new Map<string, IBucketOf<TEntity>>();

    for (const row of rows) {
      let bucketName = row[bucketField];
      if (!bucketName) continue;

      const bucketKey = typeof bucketName !== 'string' ? JSON.stringify(bucketName) : bucketName
      let bucket = map.get(bucketKey);
      if (!bucket) {
        bucket = {
          bucket_name: bucketName,
          meta: metaField ? row[metaField] : undefined,
          data: []
        };
        map.set(bucketKey, bucket);
      }

      if (!limitPerBucket || bucket.data.length < limitPerBucket) {
        const cloned = { ...row };
        delete cloned[bucketField];
        if (metaField) delete cloned[metaField];

        bucket.data.push(entityMapper(cloned));
      }
    }

    return Array.from(map.values());
  }

  static createRowMapper<T>(mapping: Record<keyof T, string>): (row: any) => T {
    // Return the dynamic callback function
    return (row: any): T => {
      const keys = Object.keys(mapping) as (keyof T)[];

      const transformedRow = keys.reduce((acc, currentKey) => {
        const sourceColumnName = mapping[currentKey];
        acc[currentKey] = row[sourceColumnName];
        if (sourceColumnName === 'local_id') {
          row[sourceColumnName]
        }

        return acc;
      }, {} as T);

      return transformedRow;
    };
  }

  protected postProcessGeometry(row: any): any {
    const row_copy = { ...row }
    for (const col of this.geometryColumns) {
      const geojson = row_copy[`${col}_geojson`];
      if (geojson) {
        row_copy[col] = JSON.parse(geojson);
        delete row_copy[`${col}_geojson`];
      }
    }
    return row_copy;
  }

  protected buildGroupByDateExpression(granularity: GroupByDateType, ts_col: string) {
    switch (granularity) {
      case "second": return `date_trunc('second', ${ts_col})`;
      case "minute": return `date_trunc('minute', ${ts_col})`;
      case "hour": return `date_trunc('hour', ${ts_col})`;
      case "week": return `date_trunc('week', ${ts_col})`;
      case "month": return `date_trunc('month', ${ts_col})`;
      case "day":
      default: return `date_trunc('day', ${ts_col})`;
    }
  }
}
