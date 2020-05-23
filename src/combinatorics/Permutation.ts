// eslint-disable-next-line no-unused-vars
import { ArrayProxy, overload } from '../utils';
import { Cycle } from '.';

class Permutation extends ArrayProxy<number> {
  public input!: number[];
  public output!: number[];
  readonly cycles: Array<Cycle>;

  constructor(input: number[], output: number[]);
  constructor(output: number[]);

  constructor(...args: number[][]) {
    super(
      (_target, key) => (this.input.includes(+key) ? this.output[this.input.indexOf(+key)] : +key),
      [],
    );

    overload(args, {
      '(Array)': (output: number[]) => {
        this.input = [...output].sort((a, b) => a - b);
        this.output = output;
      },
      '(Array, Array)': (input: number[], output: number[]) => {
        this.input = input;
        this.output = output;
      },
    });

    this.cycles = Cycle.toDisjointCycles(this);
  }
}

export default Permutation;
