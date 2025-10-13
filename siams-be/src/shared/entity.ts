/* eslint-disable @typescript-eslint/no-extraneous-class */

export default class Entity<T> {
  constructor(attrs?: Partial<T>) {
    if (attrs) {
      Object.assign(this, attrs)
    }
  }
}
