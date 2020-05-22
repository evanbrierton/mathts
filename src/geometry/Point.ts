class Point {
  public x: number;

  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  distanceToPoint(other: Point) {
    const { x: x1, y: y1 } = this;
    const { x: x2, y: y2 } = other;
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  add(other: Point) {
    return new Point(this.x + other.x, this.y + other.y);
  }

  sub(other: Point) {
    return new Point(this.x - other.x, this.y - other.y);
  }

  mult(scalar: number) {
    return new Point(this.x * scalar, this.y * scalar);
  }

  div(scalar: number) {
    return new Point(this.x / scalar, this.y / scalar);
  }

  dot(other: Point) {
    return this.x * other.x + this.y * other.y;
  }

  static fromAngle(theta: number) {
    return new Point(Math.cos(theta), Math.sin(theta));
  }

  get magSq() {
    return this.x ** 2 + this.y ** 2;
  }

  get mag() {
    return Math.sqrt(this.magSq);
  }

  get heading() {
    return Math.atan2(this.y, this.x);
  }

  get normalized() {
    return Point.fromAngle(this.heading);
  }
}

export default Point;
