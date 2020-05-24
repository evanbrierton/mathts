import {
  ArrayProxy, Ring, overload, lcm, arrEquals, boundSort,
} from '../utils';
import { Cycle } from '.';

class Permutation extends ArrayProxy<number> {
  public input: number[] = [];
  public output: number[] = [];
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

  constructor(...args: (number[] | Ring<Cycle>)[]) {
    super(
      (_target, key) => (this.input.includes(+key) ? this.output[this.input.indexOf(+key)] : +key),
      [],
    );

    overload(args, {
      '(Array, Array)': (input: number[], output: number[]) => {
        if (!arrEquals([...input].sort((a, b) => a - b), [...output].sort((a, b) => a - b))) {
          throw Error('Permutations must map a set to itself.');
        }
        if (!arrEquals(input, [...new Set(input)])) {
          throw Error('Sets cannot contain duplicate elements');
        }

        this.input = input;
        this.output = output;
      },
      '(Array)': (output: number[]) => {
        if (!arrEquals(output, [...new Set(output)])) {
          throw Error('Sets cannot contain duplicate elements');
        }

        this.input = [...output].sort((a, b) => a - b);
        this.output = output;
      },
      '(Ring)': (cycles: Ring<Cycle>) => {
        const elements = Cycle.composeCycles(cycles);
        elements.forEach((cycle) => [...cycle].forEach(((element) => {
          this.input.push(element);
          this.output.push(cycle[element]);
        })));
      },
      '(Cycle)': (cycle: Cycle) => {
        [...cycle].forEach(((element) => {
          this.input.push(element);
          this.output.push(cycle[element]);
        }));
      },
    });

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

  compose(permutation: Permutation) {
    return new Permutation(this.input, this.output.map((entry) => permutation[entry]));
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
