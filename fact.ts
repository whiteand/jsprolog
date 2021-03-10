import { invariant } from "./invariant.ts";
import { getStack } from "./stacks.ts";
import { IConcrete, ISymbol, Logic } from "./types.ts";

export function fact(name: string, ...args: unknown[]) {
  const arity = args.length;
  const key = `${name}/${arity}`;
  const stack = getStack();
  const params: (ISymbol | IConcrete<unknown>)[] = [];
  for (let i = 0; i < arity; i++) {
    const stackItem = stack.pop();
    invariant(!!stackItem, "symbol or concrete expected");
    invariant(
      stackItem.kind === Logic.Symbol || stackItem.kind === Logic.Concrete,
      "Expected symbol or concrete",
    );
    params.push(stackItem);
  }
  params.reverse();
  stack.push({
    kind: Logic.Fact,
    name: key,
    params,
  });
}
