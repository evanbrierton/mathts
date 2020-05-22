import { ArrayProxy, getMethods, overload } from '../utils';

class Permutation extends ArrayProxy {
  public input: number[] = [];

  public output: number[] = [];

  constructor(input: number[], output: number[]);

  constructor(output: number[]);

  constructor(...args: number[][]) {
    super(
      (_target, key) => (
        this.input.includes(+key)
          ? this.output[this.input.indexOf(+key)]
          : +key
      ),
      [],
      getMethods(Permutation),
    );

    overload(
      args,
      {
        '(Array)': (output: number[]) => {
          this.input = Array.from({ length: output.length }, (_entry, i) => i + 1);
          this.output = output;
        },
        '(Array, Array)': (input: number[], output: number[]) => {
          this.input = input;
          this.output = output;
        },
      },
    );
  }
}

export default Permutation;
