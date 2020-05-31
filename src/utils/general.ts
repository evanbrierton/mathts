// eslint-disable-next-line no-unused-vars
import { InspectOptionsStylized, Style } from 'util';

interface NestedArray<T> extends Array<T | NestedArray<T>> { }
export type Constructor<T extends {} = {}> = new (...args: any[]) => T;

export const getMethods = (Class: Constructor) => (
  Object.getOwnPropertyNames(Class.prototype).filter((method) => method !== 'constructor')
);

export const arrEquals = (...arrays: NestedArray<any>[]): boolean => (
  arrays.every((arr) => JSON.stringify(arr) === JSON.stringify(arrays[0]))
);

const getType = (value: any): string => (
  value.constructor.name + (
    Array.isArray(value)
    && value.every((entry: any) => entry.constructor.name === value[0].constructor.name)
      ? `<${getType(value[0])}>`
      : ''
  )
);

export const overload = (args: any[], constructors: {[index: string]: ((...args: any) => any)}) => {
  const key = `(${args.map((arg) => getType(arg)).join(', ')})`;
  if (Object.keys(constructors).includes(key)) {
    return constructors[key](...args);
  }

  throw TypeError(`The caller has no constructor overload for arguments ${key}`);
};

export const gcd = (...args: number[]) => {
  const binaryGCD = (a: number, b: number): number => (b === 0 ? a : binaryGCD(b, a % b));
  return args.reduce((acc, next) => binaryGCD(acc, next));
};

export const lcm = (...args: number[]) => (
  args.length === 1
    ? args[0]
    : [...new Set(args)].reduce((acc, next) => acc * next) / gcd(...new Set(args))
);

export const boundSort = (arr: any[], template: any[], compareFn: (a: any, b: any) => number) => {
  const copy = [...arr];
  copy.sort((a, b) => compareFn(template[arr.indexOf(a)], template[arr.indexOf(b)]));
  return copy;
};

export const styliseArray = (arr: any[], type: Style, { stylize }: InspectOptionsStylized) => (
  `[ ${`${arr.map((entry) => stylize(entry, type))}`.replace(/,/g, ', ')} ]`
);

export const roundToFixed = (value: number, places: number) => (
  Math.round((value + Number.EPSILON) * 10 ** places) / (10 ** places)
);

export const sum = (k: number, n: number, fn: (term: number) => number) => (
  Array.from({ length: n + 1 - k }, (_term, i) => fn(i + k)).reduce((acc, next) => acc + next, 0)
);

export const product = (k: number, n: number, fn: (term: number) => number) => (
  Array.from({ length: n + 1 - k }, (_term, i) => fn(i + k)).reduce((acc, next) => acc * next, 0)
);
