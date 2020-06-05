import { Matrix } from '.';

class Vector extends Matrix {
  readonly rowVector: boolean;
  readonly columnVector: boolean;
  readonly length: number;

  constructor(entries: number[][]) {
    super(entries);
    this.rowVector = this.rows === 1;
    this.columnVector = this.columns === 1;
    this.length = entries.flat().length;
    if (!this.rowVector && !this.columnVector) throw Error('Vectors must be 1-dimensional');
  }

  magnitude() {
    return Math.sqrt([...this].reduce((acc, { entry }) => acc + entry ** 2, 0));
  }

  dotProduct(vector: Vector) {
    return [...this]
      .reduce((acc, _next, i) => acc + [...this].flat()[i] * [...vector].flat()[i], 0);
  }

  angleBetween(vector: Vector) {
    return Math.acos(this.dotProduct(vector) / (this.magnitude() * vector.magnitude()));
  }

  crossProduct(vector: Vector) {
    if (
      !(this.length === 2 && vector.length === 2) && !(this.length === 3 && vector.length === 3)
    ) {
      throw Error('Cross product can only be computed in 3 dimensions');
    }
    const a = [...this].flat();
    const b = [...this].flat();

    if (this.length === 2) return new Vector([[0], [0], [a[0] * b[1] - a[1] * b[0]]]);

    return new Vector([
      [a[1] * b[2] - a[2] * b[1]],
      [a[2] * b[0] - a[0] * b[2]],
      [a[0] * b[1] - a[1] * b[0]],
    ]);
  }
}

export default Vector;
