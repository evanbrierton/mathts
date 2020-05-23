// eslint-disable-next-line no-unused-vars
import { Permutation } from '.';
import { ArrayProxy, Ring } from '../utils';

class Cycle extends ArrayProxy {
  constructor(...entries: number[]) {
    if (Array.from(new Set(entries)).length !== entries.length) {
      throw Error('Cycles cannot contain duplicate elements');
    }

    super(
      (_target, key) => (
        entries.includes(+key)
          ? new Ring(...entries)[entries.indexOf(+key) + 1]
          : +key
      ),
      entries,
    );
  }

  static toDisjointCycles(permutation: Permutation) {
    const elements = [...permutation.input].sort((a, b) => a - b);
    const cycles = new Ring();

    while (elements[0]) {
      cycles.push(new Cycle());
      let next = elements[0];
      do {
        cycles[-1].push(next);
        elements.splice(elements.indexOf(next), 1);
        next = permutation[next];
      } while (next !== cycles[-1][0]);
    }

    return cycles;
  }
}

export default Cycle;
