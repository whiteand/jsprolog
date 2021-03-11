import {
  List,
  Map,
} from "https://deno.land/x/immutable@4.0.0-rc.12-deno.1/mod.ts";
import { IStatement, Logic, TDatabase, TKnowledge } from "./types.ts";
import { isConcrete } from "./utils.ts";

function* concreteStatement(db: TDatabase, probablyStatement: IStatement) {
  const facts = db.get(probablyStatement.name);
  if (!facts) {
    return;
  }
  console.log(facts)
}

export function* concrete(db: TDatabase, probablyKnowledge: TKnowledge) {
  switch (probablyKnowledge.kind) {
    case Logic.Statement:
      yield* concreteStatement(db, probablyKnowledge);
      break;
  }
}
