class Point {
  readonly x: number;
  readonly y: number;
  readonly magSq: number;
  readonly mag: number;
  readonly heading: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.magSq = this.x ** 2 + this.y ** 2;
    this.mag = Math.sqrt(this.magSq);
    this.heading = Math.atan2(this.y, this.x);
  }

  distanceToPoint(other: Point) {
    const { x: x1, y: y1 } = this;
    const { x: x2, y: y2 } = other;
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  add(other: Point) {
    return new Point(this.x + other.x, this.y + other.y);
  }

  subtract(other: Point) {
    return new Point(this.x - other.x, this.y - other.y);
  }

  scale(scaleFactor: number) {
    return new Point(this.x * scaleFactor, this.y * scaleFactor);
  }

  dotProduct(other: Point) {
    return this.x * other.x + this.y * other.y;
  }

  getNormalized() {
    return Point.fromAngle(this.heading);
  }

  static fromAngle(theta: number) {
    return new Point(Math.cos(theta), Math.sin(theta));
  }
}

export default Point;
