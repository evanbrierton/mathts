class ArrayProxy<T> extends Array<T> {
  constructor(
    accessor: (target: ArrayProxy<T>, key: string) => T, entries: T[],
  ) {
    if (entries.length === 1) {
      super(1);
      [this[0]] = entries;
    } else super(...entries);

    return new Proxy(
      this,
      {
        get: (target: ArrayProxy<T>, key: string) => {
          if (typeof key === 'string' && /^-?\d+$/.test(key)) return accessor(target, key);
          return Reflect.get(target, key);
        },
      },
    );
  }
}

export default ArrayProxy;
