// eslint-disable-next-line import/prefer-default-export
export const getMethods = (Class: new () => object) => (
  Object.getOwnPropertyNames(Class.prototype).filter((method) => method !== 'constructor')
);
