/* eslint-disable @typescript-eslint/no-extraneous-class */

export default class Entity<T, PrimaryKeyType extends string | number> {
  public id: PrimaryKeyType;

  constructor(attrs?: T) {
    if (attrs) {
      Object.assign(this, attrs)
    }
  }
}
