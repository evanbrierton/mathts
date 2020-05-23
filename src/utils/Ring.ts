import { ArrayProxy } from '.';

class Ring extends ArrayProxy {
  constructor(...entries: number[]) {
    super(
      (target, key) => target[((+key % target.length) + target.length) % target.length],
      entries,
    );
  }

  shiftRight(n = 1) {
    return this.map((_entry, i) => this[i - n]);
  }
}

export default Ring;
