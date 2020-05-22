// eslint-disable-next-line import/prefer-default-export
export interface NestedArray<T> extends Array<T | NestedArray<T>> { }

export const getMethods = (Class: new () => object) => (
  Object.getOwnPropertyNames(Class.prototype).filter((method) => method !== 'constructor')
);

export const arrEquals = (a: NestedArray<number>, b: NestedArray<number>): boolean => (
  JSON.stringify(a) === JSON.stringify(b)
);
