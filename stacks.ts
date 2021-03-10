import { StackItem } from "./types.ts";

const stacks: StackItem[][] = [];

export function withNewStack(
  callback: (stack: StackItem[]) => void,
): StackItem[] {
  const newStack: StackItem[] = [];
  stacks.push(newStack);
  callback(newStack);
  stacks.pop();
  return newStack;
}

export function getStack(): StackItem[] | null {
  if (stacks.length <= 0) {
    return null;
  }
  return stacks[stacks.length - 1];
}
