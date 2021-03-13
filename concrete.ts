import { List } from "https://deno.land/x/immutable@4.0.0-rc.12-deno.1/mod.ts";
import { invariant } from "./invariant.ts";
import { isSameValue } from "./isSameValue.ts";
import { toString } from "./toString.ts";
import {
  IConcrete,
  IStatement,
  ISymbol,
  Logic,
  TDatabase,
  TKnowledge,
  TParam,
} from "./types.ts";

// export type TKnowledge = IStatement | IDependentStatement | IRule | INegation;

function assignConcreteValue(
  symbolName: string,
  concreteParam: IConcrete,
  params: List<TParam>,
): List<TParam> {
  let res = params;
  for (let i = 0; i < res.size; i++) {
    const p = res.get(i);
    if (!p) continue;
    if (p.kind === Logic.Concrete) continue;
    if (p.name !== symbolName) continue;
    res = res.set(i, concreteParam);
  }
  return res;
}

function replaceSymbol(
  oldNameSymbol: string,
  newSymbol: ISymbol,
  params: List<TParam>,
): List<TParam> {
  let res = params;
  for (let i = 0; i < res.size; i++) {
    const p = res.get(i);
    if (!p) continue;
    if (p.kind === Logic.Concrete) continue;
    if (p.name === oldNameSymbol) {
      res = res.set(i, newSymbol);
    }
  }
  return res;
}

function* concreteStatementWithStatement(
  db: TDatabase,
  probablyStatement: IStatement,
  fact: IStatement,
) {
  let newParams = probablyStatement.params;
  let factParams = fact.params;
  fromStart:
  while (true) {
    paramLoop:
    for (let i = 0; i < newParams.size; i++) {
      const newParam = newParams.get(i);
      invariant(!!newParam, "newParam should be present");

      const factParam = fact.params.get(i);
      invariant(!!factParam, `factParam should be truthy`);

      if (factParam.kind === Logic.Concrete) {
        if (newParam.kind === Logic.Concrete) {
          if (isSameValue(factParam.value, newParam.value)) {
            continue paramLoop;
          } else {
            return;
          }
        } else {
          newParams = assignConcreteValue(newParam.name, factParam, newParams);
          continue fromStart;
        }
      } else {
        if (newParam.kind === Logic.Concrete) {
          factParams = assignConcreteValue(
            factParam.name,
            newParam,
            factParams,
          );
          continue fromStart;
        } else if (factParam.name !== newParam.name) {
          factParams = replaceSymbol(factParam.name, newParam, factParams);
          continue fromStart;
        } else {
          continue paramLoop;
        }
      }
    }
    yield {
      kind: Logic.Statement,
      name: fact.name,
      params: newParams,
    } as IStatement;
    return;
  }
}

function* concreteStatement(db: TDatabase, probablyStatement: IStatement) {
  const facts = db.get(probablyStatement.name);
  if (!facts) {
    return;
  }
  for (let i = 0; i < facts.size; i++) {
    const fact = facts.get(i);
    if (!fact) continue;
    switch (fact.kind) {
      case Logic.Statement:
        yield* concreteStatementWithStatement(db, probablyStatement, fact);
        break;
      default:
        continue;
    }
  }
}

// Concrete returns iteration of the knowledges which have more concrete params

export function* concrete(db: TDatabase, probablyKnowledge: TKnowledge) {
  switch (probablyKnowledge.kind) {
    case Logic.Statement:
      yield* concreteStatement(db, probablyKnowledge);
      break;
    default:
      throw new Error("Cannot concretize this type yet");
  }
}
