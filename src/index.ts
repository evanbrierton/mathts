import { Matrix } from './matrices';

export * from './combinatorics';
export * from './geometry';
export * from './sequences';
export * from './utils';

const M = new Matrix();

const padLength = [...M].reduce((acc, { entry }) => Math.max(entry.toString().length, acc), 0);

console.log(padLength);