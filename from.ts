import { invariant } from "./invariant.ts";
import { getStack } from "./stacks.ts";
import { IAnd, IConjunction, IFact, IOr, Logic } from "./types.ts";

type CNFItem = (IFact | IOr | IAnd);

enum State {
  WaitingForFirstConjunctionFact = 1,
  Finished,
  WaitingForOperation,
  WaitingForRestConjunctionFact,
}

export function from(...args: any[]) {
  const arity = args.length;
  const params: CNFItem[] = [];
  const stack = getStack();
  for (let i = 0; i < arity; i++) {
    const item = stack.pop();
    invariant(!!item, "item expected");
    if (i % 2 === 0) {
      invariant(item.kind === Logic.Fact, "expected fact");
    } else {
      invariant(
        item.kind === Logic.Or || item.kind === Logic.And,
        "expected operation",
      );
    }
    params.push(item);
  }
  params.reverse();
  const conjunctions: IConjunction[] = [];
  let state = State.WaitingForFirstConjunctionFact;
  let currentIndex = 0;
  while ((state & State.Finished) === 0 && currentIndex < arity) {
    switch (state) {
      case State.WaitingForFirstConjunctionFact:
        const mustBeFact = params[currentIndex++];
        invariant(
          mustBeFact.kind === Logic.Fact,
          "waiting for fact inside from",
        );
        conjunctions.push({
          kind: Logic.Conjunction,
          facts: [mustBeFact],
        });
        state = State.WaitingForOperation;
        break;
      case State.WaitingForOperation:
        const mustBeOperation = params[currentIndex];
        invariant(
          mustBeOperation.kind === Logic.Or ||
            mustBeOperation.kind === Logic.And,
          'There should be operation: "or" or "and" inside from function',
        );
        currentIndex++;
        if (mustBeOperation.kind === Logic.Or) {
          state = State.WaitingForFirstConjunctionFact;
        } else {
          state = State.WaitingForRestConjunctionFact;
        }
        break;
      case State.WaitingForRestConjunctionFact:
        const mustBeRestFact = params[currentIndex++];
        if (mustBeRestFact.kind !== Logic.Fact) {
          throw new Error("Expected fact but something else occurred in ");
        }
        conjunctions[conjunctions.length - 1].facts.push(
          mustBeRestFact as IFact,
        );
        state = State.WaitingForOperation;
        break;
    }
  }

  invariant(
    state === State.WaitingForOperation,
    "There should be another fact in the from function call",
  );

  conjunctions.reverse();
  conjunctions.forEach((conj) => conj.facts.reverse());
  stack.push({
    kind: Logic.CNF,
    conjunctions,
  });
}
