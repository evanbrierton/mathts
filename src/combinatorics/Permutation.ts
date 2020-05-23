import { ArrayProxy, overload } from '../utils';

class Permutation extends ArrayProxy {
  public input!: number[];
  public output!: number[];

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
  }
}

export default Permutation;
