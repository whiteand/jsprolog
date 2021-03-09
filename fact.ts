import { getStack } from "./stacks";
import { ISymbol, Logic } from "./types";

export function fact(name: string, ...args: any[]) {
  const arity = args.length;
  const key = `${name}/${arity}`;
  const stack = getStack();
  const params: ISymbol[] = [];
  for (let i = 0; i < arity; i++) {
    params.push(stack.pop() as ISymbol);
  }
  params.reverse();
  stack.push({
    kind: Logic.Fact,
    name: key,
    params,
  });
}
