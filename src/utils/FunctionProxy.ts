class FunctionProxy extends Function {
  [key: string]: any;

  constructor(handler: ProxyHandler<FunctionProxy>) {
    super();
    return new Proxy(this, {
      get: (target, key) => {
        if (key === 'name') return this.constructor.name;
        if (typeof key === 'string' && ['arguments', 'caller'].includes(key)) return undefined;
        return handler.get ? handler.get(target, key, this) : Reflect.get(target, key);
      },
      ...handler,
    });
  }
}

export default FunctionProxy;
