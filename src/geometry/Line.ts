// eslint-disable-next-line no-unused-vars
import Point2D from './Point2D';
import { overload } from '../utils';

/**
 * A class to represent a 2D line
 *
 * @class Line
 */
class Line {
  // TODO: Use Fraction class and gcd() to make sure these are always integers
  readonly a!: number;
  readonly b!: number;
  readonly c!: number;

  readonly slope!: number;
  readonly xIntercept!: number;
  readonly yIntercept!: number;

  constructor(a: Point2D, b: Point2D);
  constructor(a: number, b: number, c: number)
  constructor(m: number, yIntercept: number)
  constructor(...args: Point2D[] | number[])
  constructor(...args: Point2D[] | number[]) {
    const properties = overload(args, {
      '(Number, Number)': (slope: number, intercept: number) => {
        if (Math.abs(slope) === Infinity) {
          throw Error('Cannot use constructor (slope, yIntercept) for vertical lines');
        }

        if (slope === 0) {
          return {
            a: 0, b: 1, c: -intercept, yIntercept: intercept, slope, xIntercept: undefined,
          };
        }

        return {
          a: slope,
          b: -1,
          c: intercept,
          yIntercept: intercept,
          slope,
          xIntercept: -intercept / slope,
        };
      },
      '(Point2D, Point2D)': (p1: Point2D, p2: Point2D) => {
        const a = p2.y - p1.y;
        const b = p1.x - p2.x;
        const c = p1.y * (-b) - p1.x * a;
        const yIntercept = -c / b;
        const slope = (p2.y - p1.y) / (p2.x - p1.x);
        const xIntercept = -c / a;
        return {
          a,
          b,
          c,
          yIntercept: Math.abs(yIntercept) === Infinity ? undefined : yIntercept,
          slope,
          xIntercept: Math.abs(xIntercept) === Infinity ? undefined : xIntercept,
        };
      },
      '(Number, Number, Number)': (a: number, b: number, c: number) => ({
        a,
        b,
        c,
        yIntercept: Math.abs(-c / b) === Infinity ? undefined : -c / b,
        slope: -a / b,
        xIntercept: Math.abs(-c / a) === Infinity ? undefined : -c / a,
      }),
    });

    Object.assign(this, properties);
  }
}

export default Line;
