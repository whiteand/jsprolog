import { getFactKey } from "./getFactKey.ts";
import { getStack } from "./stacks.ts";
import { GenerateFunc, IConcrete, ISymbol, Logic, TFact } from "./types.ts";

type TParams = [
  ...(ISymbol | IConcrete<unknown>)[],
  ...([GenerateFunc] | []),
];

function getFactFrom(name: string, params: TParams): TFact {
  if (typeof params[params.length - 1] === "function") {
    return {
      kind: Logic.GeneratorFact,
      params: params.slice(0, -1) as (ISymbol | IConcrete<any>)[],
      name: getFactKey(name, params.length - 1),
      generator: params[params.length - 1] as GenerateFunc,
    };
  }
  return {
    kind: Logic.Fact,
    name: getFactKey(name, params.length),
    params: params as (ISymbol | IConcrete<unknown>)[],
  };
}

export function fact<P extends TParams>(name: string, ...params: P): TFact {
  const fact = getFactFrom(name, params);

  const stack = getStack();

  if (stack) {
    stack.push(fact);
  }

  return fact;
}
