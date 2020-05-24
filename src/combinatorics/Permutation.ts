import {
  // eslint-disable-next-line no-unused-vars
  ArrayProxy, Ring, overload, lcm, arrEquals,
} from '../utils';
import { Cycle } from '.';

class Permutation extends ArrayProxy<number> {
  public input!: number[];
  public output!: number[];
  readonly cycles: Ring<Cycle>;
  readonly type: ArrayProxy<number>;
  readonly transpositions: Ring<Cycle>;
  readonly fixedPoints: number
  readonly order: number;
  readonly id: number;
  readonly inversions: number;
  readonly sign: number;

  constructor(input: number[], output: number[]);
  constructor(output: number[]);

  constructor(...args: number[][]) {
    super(
      (_target, key) => (this.input.includes(+key) ? this.output[this.input.indexOf(+key)] : +key),
      [],
    );

    overload(args, {
      '(Array, Array)': (input: number[], output: number[]) => {
        this.input = input;
        this.output = output;
      },
      '(Array)': (output: number[]) => {
        this.input = [...output].sort((a, b) => a - b);
        this.output = output;
      },
    });

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

    this.order = lcm(...this.cycles.map((cycle) => cycle.length));
    this.id = this.order + 1;
    this.inversions = this.transpositions.length;
    this.sign = (-1) ** this.inversions;
  }

  compose(permutation: Permutation) {
    return new Permutation(this.input, this.output.map((entry) => permutation[entry]));
  }

  pow(n: number) {
    return Array(Math.abs(n))
      .fill(n < 0 ? this.inverse() : this)
      .reduce((acc, next) => acc.compose(next));
  }

  inverse() {
    return new Permutation(
      [...this.output].sort((a, b) => a - b),
      [...this.input].sort(
        (a, b) => this.output[this.input.indexOf(a)] - this.output[this.input.indexOf(b)],
      ),
    );
  }

  equals(permutation: Permutation) {
    return arrEquals(this.input, permutation.input) && arrEquals(this.output, permutation.output);
  }
}

export default Permutation;
