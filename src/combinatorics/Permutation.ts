// eslint-disable-next-line no-unused-vars
import util, { InspectOptions } from 'util';

import {
  ArrayProxy, FunctionProxy, Ring, overload, lcm, arrEquals, boundSort,
} from '../utils';
import { Cycle } from '.';

class Permutation extends FunctionProxy {
  readonly input: number[] = [];
  readonly output: number[] = [];
  readonly cycles: Ring<Cycle>;
  readonly type: ArrayProxy<number>;
  readonly transpositions: Ring<Cycle>;
  readonly fixedPoints: number
  readonly order: number;
  readonly inversions: number;
  readonly sign: number;

  constructor(input: number[], output: number[]);
  constructor(output: number[]);
  constructor(cycles: Ring<Cycle>);
  constructor(cycles: Cycle);

  constructor(...args: [number[], number[]] | [number[]] | [Ring<Cycle>] | [Cycle]) {
    super({
      apply: (_target, _thisArg, [input]) => (
        this.input.includes(input) ? this.output[this.input.indexOf(input)] : input
      ),
    });

    const properties = overload(args, {
      '(Array<Number>, Array<Number>)': (input: number[], output: number[]) => {
        if (!arrEquals([...input].sort((a, b) => a - b), [...output].sort((a, b) => a - b))) {
          throw Error('Permutations must map a set to itself');
        }
        if (!arrEquals(input, [...new Set(input)])) {
          throw Error('Sets cannot contain duplicate elements');
        }

        return { input, output };
      },
      '(Array<Number>)': (output: number[]) => {
        if (!arrEquals(output, [...new Set(output)])) {
          throw Error('Sets cannot contain duplicate elements');
        }

        return { input: [...output].sort((a, b) => a - b), output };
      },
      '(Ring<Cycle>)': (cycles: Ring<Cycle>) => (
        Cycle.composeCycles(cycles).reduce<{ input: number[], output: number[]}>(
          ({ input, output }, next) => ({
            input: [...input, ...next],
            output: [...output, ...[...next].map((element) => next(element))],
          }),
          { input: [], output: [] },
        )
      ),
      '(Cycle)': (cycle: Cycle) => (
        [...cycle]
          .reduce(
            ({ input, output }, next) => ({
              input: [...input, next], output: [...output, cycle(next)],
            }),
            { input: [], output: [] },
          )
      ),
    });

    Object.assign(this, properties);

    this.output = boundSort(this.output, this.input, (a, b) => a - b);
    this.input.sort((a, b) => a - b);

    this.cycles = Cycle.toDisjointCycles(this);
    this.type = new ArrayProxy<number>(
      (target, key) => target[+key - 1],
      this.cycles.reduce((acc, { length }) => {
        acc[length - 1] += 1;
        return acc;
      }, Array(this.input.length).fill(0)),
    );

    this.transpositions = this.cycles.reduce(
      (acc, next) => (
        new Ring(
          ...acc, ...[...next].slice(0, -1).map((entry, i) => new Cycle(entry, [...next][i + 1])),
        )
      ),
      new Ring<Cycle>(),
    );

    this.fixedPoints = this.cycles.reduce((acc, { length }) => acc + +(length === 1), 0);

    this.order = lcm(...this.cycles.map(({ length }) => length));
    this.inversions = this.transpositions.length;
    this.sign = (-1) ** this.inversions;
  }

  [util.inspect.custom](_depth: number, options: InspectOptions) {
    let intermediate: string = '';
    if (options.maxStringLength !== Number.MAX_SAFE_INTEGER) {
      intermediate = util.inspect(this, { maxStringLength: Number.MAX_SAFE_INTEGER, colors: true }).replace('[Function: anonymous] ', '');
    }
    return intermediate || this;
  }

  get length() {
    return this.input.length;
  }

  compose(permutation: Permutation) {
    return new Permutation(this.input, this.output.map((entry) => permutation(entry)));
  }

  pow(n: number) {
    if (!Number.isInteger(n)) throw Error('Permutations only have integer powers.s');
    return Array(Math.abs(n))
      .fill(n < 0 ? this.inverse() : this)
      .reduce((acc, next) => acc.compose(next));
  }

  inverse() {
    return new Permutation(
      [...this.output].sort((a, b) => a - b),
      boundSort(this.input, this.output, (a, b) => a - b),
    );
  }

  equals(permutation: Permutation) {
    return arrEquals(this.input, permutation.input) && arrEquals(this.output, permutation.output);
  }
}

export default Permutation;
