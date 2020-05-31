// import { Matrix } from '.';

// class Vector extends Matrix {
//   constructor(entries: number[][]) {
//     super(entries);
//   }

//   magnitude() {
//     Math.sqrt(this.reduce((acc, next) => acc + next ** 2, 0));
//   }

//   dotProduct(vector) {
//     return this.reduce((acc, next, i) => acc + this[i] * vector[i], 0);
//   }

//   angleBetween(vector) {
//     return Math.acos(this.dotProduct(vector) / (this.magnitude() * vector.magnitude()));
//   }
// }

// module.exports = Vector;
