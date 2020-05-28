// eslint-disable-next-line no-unused-vars
import util, { InspectOptionsStylized } from 'util';

import { Permutation } from '.';
import {
  Ring, FunctionProxy, arrEquals, styliseArray,
} from '../utils';

class Cycle extends FunctionProxy {
  readonly order: number;
  [key: string]: any;

  constructor(...entries: number[]) {
    super({
      get: (target, key: string) => {
        if (typeof key === 'symbol') return Reflect.get(target, key);
        if (Number.isInteger(+key)) return new Ring(...entries)[+key];
        if (key === 'length') return this.order;
        return target[key];
      },

      apply: (_target, _thisArg, args) => (
        entries.includes(+args[0])
          ? new Ring(...entries)[entries.indexOf(+args[0]) + 1]
          : +args[0]
      ),
    });

    if ([...new Set(entries)].length !== entries.length) {
      throw Error('Cycles cannot contain duplicate elements');
    }

    this.order = entries.length;
  }

  [Symbol.iterator]() {
    const cycle = this;
    let i = 0;
    let value = this[0];
    return {
      next() {
        if (i >= cycle.order) return { done: true };
        value = cycle(value);
        i += 1;
        return { value, done: false };
      },
      [Symbol.iterator]() { return this; },
    };
  }

  [util.inspect.custom](_depth: number, options: InspectOptionsStylized) {
    return `${this.constructor.name}(${this.length}) ${styliseArray([...this], 'number', options)}`;
  }

  get length() {
    return this.order;
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
      ((next) => cycles.reduceRight((acc, cycle) => cycle(acc), next)),
    );
  }

  static toDisjointCycles(permutation: Permutation) {
    return Cycle.generateDisjointCycles(permutation.input, (next) => permutation(next));
  }

  compose(cycle: Cycle) {
    return new Permutation(
      Cycle.generateDisjointCycles([...this, ...cycle], (next) => this(cycle(next))),
    );
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
