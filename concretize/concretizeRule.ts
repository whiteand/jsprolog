import { IConcrete, IDatabase, ISymbol, Logic, TFact } from "../types.ts";
import { has } from "../utils.ts";
import { concretize } from "./concretize.ts";
import { concretizePlainFact } from "./concretizePlainFact.ts";
import { isSameValue } from "./isSameValue.ts";

export function* concretizeRule(db: IDatabase, fact: TFact): Generator<any[]> {
  if (fact.kind === Logic.GeneratorFact) {
    return;
  }
  const rules = db.rulesDict[fact.name];
  if (!rules || rules.length === 0) return;

  for (const rule of rules) {
    conjunctionLoop:
    for (const conjunction of rule.from.conjunctions) {
      const symbolDict: Record<string, string> = Object.create(null);
      const symbolValues: Record<string, any> = Object.create(null);
      for (let i = 0; i < fact.params.length; i++) {
        const p = fact.params[i];
        const f = rule.follows.params[i];
        if (p.kind === Logic.Concrete) {
          if (f.kind === Logic.Concrete) {
            if (isSameValue(p.value, f.value)) {
              continue;
            } else {
              continue conjunctionLoop;
            }
          } else {
            symbolValues[f.name] = p.value;
            continue;
          }
        }
        if (f.kind === Logic.Concrete) continue;
        symbolDict[f.name] = p.name;
      }
      const newConjunctionFacts = conjunction.facts.map((fact) => {
        return {
          ...fact,
          params: fact.params.map((p) => {
            if (p.kind === Logic.Concrete) return p;
            if (has(symbolValues, p.name)) {
              const concrete: IConcrete<any> = {
                kind: Logic.Concrete,
                value: symbolValues[p.name],
              };
              return concrete;
            }
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
    console.log(
      "reduced to single fact",
      fact.name,
      fact.params.map((p: any) => `${p?.value || ""}${p?.name || ""}`).join(
        " ",
      ),
    );
    yield* concretizePlainFact(db, fact);
    return;
  }
  for (let depInd = 0; depInd < deps.length; depInd++) {
    console.log(
      `resolve ${depInd} for`,
      fact.name,
      fact.params.map((p: any) => `${p?.value || ""}${p?.name || ""}`).join(
        " ",
      ),
    );
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
