import { Permutation } from '.';
import { ArrayProxy, Ring, arrEquals } from '../utils';

class Cycle extends ArrayProxy<number> {
  constructor(...entries: number[]) {
    if ([...new Set(entries)].length !== entries.length) {
      throw Error('Cycles cannot contain duplicate elements');
    }
    // eslint-disable-next-line no-underscore-dangle
    let _entries = new Ring<number>(...entries);

    while (_entries[0] !== Math.min(...entries)) _entries = _entries.shiftRight();

    super(
      (_target, key) => (
        entries.includes(+key)
          ? new Ring(...entries)[entries.indexOf(+key) + 1]
          : +key
      ),
      _entries,
    );
  }

  private static generateDisjointCycles(input: number[], getNext: (next: number) => number) {
    const elements = [...new Set([...input].sort((a, b) => a - b))];
    const cycles = new Ring<number[]>();

    while (elements.length) {
      cycles.push([]);
      let next = elements[0];
      do {
        cycles[-1].push(next);
        elements.splice(elements.indexOf(next), 1);
        next = getNext(next);
      } while (next !== cycles[-1][0]);
    }

    return new Ring(...cycles.map((cycle) => new Cycle(...cycle)));
  }

  static composeCycles(cycles: (Ring<Cycle> | Array<Cycle>)) {
    return Cycle.generateDisjointCycles(
      cycles.map((cycle) => [...cycle]).flat(1),
      ((next) => cycles.reduceRight((acc, cycle) => cycle[acc], next)),
    );
  }

  static toDisjointCycles(permutation: Permutation) {
    return Cycle.generateDisjointCycles(permutation.input, (next) => permutation[next]);
  }

  compose(cycle: Cycle) {
    return Cycle.generateDisjointCycles([...this, ...cycle], (next) => this[cycle[next]]);
  }

  equals(cycle: Cycle) {
    return arrEquals([...this], [...cycle]);
  }

  toPermutation() {
    return new Permutation(this);
  }

  toTranspositions() {
    return new Permutation(this).transpositions;
  }
}

export default Cycle;
