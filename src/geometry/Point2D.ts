import { roundToFixed } from '../utils';

/**
 * Represents a Euclidian Vector
 *
 * @class Point2D
 */
class Point2D {
  readonly x: number;
  readonly y: number;

  /**
   * Creates an instance of Point2D.
   *
   * @param {number} x      X component
   * @param {number} y      Y component
   * @memberof Point2D
   */
  constructor(x: number, y: number) {
    this.x = roundToFixed(x, 10);
    this.y = roundToFixed(y, 10);
  }

  get magSq() {
    return this.x ** 2 + this.y ** 2;
  }


  /**
   * The magnitude of the vector
   *
   * @readonly
   * @memberof Point2D
   */
  get mag() {
    return Math.sqrt(this.magSq);
  }


  /**
   * The (counter-clockwise) angle the vector makes with the x-axis
   *
   * @note Only valid for 2D vectors.
   * @readonly
   * @memberof Point2D
   */
  get heading() {
    return Math.atan2(this.y, this.x);
  }

  /**
   * Get the Euclidian distance between two points
   *
   * @param  {Point2D} other  Point to which calculate distance
   * @returns {number}        Euclidian distance between this and other
   * @memberof Point2D
   */
  distanceToPoint(other: Point2D): number {
    const { x: x1, y: y1 } = this;
    const { x: x2, y: y2 } = other;
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  /**
   * Get the addition result of two points
   *
   * @param  {Point2D} other  Point which to add
   * @returns {Point2D}       The addition result of this + other
   * @memberof Point2D
   */
  add(other: Point2D): Point2D {
    return new Point2D(this.x + other.x, this.y + other.y);
  }

  /**
   * Get the substraction result of two vectors
   *
   * @param  {Point2D} other  Point which to subtract
   * @returns {Point2D}       The subtraction result of this - other
   * @memberof Point2D
   */
  subtract(other: Point2D): Point2D {
    return new Point2D(this.x - other.x, this.y - other.y);
  }

  /**
   * Get scaled version of vector
   *
   * @param  {number} scaleFactor   The factor by which to scale in every direction
   * @returns {Point2D}             this scaled by scaleFactor in every direction
   * @memberof Point2D
   */
  scale(scaleFactor: number): Point2D {
    return new Point2D(this.x * scaleFactor, this.y * scaleFactor);
  }

  /**
   * Calculate the dot product of two vectors
   *
   * @param  {Point2D} other
   * @returns {number} The dot product result
   * @memberof Point2D
   */
  dotProduct(other: Point2D): number {
    return this.x * other.x + this.y * other.y;
  }


  /**
   * Calculates and returns a normalized version of the vector.
   * i.e. A vector that points in the same direction but is a unit vector
   *
   * @returns {Point2D} this converted to a unit vector
   * @memberof Point2D
   */
  getNormalized(): Point2D {
    return this.mag === 0 ? new Point2D(this.x, this.y).scale(1 / this.mag) : this;
  }

  lerp(other: Point2D, t: number): Point2D {
    return new Point2D(this.x + t * (other.x - this.x), this.y + t * (other.y - this.y));
  }

  /**
   * Generating a (2D) vector from it's angle
   *
   * @static
   * @param {number} theta  Angle which the vector will make with the x-axis
   * @returns {Point2D}     The generated vector
   * @memberof Point2D
   */
  static fromAngle(theta: number): Point2D {
    return new Point2D(Math.cos(theta), Math.sin(theta));
  }
}

export default Point2D;
