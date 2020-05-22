import Point from './Point';
import Line from './Line';

class LineSegment extends Line {
  readonly points: Point[] = [];

  constructor(a: Point, b: Point)

  constructor(x1: number, y1: number, x2: number, y2: number);

  constructor(a: Point | number, b: Point | number, c?: number, d?: number) {
    super(a, b, c, d);
    if (a instanceof Point && b instanceof Point) {
      this.points = [a, b];
    } else if (
      typeof a === 'number'
      && typeof b === 'number'
      && typeof c === 'number'
      && typeof d === 'number'
    ) {
      this.points = [new Point(a, b), new Point(c, d)];
    }
  }

  get a() {
    return this.points[0];
  }

  get b() {
    return this.points[1];
  }

  get length() {
    return this.a.distanceToPoint(this.b);
  }

  get midPoint() {
    return new Point((this.a.x + this.b.x) / 2, (this.a.y + this.b.y) / 2);
  }
}

export default LineSegment;
