import { StackItem } from "./types";

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

export function getStack(): StackItem[] {
  if (stacks.length <= 0) {
    throw new Error(
      "Probably you used jsprolog functions out of the createDB function",
    );
  }
  return stacks[stacks.length - 1];
}
