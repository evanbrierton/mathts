// eslint-disable-next-line no-unused-vars
import Point2D from './Point2D';
import Line from './Line';

/**
 * Represents a line segment of finite length
 *
 * @class LineSegment
 * @extends {Line}
 */
class LineSegment extends Line {
  readonly length: number;

  constructor(readonly A: Point2D, readonly B: Point2D) {
    super(A, B);
    this.length = A.distanceToPoint(B);
  }

  /**
   * Returns the midpoint of the line segment
   *
   * @readonly
   * @memberof LineSegment
   */
  get midpoint() {
    return this.A.lerp(this.B, 0.5);
  }
}

export default LineSegment;
