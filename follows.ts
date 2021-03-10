import { invariant } from "./invariant.ts";
import { getStack } from "./stacks.ts";
import { Logic } from "./types.ts";

/**
 * @example
 * from(
 *   fact('father', symbol('X'), symbol('Y')),
 *   fact('father', symbol('Y'), symbol('Z'))
 * )
 * follows(
 *   fact('grandfather', symbol('X'), symbol('Z'))
 * )
 */
export function follows(...args: any[]) {
  const stack = getStack();
  const fact = stack.pop();
  invariant(
    !!fact && fact.kind === Logic.Fact,
    "Follows should contain a single fact",
  );
  const cnf = stack.pop();
  invariant(!!cnf && cnf.kind === Logic.CNF, "Expected CNF");
  stack.push({
    kind: Logic.Rule,
    follows: fact,
    from: cnf,
  });
}
