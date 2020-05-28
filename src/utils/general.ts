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

export const overload = (args: any[], constructors: {[index: string]: ((...args: any) => any)}) => {
  const key = `(${args.map((arg) => arg.constructor.name).join(', ')})`;
  if (Object.keys(constructors).includes(key)) constructors[key](...args);
  else throw TypeError(`The caller has no constructor overload for arguments ${key}`);
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
