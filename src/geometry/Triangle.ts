// eslint-disable-next-line no-unused-vars
import { Point2D, Angle, Units } from '.';
import Circle from './Circle';

/**
 * A class to represent a triangle
 *
 * @class Triangle
 */
class Triangle {
  readonly A: Point2D;
  readonly B: Point2D;
  readonly C: Point2D;

  readonly a: number;
  readonly b: number;
  readonly c: number;

  readonly alpha: Angle;
  readonly beta: Angle;
  readonly gamma: Angle;

  readonly perimeter: number;
  readonly area: number;

  // TODO: add co-linear check
  constructor(a: Point2D, b: Point2D, c: Point2D) {
    const heightSortedPoints = [a, b, c].sort((p1: Point2D, p2: Point2D) => p1.y - p2.y);

    const [bottomPoint, p1, p2] = heightSortedPoints;

    const sortedPoints = [bottomPoint].concat([p1, p2].sort(
      (p: Point2D, q: Point2D) => p.subtract(bottomPoint).heading - q.subtract(bottomPoint).heading,
    ));

    // Get side lengths. Circular shift by 1 so align with points.
    const sideLengths = sortedPoints.map(
      (p: Point2D, i: number) => p.distanceToPoint(sortedPoints[(i + 1) % 3]),
    );

    const angles = sideLengths.map((side, i) => {
      const others = sideLengths.filter((_, j) => i !== j);
      return new Angle(
        Math.acos((others[0] ** 2 + others[1] ** 2 - side ** 2) / (2 * others[0] * others[1])),
        Units.radians,
      );
    });

    [this.A, this.B, this.C] = sortedPoints;
    [this.a, this.b, this.c] = [sideLengths[1], sideLengths[2], sideLengths[0]];
    [this.alpha, this.beta, this.gamma] = angles;

    this.perimeter = this.a + this.b + this.c;

    const s = this.perimeter / 2;

    const area = Math.sqrt(s * (s - this.a) * (s - this.b) * (s - this.c));

    this.area = Math.round((area + Number.EPSILON) * 10 ** 10) / (10 ** 10);
  }

  /**
   * Array of the triangle points
   *
   * @readonly
   * @memberof Triangle
   */
  get points(): Point2D[] {
    return [this.A, this.B, this.C];
  }

  /**
   * Array of triangle side lengths
   *
   * @readonly
   * @memberof Triangle
   */
  get sideLengths(): number[] {
    return [this.a, this.b, this.c];
  }

  /**
   * Array of triangle angles
   *
   * @readonly
   * @memberof Triangle
   */
  get angles(): Angle[] {
    return [this.alpha, this.beta, this.gamma];
  }

  /**
   * Returns the circumcenter point of the triangle
   *
   * @readonly
   * @type {Point2D}
   * @memberof Triangle
   */
  get circumcenter(): Point2D {
    const { a, b, c } = this;
    const { A, B, C } = this;

    const s1 = (a * a) * (b * b + c * c - a * a);
    const s2 = (b * b) * (c * c + a * a - b * b);
    const s3 = (c * c) * (a * a + b * b - c * c);

    const AScaled = A.scale(s1);
    const BScaled = B.scale(s2);
    const CScaled = C.scale(s3);

    const U = AScaled.add(BScaled).add(CScaled).scale(1 / (s1 + s2 + s3));

    return U;
  }

  /**
   * Returns an instance of Circle that sits at the circumcenter
   * and goes through the three verticies
   *
   * @readonly
   * @type {Circle}
   * @memberof Triangle
   */
  get circumcircle(): Circle {
    const { circumcenter } = this;

    return new Circle(circumcenter, circumcenter.distanceToPoint(this.A));
  }


  /**
   * Returns wether a point lies within the triangle
   *
   * @param {Point2D} P
   * @returns {boolean}
   * @memberof Triangle
   */
  containsPoint(P: Point2D): boolean {
    const { A, B, C } = this;

    const w1 = (A.x * (C.y - A.y) + (P.y - A.y) * (C.x - A.x) - P.x * (C.y - A.y))
      / ((B.y - A.y) * (C.x - A.x) - (B.x - A.x) * (C.y - A.y));

    const w2 = (P.y - A.y - w1 * (B.y - A.y)) / (C.y - A.y);

    return w1 >= 0 && w2 >= 0 && (w1 + w2) <= 1;
  }
}

export default Triangle;
