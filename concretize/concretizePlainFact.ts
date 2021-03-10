import { factToString } from "../help.ts";
import { IConcrete, IDatabase, Logic, TFact } from "../types.ts";
import { update } from "../utils.ts";
import { concretize } from "./concretize.ts";
import { isSameValue } from "./isSameValue.ts";

export function* concretizePlainFact(
  db: IDatabase,
  requestFact: TFact,
): Generator<any[]> {
  if (requestFact.kind === Logic.GeneratorFact) {
    for (const value of requestFact.generator(db, ...requestFact.params)) {
      yield value;
    }
    return;
  }
  if (requestFact.params.every((p) => p.kind === Logic.Concrete)) {
    yield (requestFact.params as IConcrete<unknown>[]).map((p) => p.value);
    return;
  }
  if (!db.factsDict[requestFact.name]) {
    return;
  }
  console.log(`request ${factToString(requestFact)}`);
  factLoop:
  for (const storedFact of db.factsDict[requestFact.name]) {
    paramLoop:
    for (let i = 0; i < requestFact.params.length; i++) {
      const storedValue = storedFact.params[i];
      const requestValue = requestFact.params[i];

      if (storedValue.kind !== Logic.Concrete) continue paramLoop;

      if (requestValue.kind === Logic.Concrete) {
        if (
          isSameValue(storedValue.value, requestValue.value)
        ) {
          continue paramLoop;
        }
        continue factLoop;
      }

      yield* concretize(db, {
        kind: Logic.Fact,
        name: requestFact.name,
        params: update(i, storedValue, requestFact.params),
      });
      continue paramLoop;
    }
  }
}
