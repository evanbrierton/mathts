import Point2D from './Point2D';
import { overload } from '../utils/general';

/**
 * A class to represent a triangle
 *
 * @class Circle
 */
class Circle {
  public center: Point2D = new Point2D(0, 0);
  public radius: number = 0;
  readonly area: number;
  readonly circumference: number;

  constructor(center: Point2D, radius: number)
  constructor(x: number, y: number, radius: number)
  constructor(...args: any[]) {
    overload(args, {
      '(Point2D, Number)': (center: Point2D, radius: number) => {
        this.center = center;
        this.radius = radius;
      },
      '(Number, Number, Number)': (x: number, y: number, radius: number) => {
        this.constructor(new Point2D(x, y), radius);
      },
    });

    this.area = Math.PI * this.radius ** 2;
    this.circumference = 2 * Math.PI * this.radius;
  }

  /**
   * Returns whether a point is inside the circle
   *
   * @param {Point2D} p
   * @returns
   * @memberof Circle
   */
  containsPoint(p: Point2D) {
    return this.center.distanceToPoint(p) <= this.radius;
  }
}

export default Circle;
