import util from 'util';

import { Vector } from '.';
import { Group } from '../combinatorics';
import { overload, arrEquals } from '../utils';

class Matrix extends Array {
  readonly rows!: number;
  readonly columns!: number;
  readonly square!: boolean;
  readonly det: number | undefined;
  [index: number]: number[];
  [key: string]: any;

  constructor(rows: number[][]);
  constructor(rows: number, columns: number, callback: (i: number, j: number) => number);

  constructor(...args: [number[][]] | [number, number, (i: number, j: number) => number]) {
    const entries = args as number[];

    super(...entries.flat().map((row) => row.map((entry: number) => +entry.toFixed(2) || 0)));

    const matrix = overload(args, {
      '(Array<Array<Number>>)': (rows: number[][]) => {
        rows.forEach((row) => {
          if (row.length !== rows[0].length) throw Error('All rows must be of the same length.');
        });

        return {
          rows: rows.length,
          columns: rows[0].length,
          square: rows.length === rows[0].length,
          det: rows.length === rows[0].length ? [...Group.symmetricGroup(rows.length)]
            .reduce(
              (sum, permutation) => (
                sum + permutation.sign * this.reduce(
                  (product, row, i) => product * row[permutation(i + 1) - 1], 1,
                )
              ),
              0,
            ) : undefined,
        };
      },
      '(Number, Number, Function)': (rows: number, columns: number, generator: (i: number, j: number) => number) => (
        Matrix.generate(rows, columns, generator)
      ),
    });

    Object.assign(this, matrix);

    if ((this.rows === 1 || this.columns === 1) && this.constructor !== Vector) {
      return new Vector(this.toArray());
    }
  }

  static generate(
    rows: number, columns: number, callback: (i: number, j: number) => number,
  ) {
    return new Matrix(
      Array.from(
        { length: rows },
        (_row, i) => Array.from({ length: columns }, (_entry, j) => callback(i, j)),
      ),
    );
  }

