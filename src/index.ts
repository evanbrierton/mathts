// import { Cycle } from './combinatorics';
import { Matrix } from './matrices';

export * from './combinatorics';
export * from './geometry';
export * from './sequences';
export * from './utils';

// eslint-disable-next-line no-unused-expressions

// const A = new Matrix(3, 3, (i, j) => i * j);

console.log(new Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]).scale(2));
