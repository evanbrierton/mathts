import Point from './Point';
import { overload } from '../utils';

class Line {
  public slope!: number;
  public xinter: number | null = null;
  public yinter: number | null = null;
  readonly perpendicularSlope: number;
  readonly isVertical: boolean;
  readonly isHorizontal: boolean;

  constructor(a: Point, b: Point)
  constructor(slope: number, intercept: number)
  constructor(x1: number, y1: number, x2: number, y2: number)
  constructor(...args: any[])
  constructor(...args: any[]) {
    overload(args, {
      '(Point, Point)': (a: Point, b: Point) => {
        const slope = (b.y - a.y) / (b.x - a.x);
        this.slope = slope;
        if (Math.abs(this.slope) === Infinity) {
          this.slope = Infinity;
          this.xinter = a.x;
        } else if (slope === 0) {
          this.yinter = a.y;
        } else {
          this.yinter = a.y - slope * a.x;
          this.xinter = -this.yinter * this.slope;
        }
      },
      '(Number, Number, Number, Number)': (x1: number, y1: number, x2: number, y2: number) => {
        this.constructor(new Point(x1, y1), new Point(x2, y2));
      },
      '(Number, Number)': (slope: number, intercept: number) => {
        this.slope = slope;
        if (Math.abs(this.slope) === Infinity) {
          this.slope = Infinity;
          this.xinter = intercept;
        } else {
          this.yinter = intercept;
        }
      },
    });

    this.perpendicularSlope = -1 / this.slope;
    this.isVertical = this.slope === Infinity;
    this.isHorizontal = this.slope === 0;
  }
}

export default Line;
