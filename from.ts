import { getStack } from "./stacks";
import { IAnd, IConjunction, IFact, IOr, Logic } from "./types";

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
    if (item.kind & (~(Logic.Or | Logic.And | Logic.Fact))) {
      throw new Error(
        "Only 'or', 'and', and 'fact' allowed to be used inside 'from' ",
      );
    }
    params.push(item as CNFItem);
  }
  const conjunctions: IConjunction[] = [];
  let state = State.WaitingForFirstConjunctionFact;
  let currentIndex = arity - 1;
  while ((state & State.Finished) === 0 && currentIndex >= 0) {
    switch (state) {
      case State.WaitingForFirstConjunctionFact:
        const mustBeFact = params[currentIndex--];
        if (!(mustBeFact.kind & Logic.Fact)) {
          throw new Error("waiting for fact inside from");
        }
        conjunctions.push({
          kind: Logic.Conjunction,
          facts: [mustBeFact as IFact],
        });
        state = State.WaitingForOperation;
        break;
      case State.WaitingForOperation:
        const mustBeOperation = params[currentIndex];
        if (0 === (mustBeOperation.kind & (Logic.Or | Logic.And))) {
          throw new Error(
            'There should be operation: "or" or "and" inside from function',
          );
        }
        currentIndex--;
        if (mustBeOperation.kind === Logic.Or) {
          state = State.WaitingForFirstConjunctionFact;
        } else {
          state = State.WaitingForRestConjunctionFact;
        }
        break;
      case State.WaitingForRestConjunctionFact:
        const mustBeRestFact = params[currentIndex--];
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
  if (state === State.WaitingForOperation) {
    conjunctions.reverse();
    conjunctions.forEach((conj) => conj.facts.reverse());
    stack.push({
      kind: Logic.CNF,
      conjunctions,
    });
  } else {
    throw new Error("There should be another fact in the from function call");
  }
}
