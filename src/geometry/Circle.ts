import Point from './Point';
import { overload } from '../utils/general';

class Circle {
  public center: Point = new Point(0, 0);
  public radius: number = 0;
  readonly area: number;
  readonly circumference: number;

  constructor(center: Point, radius: number)
  constructor(x: number, y: number, radius: number)
  constructor(...args: any[]) {
    overload(args, {
      '(Point, Number)': (center: Point, radius: number) => {
        this.center = center;
        this.radius = radius;
      },
      '(Number, Number, Number)': (x: number, y: number, radius: number) => {
        this.constructor(new Point(x, y), radius);
      },
    });

    this.area = Math.PI * this.radius ** 2;
    this.circumference = 2 * Math.PI * this.radius;
  }

  containsPoint(p: Point) {
    return this.center.distanceToPoint(p) <= this.radius;
  }
}

export default Circle;
