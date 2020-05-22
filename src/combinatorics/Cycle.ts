import { ArrayProxy, Ring, getMethods } from '../utils';

class Cycle extends ArrayProxy {
  constructor(...entries: number[]) {
    if (Array.from(new Set(entries)).length !== entries.length) {
      throw Error('Cycles cannot contain duplicate elements');
    }
    super(
      (_target, key) => (
        entries.includes(+key)
          ? new Ring(...entries)[entries.indexOf(+key) + 1]
          : +key
      ),
      entries,
      getMethods(Cycle),
    );
  }
}

export default Cycle;
