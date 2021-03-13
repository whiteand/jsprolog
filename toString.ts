import { IConcrete, ISymbol, Logic, TKnowledge } from "./types.ts";

export function toString(knowledge: TKnowledge | ISymbol | IConcrete): string {
  switch (knowledge.kind) {
    case Logic.Statement:
      return `${knowledge.name}(${knowledge.params.map(toString).join(", ")})`;
    case Logic.DependentStatement:
      return `${knowledge.name}(${
        knowledge.params.map(toString).join(", ")
      }):-\n\t${knowledge.deps.map(toString).join(",\n\t")}`;
    case Logic.Rule:
      return `\`${knowledge.name}\``;
    case Logic.Negation:
      return `NOT [${toString(knowledge.statement)}]`;
    case Logic.Symbol:
      return `<${knowledge.name}>`;
    case Logic.Concrete:
      if (knowledge.value === null) return "null";
      if (knowledge.value === undefined) return "undefined";
      return JSON.stringify(knowledge.value);
    default:
      return "unknown";
  }
}
