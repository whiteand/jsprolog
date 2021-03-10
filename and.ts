import { getStack } from "./stacks.ts";
import { IAnd, Logic } from "./types.ts";

const AND: IAnd = {
  kind: Logic.And,
};
export function and(): void {
  const stack = getStack();
  stack.push(AND);
}
