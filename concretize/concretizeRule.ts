import { IConcrete, IDatabase, ISymbol, Logic, TFact } from "../types.ts";
import { concretize } from "./concretize.ts";
import { concretizePlainFact } from "./concretizePlainFact.ts";
import { factToString } from "../help.ts";

export function* concretizeRule(db: IDatabase, fact: TFact): Generator<any[]> {
  if (fact.kind === Logic.GeneratorFact) {
    return;
  }
  const rules = db.rulesDict[fact.name];
  if (!rules || rules.length === 0) return;
  for (const rule of rules) {
    for (const conjunction of rule.from.conjunctions) {
      const symbolDict: Record<string, string> = {};
      for (let i = 0; i < fact.params.length; i++) {
        const p = fact.params[i];
        if (p.kind === Logic.Concrete) continue;
        const f = rule.follows.params[i];
        if (f.kind === Logic.Concrete) continue;
        symbolDict[f.name] = p.name;
      }
      const newConjunctionFacts = conjunction.facts.map((fact) => {
        return {
          ...fact,
          params: fact.params.map((p) => {
            if (p.kind === Logic.Concrete) return p;
            if (symbolDict[p.name]) {
              return {
                ...p,
                name: symbolDict[p.name],
              };
            }
            return p;
          }),
        };
      });
      yield* concretizeConjunction(db, fact, newConjunctionFacts);
    }
  }
}

function* concretizeConjunction(
  db: IDatabase,
  fact: TFact,
  deps: TFact[],
): Generator<any[]> {
  if (deps.length === 0) {
    yield* concretizePlainFact(db, fact);
    return;
  }
  console.log(
    `Resolving: ${deps.map(factToString).join(" | ")} -> ${factToString(fact)}`,
  );
  for (let depInd = 0; depInd < deps.length; depInd++) {
    const dep = deps[depInd];

    for (const concreteValues of concretize(db, dep)) {
      const symbolValues: Record<string, any> = {};
      for (let i = 0; i < concreteValues.length; i++) {
        const depParam = dep.params[i];
        if (depParam.kind === Logic.Concrete) continue;
        const symbolName = depParam.name;
        const concreteValue = concreteValues[i];
        symbolValues[symbolName] = concreteValue;
      }
      const newDeps: TFact[] = [];
      const concretizeParam = (
        symbolOrConcrete: ISymbol | IConcrete<unknown>,
      ): IConcrete<unknown> | ISymbol =>
        (symbolOrConcrete.kind === Logic.Concrete ||
            !symbolValues[symbolOrConcrete.name])
          ? symbolOrConcrete
          : {
            kind: Logic.Concrete,
            value: symbolValues[symbolOrConcrete.name],
          };
      for (let i = 0; i < deps.length; i++) {
        if (i === depInd) continue;
        const oldDep = deps[i];
        newDeps.push({
          kind: Logic.Fact,
          name: oldDep.name,
          params: oldDep.params.map(concretizeParam),
        });
      }

      const newFact: TFact = {
        kind: Logic.Fact,
        name: fact.name,
        params: fact.params.map(concretizeParam),
      };

      yield* concretizeConjunction(db, newFact, newDeps);
    }
  }
}
