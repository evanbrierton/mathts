// eslint-disable-next-line no-unused-vars
import { Permutation } from '.';

class Group extends Set {
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
}

export default Group;
