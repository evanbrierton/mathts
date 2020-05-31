import { roundToFixed } from '../utils';

interface AngleInterface {
  degrees: number
  radians: number
}

type angle = {
  degrees?: number;
  radians?: number;
}

// TODO: Move Units to utils / general when more units are added
enum Units {
  // eslint-disable-next-line no-unused-vars
  degrees,
  // eslint-disable-next-line no-unused-vars
  radians
}

/**
 * A class to represent a 2D angle
 * Stores value in degrees and radians
 *
 * @class Angle
 * @implements {AngleInterface}
 */
class Angle implements AngleInterface {
  readonly degrees: number;
  readonly radians: number;

  readonly cos: number;
  readonly sin: number;
  readonly tan: number | undefined; // undefined for theta = 90 degrees

  readonly quadrant: number;

  constructor(theta: number, degrees: Units.degrees)
  constructor(theta: number, radians: Units.radians)
  constructor(theta: number, unit: Units.degrees | Units.radians) {
    if (unit === Units.degrees) {
      this.degrees = roundToFixed(theta, 10) % 360;
      this.radians = this.degrees === 0 ? 0 : theta * (Math.PI / 180);
    } else if (unit === Units.radians) {
      this.radians = roundToFixed(theta, 10) % 360;
      this.degrees = theta * (180 / Math.PI);
    } else {
      throw TypeError();
    }

    this.radians = roundToFixed(this.radians, 10) % (2 * Math.PI);

    this.sin = Math.sin(this.radians);
    this.cos = Math.cos(this.radians);
    this.tan = this.degrees === 90 ? undefined : Math.tan(this.radians);

    this.quadrant = Math.ceil(this.degrees / 90);
  }

  /**
   * Scaled an angle by a scalar factor
   *
   * @param {number} scaleFactor
   * @returns {Angle}
   * @memberof Angle
   */
  scale(scaleFactor: number): Angle {
    return new Angle(this.degrees * scaleFactor, Units.degrees);
  }

  /**
   * Creates an instance of Angle from an angle type object.
   * Must have either degrees or radians key and value.
   * If both exist, degrees is used
   *
   * @static
   * @param {angle} angleObject
   * @returns
   * @memberof Angle
   */
  static fromType(angleObject: angle) {
    if ('degrees' in angleObject) {
      return new Angle(angleObject.degrees!, Units.degrees);
    }

    if ('radians' in angleObject) {
      return new Angle(angleObject.radians!, Units.radians);
    }

    throw TypeError('angleObject must contain \'degrees\' or \'radians\' key');
  }
}

export { Units, Angle };
