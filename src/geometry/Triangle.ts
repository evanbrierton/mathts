// eslint-disable-next-line no-unused-vars
import { Point, Angle, Units } from '.';

class Triangle {
  readonly A: Point;
  readonly B: Point;
  readonly C: Point;

  readonly a: number;
  readonly b: number;
  readonly c: number;

  readonly alpha: Angle;
  readonly beta: Angle;
  readonly gamma: Angle;

  // TODO: add co-linear check
  constructor(a: Point, b: Point, c: Point) {
    const heightSortedPoints = [a, b, c].sort((p1: Point, p2: Point) => p1.y - p2.y);

    const [bottomPoint, p1, p2] = heightSortedPoints;

    const sortedPoints = [bottomPoint].concat([p1, p2].sort(
      (p: Point, q: Point) => p.subtract(bottomPoint).heading - q.subtract(bottomPoint).heading,
    ));

    // Get side lengths. Circular shift by 1 so align with points.
    const sideLengths = ((array) => array.slice(1).concat(array.shift()!))(
      sortedPoints.map(
        (p: Point, i: number) => p.distanceToPoint(sortedPoints[(i + 1) % 3]),
      ),
    );

    const angles = sideLengths.map((side) => {
      const others = sideLengths.filter((length) => side !== length);
      return new Angle(
        Math.acos((others[0] ** 2 + others[1] ** 2 - side ** 2) / (2 * others[0] * others[1])),
        Units.radians,
      );
    });

    [this.A, this.B, this.C] = sortedPoints;
    [this.a, this.b, this.c] = sideLengths;
    [this.alpha, this.beta, this.gamma] = angles;
  }

  get points() {
    return [this.A, this.B, this.C];
  }

  get sideLengths() {
    return [this.a, this.b, this.c];
  }

  get angles() {
    return [this.alpha, this.beta, this.gamma];
  }

  containsPoint(P: Point) {
    const { A, B, C } = this;

    const w1 = (A.x * (C.y - A.y) + (P.y - A.y) * (C.x - A.x) - P.x * (C.y - A.y))
      / ((B.y - A.y) * (C.x - A.x) - (B.x - A.x) * (C.y - A.y));

    const w2 = (P.y - A.y - w1 * (B.y - A.y)) / (C.y - A.y);

    return w1 >= 0 && w2 >= 0 && (w1 + w2) <= 1;
  }
}

export default Triangle;
