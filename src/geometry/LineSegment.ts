import Point from './Point';
import Line from './Line';
import { overload } from '../utils';

class LineSegment extends Line {
  public a!: Point;
  public b!: Point;
  readonly length: number;

  constructor(a: Point, b: Point)
  constructor(x1: number, y1: number, x2: number, y2: number);
  constructor(...args: any[]) {
    super(...args);
    overload(args, {
      '(Point, Point)': (a: Point, b: Point) => {
        this.a = a;
        this.b = b;
      },
      '(Number, Number, Number, Number)': (x1: number, y1: number, x2: number, y2: number) => {
        this.constructor(new Point(x1, y1), new Point(x2, y2));
      },
    });

    this.length = this.a.distanceToPoint(this.b);
  }

  get midPoint() {
    return new Point((this.a.x + this.b.x) / 2, (this.a.y + this.b.y) / 2);
  }

  get points() {
    return [this.a, this.b];
  }
}

export default LineSegment;
