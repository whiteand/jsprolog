import { getStack } from "./stacks.ts";
import { Logic } from "./types.ts";

export function concrete(value: unknown): void {
  const stack = getStack();
  stack.push({
    kind: Logic.Concrete,
    value,
  });
}
