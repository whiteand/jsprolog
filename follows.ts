import { invariant } from "./invariant.ts";
import { getStack } from "./stacks.ts";
import { TFact, Logic } from "./types.ts";

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
export function follows(fact: TFact): void {
  const stack = getStack();
  invariant(!!stack, "you can call follows only inside generateDB");
  stack.pop();
  const cnf = stack.pop();
  invariant(!!cnf && cnf.kind === Logic.CNF, "Expected CNF");
  stack.push({
    kind: Logic.Rule,
    follows: fact,
    from: cnf,
  });
}
