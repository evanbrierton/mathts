import { FunctionProxy } from '../utils';

class Polynomial extends FunctionProxy {
  constructor(coefficients: number[]) {
    super({
      apply: (_target, _thisArg, [input]) => (
        coefficients
          .reduce((acc, next, i) => acc + next * input ** (coefficients.length - i - 1), 0)
      ),
    });
  }
}

export default Polynomial;
