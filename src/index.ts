import { Group } from './combinatorics';

export * from './combinatorics';
export * from './geometry';
export * from './sequences';
export * from './utils';

// eslint-disable-next-line no-unused-expressions

// const A = new Matrix(3, 3, (i, j) => i * j);

console.log(Group.symmetricGroup(3).size);
