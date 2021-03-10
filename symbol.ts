import { getStack } from "./stacks.ts";
import { ISymbol, Logic } from "./types.ts";

/**
 * Represents single abstract value
 * @example symbol('X') - mean assume some "X"
 * 
 * it can be associate with some concrete value during concretize function
 */
export function symbol(name: string): ISymbol {
  return {
    kind: Logic.Symbol,
    name,
  };
}
