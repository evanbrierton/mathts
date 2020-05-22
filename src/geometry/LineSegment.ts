import Point from './Point';
import Line from './Line';

class LineSegment extends Line {
  readonly a: Point;
  readonly b: Point;
  readonly length: number;

  constructor(a: Point, b: Point)
  constructor(x1: number, y1: number, x2: number, y2: number);
  constructor(a: Point | number, b: Point | number, c?: number, d?: number) {
    super(a, b, c, d);
    if (a instanceof Point && b instanceof Point) {
      [this.a, this.b] = [a, b];
    } else if (
      typeof a === 'number'
      && typeof b === 'number'
      && typeof c === 'number'
      && typeof d === 'number'
    ) {
      [this.a, this.b] = [new Point(a, b), new Point(c, d)];
    } else {
      throw TypeError(`No constructor fouund for (${typeof a}, ${typeof b}, ${typeof c}, ${typeof d})`);
    }

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
