class Matrix extends Array<Array<Number>> {
  readonly rows: number;

  readonly columns: number;

  readonly square: boolean;

  constructor(rows: number[][]) {
    rows.forEach((row) => {
      if (row.length !== rows[0].length) throw Error('All rows must be of the same length.');
    });
    super(...rows);

    this.rows = rows.length;
    this.columns = rows[0].length;
    this.square = rows.length === rows[0].length;
  }

  static generate(
    n: number, m: number, callback: (i: number, j: number) => number,
  ) {
    return new Matrix(
      Array.from({ length: n })
        .map((_row, i) => (Array.from({ length: m }).map((_entry, j) => callback(i, j)))),
    );
  }

  static identity(n: number) {
    return Matrix.generate(n, n, (i, j) => (i === j ? 1 : 0));
  }

  static zero(n: number) {
    return Matrix.generate(n, n, () => 0);
  }

  static random(n: number, m: number, min: number, max: number) {
    return Matrix.generate(n, m, () => Math.floor(Math.random() * (max - min) + min));
  }
}

export default Matrix;
