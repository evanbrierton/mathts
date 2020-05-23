class ArrayProxy<T> extends Array<T> {
  constructor(
    accessor: (target: any, key: string) => T, entries: T[],
  ) {
    if (entries.length === 1) {
      super(1);
      [this[0]] = entries;
    } else super(...entries);

    return new Proxy(
      this,
      {
        get: (target: any, key: string) => {
          if (/^-?\d+$/.test(key)) return accessor(target, key);
          return target[key];
        },
      },
    );
  }
}

export default ArrayProxy;
