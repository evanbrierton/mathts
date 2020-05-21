export default class Point {
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
}
