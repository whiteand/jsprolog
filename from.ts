import { invariant } from "./invariant.ts";
import { getStack } from "./stacks.ts";
import { IAnd, IConjunction, IOr, Logic, TFact } from "./types.ts";

type CNFItem = TFact | IOr | IAnd;

enum State {
  WaitingForFirstConjunctionFact = 1,
  WaitingForOperation,
  WaitingForRestConjunctionFact,
}

export function from(...params: CNFItem[]) {
  const arity = params.length;
  const stack = getStack();

  invariant(!!stack, "from should be called only inside generateDB");

  const factsNumber = Math.floor(arity / 2) + 1;

  for (let i = 0; i < factsNumber; i++) stack.pop();

  const conjunctions: IConjunction[] = [];
  let state = State.WaitingForFirstConjunctionFact;
  let currentIndex = 0;
  while (currentIndex < arity) {
    switch (state) {
      case State.WaitingForFirstConjunctionFact: {
        const mustBeFact = params[currentIndex++];
        invariant(
          mustBeFact.kind === Logic.Fact ||
            mustBeFact.kind === Logic.GeneratorFact,
          "waiting for fact inside from",
        );
        conjunctions.push({
          kind: Logic.Conjunction,
          facts: [mustBeFact],
        });
        state = State.WaitingForOperation;
        break;
      }
      case State.WaitingForOperation: {
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
      }
      case State.WaitingForRestConjunctionFact: {
        const mustBeRestFact = params[currentIndex++];
        invariant(
          mustBeRestFact.kind === Logic.Fact ||
            mustBeRestFact.kind === Logic.GeneratorFact,
          "Expected fact but something else occurred in ",
        );
        conjunctions[conjunctions.length - 1].facts.push(
          mustBeRestFact,
        );
        state = State.WaitingForOperation;
        break;
      }
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
