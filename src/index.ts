import { Permutation, Cycle } from './combinatorics';

// import * as utils from './utils';

export * from './utils';
export * from './geometry';
export * from './combinatorics';

const P = new Permutation(new Cycle(1, 2, 3));

console.log(P);
