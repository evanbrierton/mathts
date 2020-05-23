import { getMethods } from '.';

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
          if (typeof key === 'string' && /^-?\d+$/.test(key)) return accessor(target, key);
          if (key.constructor.name === 'Symbol') {
            return (...args: any[]) => target[key](...args);
          }
          return target[key];
        },
      },
    );
  }
}

export default ArrayProxy;
