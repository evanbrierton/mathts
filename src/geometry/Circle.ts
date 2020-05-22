import Point from './Point';

class Circle {
  readonly center: Point = new Point(0, 0);
  readonly radius: number = 0;
  readonly area: number;
  readonly circumference: number;

  constructor(c: Point, r: number)
  constructor(x: number, y: number, r: number)
  constructor(a: Point | number, b: Point | number, c?: number) {
    if (
      a instanceof Point
      && typeof b === 'number'
    ) {
      this.center = a;
      this.radius = b;
    } else if (
      typeof a === 'number'
      && typeof b === 'number'
      && typeof c === 'number'
    ) {
      this.constructor(new Point(a, b), c);
    } else {
      throw TypeError(`No constructor fond for (${typeof a}, ${typeof b}, ${typeof c})`);
    }

    this.area = Math.PI * this.radius ** 2;
    this.circumference = 2 * Math.PI * this.radius;
  }

  containsPoint(p: Point) {
    return this.center.distanceToPoint(p) <= this.radius;
  }
}

export default Circle;
