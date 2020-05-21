interface target {
  [index: string]: any;
  [index: number]: number;
}

class ArrayProxy extends Array {
  constructor(
    accessor: (target: target, key: string) => number, entries: number[], methods: string[],
  ) {
    if (entries.length === 1) {
      super(1);
      [this[0]] = entries;
    } else super(...entries);

    return new Proxy(
      this,
      {
        get: (target: target, key: string) => {
          if (/^-?\d+$/.test(key)) return accessor(target, key);

          if (typeof target[key] === 'function' && !methods.includes(key)) {
            target[key].call(entries);
            return target[key]();
          }

          return target[key];
        },
      },
    );
  }
}

export default ArrayProxy;
