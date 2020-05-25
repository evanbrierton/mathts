interface AngleInterface {
  degrees: number
radians: number
}

// TODO: Move Units to utils / general when more units are added
enum Units {
  // eslint-disable-next-line no-unused-vars
  degrees,
  // eslint-disable-next-line no-unused-vars
  radians
}

class Angle implements AngleInterface {
  readonly degrees: number;
  readonly radians: number;

  constructor(theta: number, degrees: Units.degrees)
  constructor(theta: number, radians: Units.radians)
  constructor(theta: number, unit: Units.degrees | Units.radians) {
    if (unit === Units.degrees) {
      this.degrees = theta;
      this.radians = theta * (Math.PI / 180);
    } else if (unit === Units.radians) {
      this.radians = theta;
      this.degrees = theta * (180 / Math.PI);
    } else {
      throw TypeError();
    }
  }
}

export { Units, Angle };
