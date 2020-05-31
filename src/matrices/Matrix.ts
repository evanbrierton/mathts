import { Group } from '../combinatorics';
import { overload } from '../utils';

class Matrix {
  public entries!: number[][];
  public rows!: number;
  public columns!: number;
  public square!: boolean;
  public det: number;
  [index: number]: number[];

  constructor(rows: number[][]);
  constructor(rows: number, columns: number, callback: (i: number, j: number) => number)

  constructor(...args: [number[][]] | [number, number, (i: number, j: number) => number]) {
    const matrix = overload(args, {
      '(Array<Array<Number>>)': (rows: number[][]) => {
        rows.forEach((row) => {
          if (row.length !== rows[0].length) throw Error('All rows must be of the same length.');
        });

        this.rows = rows.length;
        this.columns = rows[0].length;
        this.square = rows.length === rows[0].length;
        this.entries = rows;

        return new Proxy(this, {
          get: (target, key) => {
            if (typeof key === 'symbol') return Reflect.get(target, key);
            if (Number.isInteger(+key)) return rows[+key];
            return Reflect.get(target, key);
          },
        });
      },
      '(Number, Number, Function)': (rows: number, columns: number, generator: (i: number, j: number) => number) => (
        Matrix.generate(rows, columns, generator)
      ),
    });

    this.det = [...Group.symmetricGroup(this.rows)]
      .reduce(
        (sum, permutation) => (
          sum + permutation.sign * this.entries.reduce(
            (product, row, i) => product * row[permutation(i + 1) - 1], 1,
          )
        ),
        0,
      );

    return matrix;
  }

  static generate(
    rows: number, columns: number, callback: (i: number, j: number) => number,
  ) {
    return new Matrix(
      Array.from({ length: rows })
        .map((_row, i) => (Array.from({ length: columns }).map((_entry, j) => callback(i, j)))),
    );
  }

  [Symbol.iterator]() {
    let i = 0;
    return {
      next: () => {
        if (i >= this.rows * this.columns) {
          return { value: { entry: NaN, i: NaN, j: NaN }, done: true };
        }
        console.log(Math.floor(i / this.columns));
        const value = {
          entry: (
            this[Math.floor(i / this.columns)][i - Math.floor(i / this.columns) * this.columns]
          ),
          i: Math.floor(i / this.columns),
          j: i - Math.floor(i / this.columns) * this.columns,
        };
        i += 1;
        return {
          value,
          done: false,
        };
      },
      [Symbol.iterator]() { return this; },
    };
  }

  // Array methods

  map(callback: (entry: number, i: number, j: number, matrix: Matrix) => number) {
    const matrix: number[][] = Array.from({ length: this.rows }, () => []);

    [...this].forEach(({ entry, i, j }) => {
      matrix[i][j] = callback(entry, i, j, this);
    });

    return new Matrix(matrix);
  }

  toArray() {
    const array: number[][] = Array.from({ length: this.rows }, () => []);

    [...this].forEach(({ entry, i, j }) => {
      array[i][j] = entry;
    });

    return array;
  }

  // Generators

  static identity(n: number) {
    return Matrix.generate(n, n, (i, j) => (i === j ? 1 : 0));
  }

  static zero(n: number) {
    return Matrix.generate(n, n, () => 0);
  }

  static random(n: number, m: number, min: number, max: number) {
    return Matrix.generate(n, m, () => Math.floor(Math.random() * (max - min) + min));
  }

  // Basic operations

  scale(scalar: number) {
    return this.map((entry) => entry * scalar);
  }

  add(matrix: Matrix, scalar = 1) {
    if (this.rows !== matrix.rows || this.columns !== matrix.columns) throw Error('Matrices must be of the same dimensions.');
    return Matrix.generate(this.rows, this.columns, (i, j) => this[i][j] + scalar * matrix[i][j]);
  }

  subtract(matrix: Matrix, scalar = 1) {
    return this.add(matrix, -scalar);
  }

  // times(matrix: Matrix) {
//   if (this.columns !== matrix.rows) throw Error('Cannot multiply matrices of these dimensions.');
  //   return Matrix.generate(this.rows, matrix.columns, (i, j) => (
  //     this.isolateRow(i).dotProduct(matrix.isolateColumn(j))
  //   ));
  // }
}

export default Matrix;
