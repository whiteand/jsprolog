import { getStack } from "./stacks.ts";
import { Logic } from "./types.ts";

/**
 * Represents single abstract value
 * @example symbol('X') - mean assume some "X"
 * @see concrete compare with concrete('X') - mean the exact string value 'X'
 */
export function symbol(name: string) {
  const stack = getStack();
  stack.push({
    kind: Logic.Symbol,
    name,
  });
}
