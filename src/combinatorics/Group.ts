// eslint-disable-next-line no-unused-vars
import { Permutation } from '.';
import { Ring } from '../utils';

class Group extends Set<Permutation> {
  constructor(permutations: ArrayLike<Permutation>) {
    super(Array.from(permutations));
  }

  static symmetricGroup(n: number) {
    const input = Array.from({ length: n }, (_item, i) => i + 1);

    const permute = (arr: number[]) => {
      const outputs: number[][] = [];
      if (arr.length === 1) return [...outputs, arr];

      arr.forEach((element, i) => {
        permute([...arr.slice(0, i), ...arr.slice(i + 1)])
          .forEach((remainder) => outputs.push([element, ...remainder]));
      });

      return outputs;
    };

    return new Group(permute(input).map((output) => new Permutation(input, output)));
  }

  static cyclicGroup(n: number) {
    const ring = new Ring(...Array.from({ length: n }, (_entry, i) => i + 1));
    return new Group(
      Array.from({ length: n }, (_entry, i) => new Permutation([...ring], [...ring.shiftRight(i)])),
    );
  }

  static reflectiveGroup(n: number) {
    const ring = new Ring(...Array.from({ length: n }, (_entry, i) => i + 1));
    return new Group(
      [...Group.cyclicGroup(n)]
        .map((permutation) => permutation.compose(new Permutation([...ring], [...ring.reverse()]))),
    );
  }

  static dihedralGroup(n: number) {
    return new Group([...Group.cyclicGroup(n), ...Group.reflectiveGroup(n)]);
  }
}

export default Group;
