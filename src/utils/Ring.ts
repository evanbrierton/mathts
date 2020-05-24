import { ArrayProxy } from '.';

class Ring<T> extends ArrayProxy<T> {
  constructor(...entries: T[]) {
    super(
      (target, key) => target[((+key % target.length) + target.length) % target.length],
      entries,
    );
  }

  shiftLeft(n = 1) {
    return new Ring(...this.map((_entry, i) => this[i + n]));
  }

  shiftRight(n = 1) {
    return new Ring(...this.map((_entry, i) => this[i - n]));
  }

  test(n: number) {
    return this[n];
  }
}

export default Ring;
