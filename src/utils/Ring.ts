import { ArrayProxy, getMethods } from '.';

class Ring extends ArrayProxy {
  constructor(...entries: number[]) {
    super(
      (target, key) => target[((+key % target.length) + target.length) % target.length],
      entries,
      getMethods(Array),
    );
  }

  shift(n = 1) {
    return this.map((_entry, i, ring) => ring[i - n]);
  }
}

export default Ring;
