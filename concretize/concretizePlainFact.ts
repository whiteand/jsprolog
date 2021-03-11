import { IConcrete, IDatabase, Logic, TFact } from "../types.ts";
import { update } from "../utils.ts";
import { concretize } from "./concretize.ts";
import { isSameValue } from "./isSameValue.ts";

export function* concretizePlainFact(
  db: IDatabase,
  requestFact: TFact,
): Generator<any[]> {
  const storedFacts = db.factsDict[requestFact.name];
  if (!storedFacts || storedFacts.length === 0) {
    if (requestFact.params.every((p) => p.kind === Logic.Concrete)) {
      yield (requestFact.params as IConcrete<unknown>[]).map((p) => p.value);
    }
    return;
  }
  console.log(
    requestFact.name,
    requestFact.params.map((p) =>
      p.kind === Logic.Concrete ? JSON.stringify(p.value) : `<${p.name}>`
    ).join(" "),
  );
  if (storedFacts[0].kind === Logic.GeneratorFact) {
    if (storedFacts.length !== 1) {
      throw new Error("There should be only one definition per each generator");
    }
    for (const value of storedFacts[0].generator(db, ...requestFact.params)) {
      yield value;
    }
    return;
  }
  if (requestFact.params.every((p) => p.kind === Logic.Concrete)) {
    yield (requestFact.params as IConcrete<unknown>[]).map((p) => p.value);
    return;
  }
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
