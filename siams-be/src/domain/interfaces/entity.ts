type OptionalId<T> = Omit<T, "id"> & Partial<{ id?: string | number }>

export default class Entity<T, PrimaryKeyType extends string | number> {
  public id!: PrimaryKeyType;

  constructor(attrs?: OptionalId<T>) {
    if (attrs) {
      Object.assign(this, attrs)
    }
  }
}