  [Symbol.iterator]() {
    let i = 0;
    return {
      next: () => {
        if (i >= this.rows * this.columns) {
          return { value: { entry: NaN, i: NaN, j: NaN }, done: true };
        }
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

  [util.inspect.custom]() {
    console.log(`Matrix(${this.rows} × ${this.columns}) [`);
    console.table(this.toArray());
    Object.getOwnPropertyNames(this)
      .filter(
        (property) => (
          !Object.getOwnPropertyNames(Array.from({ length: this.length })).includes(property)
        ),
      )
      .forEach((key) => {
        if (this[key] !== undefined) console.log(`   ${key}:`, this[key]);
      });
    return ']';
  }

  // Propertires

  get upperTriangular() {
    return [...this].filter(({ i, j }) => j < i).every(({ entry }) => entry === 0);
  }

  get lowerTriangular() {
    return [...this].filter(({ i, j }) => j > i).every(({ entry }) => entry === 0);
  }

  get triangular() {
    return this.lowerTriangular || this.upperTriangular;
  }

  get diagonal() {
    return this.lowerTriangular && this.upperTriangular;
  }

  get symmetric() {
    return this === this.transpose();
  }

  get skewSymmetric() {
    return this === this.transpose().scale(-1);
  }

  get orthogonal() {
    return this.transpose() === this.inverse();
  }

  // Array methods

  mapEntries(callback: (entry: number, i: number, j: number, matrix: Matrix) => number) {
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

  trace() {
    return [...this].filter(({ i, j }) => i === j).reduce((sum, { entry }) => sum + entry, 0);
  }

  // Entry operations

  minor(i: number, j: number): number {
    if (!this.square) throw Error('Only square matrices have minors.');
    return this.removeRow(i).removeColumn(j).det || NaN;
  }

  cofactor(i: number, j: number) {
    if (!this.square) throw Error('Only square matrices have cofactors.');
    return (-1) ** (i + j) * this.minor(i, j);
  }

  // Row operations

  getRow(n: number) {
    return new Vector(this.toArray().filter((_row, i) => i === n));
  }

  getColumn(n: number) {
    return new Vector(this.toArray().map((row) => row.filter((_entry, i) => i === n)));
  }

  removeRow(n: number) {
    return new Matrix(this.toArray().filter((_row, i) => i !== n));
  }

  removeColumn(n: number) {
    return new Matrix(this.toArray().filter((row) => row.filter((_entry, i) => i !== n)));
  }

  swapRows(n: number, m: number) {
    const { rows } = this;
    if (n < 0 || rows < n) throw Error(`Row ${n} is out of bounds`);
    if (m < 0 || rows < m) throw Error(`Row ${m} is out of bounds`);
    const matrix = this.clone();
    [matrix[n], matrix[m]] = [matrix[m], matrix[n]];
    return matrix;
  }

  changeRow(row: number, fn: (value: number, index: number, row: number[]) => number) {
    if (row >= this.length) throw Error('The matrix does not contain that many rows.');
    const A = this.clone();

    A[row] = A[row].map(fn);

    console.log(A[row], row);

    return A;
  }

  addRow(targetRow: number, row: number, scalar = 1) {
    console.log(scalar);
    return this.changeRow(targetRow, (entry, j) => entry + scalar * this[row][j]);
  }

  subtractRow(targetRow: number, row: number, scalar = 1) {
    return this.addRow(targetRow, row, -scalar);
  }

  // Basic operations

  equals(matrix: Matrix) {
    return arrEquals(this.toArray(), matrix.toArray());
  }

  scale(scalar: number) {
    return this.mapEntries((entry) => entry * scalar);
  }

  add(matrix: Matrix, scalar = 1) {
    if (this.rows !== matrix.rows || this.columns !== matrix.columns) throw Error('Matrices must be of the same dimensions.');
    return Matrix.generate(this.rows, this.columns, (i, j) => this[i][j] + scalar * matrix[i][j]);
  }

  subtract(matrix: Matrix, scalar = 1) {
    return this.add(matrix, -scalar);
  }

  times(matrix: Matrix) {
    if (this.columns !== matrix.rows) throw Error('Cannot multiply matrices of these dimensions.');
    return Matrix.generate(this.rows, matrix.columns, (i, j) => (
      this.getRow(i).dotProduct(matrix.getColumn(j))
    ));
  }

  // Unary matrix operations

  clone() {
    return new Matrix(this.toArray());
  }

  ref() {
    let R = this.clone();

    const zeroDiagonals = [...this].filter(({ entry, i, j }) => i === j && entry === 0);

    zeroDiagonals.forEach(({ i }) => {
      const target = R.findIndex((row, k) => row[i] !== 0 && R[i][k] !== 0);
      if (target !== -1) R = R.swapRows(i, target);
    });

    const belowDiagonal = [...this].filter(({ i, j }) => j < i);

    belowDiagonal.forEach(({ i, j }) => {
      R = R.subtractRow(i, j, R[i][j] / R[j][j]);
    });

    return R;
  }

  rref() {
    let R = this.ref();

    const aboveDiagonal = [...this].filter(({ i, j }) => j > i && j < this.rows);

    aboveDiagonal.forEach(({ i, j }) => {
      R = R.subtractRow(i, j, R[i][j] / R[j][j]);
    });

    return R.mapEntries((_entry, i, j) => R[i][j] / R[i][i]);
  }

  solveRight(vector: Vector) {
    const { rows, columns } = this;
    return Matrix.generate(rows, columns + 1, (i, j) => this[i][j] ?? vector[0][i]).rref();
  }

  minorMatrix() {
    const { square, rows } = this;
    if (!square) throw Error('Only square matrices have minor matrices.');
    return Matrix.generate(rows, rows, (i, j) => this.minor(i, j));
  }

  cofactorMatrix() {
    const { square, rows } = this;
    if (!square) throw Error('Only square matrices have minor matrices.');
    return Matrix.generate(rows, rows, (i, j) => this.cofactor(i, j));
  }

  adj() {
    return this.cofactorMatrix().transpose();
  }

  transpose() {
    const { rows, columns } = this;
    return Matrix.generate(columns, rows, (i, j) => this[j][i]);
  }

  inverse() {
    return this.det ? this.adj().scale(1 / this.det) : undefined;
  }
}

export default Matrix;
