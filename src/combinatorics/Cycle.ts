// eslint-disable-next-line no-unused-vars
import { Permutation } from '.';
import { ArrayProxy, Ring } from '../utils';

class Cycle extends ArrayProxy<number> {
  constructor(...entries: number[]) {
    if ([...new Set(entries)].length !== entries.length) {
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
    const cycles = new Ring<number[]>();

    while (elements[0]) {
      cycles.push([]);
      let next = elements[0];
      do {
        cycles[-1].push(next);
        elements.splice(elements.indexOf(next), 1);
        next = permutation[next];
      } while (next !== cycles[-1][0]);
    }

    return cycles.map((cycle) => new Cycle(...cycle));
  }

  compose(cycle: Cycle) {
    const elements = Array.from(new Set([...this, ...cycle])).sort((a, b) => a - b);
    const cycles = new Ring<number[]>();

    while (elements[0]) {
      cycles.push([]);
      let next = elements[0];
      do {
        cycles[-1].push(next);
        elements.splice(elements.indexOf(next), 1);
        next = this[cycle[next]];
      } while (next !== cycles[-1][0]);
    }

    return cycles.map((i) => new Cycle(...Array.from(i)));
  }

  test(n: number) {
    return this[n];
  }
}

export default Cycle;
