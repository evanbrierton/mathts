import Point from './Point';

class Line {
  readonly slope: number;
  readonly xinter: number | null;
  readonly yinter: number | null;
  readonly perpendicularSlope: number;
  readonly isVertical: boolean;
  readonly isHorizontal: boolean;

  constructor(a: Point, b: Point)
  constructor(slope: number, intercept: number)
  constructor(x1: number, y1: number, x2: number, y2: number)
  constructor(a: Point | number, b: Point | number, c: undefined | number, d: undefined | number)
  constructor(a: Point | number, b: Point | number, c?: number, d?: number) {
    this.slope = 0;
    this.xinter = null;
    this.yinter = null;
    if (
      a instanceof Point
      && b instanceof Point
      && c === undefined
      && d === undefined
    ) {
      const slope = (b.y - a.y) / (b.x - a.x);
      this.slope = slope;
      if (Math.abs(slope) === Infinity) {
        this.slope = Infinity;
        this.xinter = a.x;
      } else if (slope === 0) {
        this.yinter = a.y;
      } else {
        this.yinter = a.y - slope * a.x;
        this.xinter = -this.yinter / slope;
      }
    } else if (
      typeof a === 'number'
      && typeof b === 'number'
      && c === undefined
      && d === undefined
    ) {
      this.slope = Math.abs(a) === Infinity ? Infinity : a;
      if (this.slope === Infinity) {
        this.xinter = b;
      } else {
        this.yinter = b;
      }
    } else if (
      typeof a === 'number'
      && typeof b === 'number'
      && typeof c === 'number'
      && typeof d === 'number'
    ) {
      this.constructor(new Point(a, b), new Point(c, d));
    } else {
      throw TypeError(`No constructor found for (${typeof a}, ${typeof b}, ${typeof c}, ${typeof d})`);
    }

    this.perpendicularSlope = -1 / this.slope;
    this.isHorizontal = this.slope === 0;
    this.isVertical = this.slope === Infinity;
  }
}

export default Line;
