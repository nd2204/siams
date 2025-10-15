/* eslint-disable @typescript-eslint/no-extraneous-class */

export default class Entity<T extends { id: PrimaryKeyType }, PrimaryKeyType extends string | number> {
  public id: PrimaryKeyType;

  constructor(attrs?: Partial<T>) {
    if (attrs) {
      Object.assign(this, attrs)
    }
  }
}
