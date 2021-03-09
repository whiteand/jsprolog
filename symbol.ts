import { getStack } from "./stacks";
import { Logic } from "./types";

export function symbol(name: string) {
  const stack = getStack();
  stack.push({
    kind: Logic.Symbol,
    name,
  });
}
