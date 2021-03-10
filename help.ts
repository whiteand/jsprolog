import { IConcrete, ISymbol, Logic } from "./types.ts";
import { TFact } from "./types.ts";

function paramToString(symCon: ISymbol | IConcrete<unknown>): string {
  if (symCon.kind === Logic.Symbol) {
    return `<${symCon.name}>`;
  }
  return JSON.stringify(symCon.value);
}

export function factToString(fact: TFact) {
  return `${fact.kind === Logic.GeneratorFact ? "generate " : ""}${fact.name} ${
    fact.params.map(paramToString).join(" ")
  }`;
}
export function logFact(fact: TFact) {
  console.log(factToString(fact));
}
