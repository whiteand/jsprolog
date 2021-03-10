import { getStack } from "./stacks.ts";
import { IOr, Logic } from "./types.ts";

const OR: IOr = {
  kind: Logic.Or,
};
export function or(): void {
  const stack = getStack();
  stack.push(OR);
}
