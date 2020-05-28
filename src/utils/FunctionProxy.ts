class FunctionProxy extends Function {
  constructor(fn: (...args: any[]) => any) {
    super();

    return new Proxy(this, { apply: fn });
  }
}

export default FunctionProxy;
