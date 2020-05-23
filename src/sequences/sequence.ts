import { ArrayProxy } from '../utils';

class Sequence extends ArrayProxy {
  constructor(fn: (n: number, sequence: number[]) => number, init: number[] = []) {
    super(
      (_target, n) => {
        if (!Number.isInteger(+n)) throw Error('Sequence index must be an integer.');
        if (+n >= 0 && +n < init.length) return init[+n];
        return fn.call(this, +n, this);
      },
      [],
    );
  }

  subSequence(start: number, end: number): number[] {
    return Array.from({ length: end - start }).fill(null).map((_item, i) => this[start + i]);
  }

  sum(n: number): number {
    return this.subSequence(0, n).reduce((acc, next) => acc + next, 0);
  }
}

export default Sequence;
