import { withNewStack } from "./stacks.ts";
import { IDatabase, IRule, Logic, TFact } from "./types.ts";

export function generateDB(callback: () => void): IDatabase {
  const factsAndRules = withNewStack(callback);
  const factsDict: Record<string, TFact[]> = {};
  const factsKeys: string[] = [];
  const rulesDict: Record<string, IRule[]> = {};
  const rulesKeys: string[] = [];
  for (let i = 0; i < factsAndRules.length; i++) {
    const factOrRule = factsAndRules[i];
    switch (factOrRule.kind) {
      case Logic.Fact:
      case Logic.GeneratorFact:
        if (factsDict[factOrRule.name]) {
          factsDict[factOrRule.name].push(factOrRule);
        } else {
          factsDict[factOrRule.name] = [factOrRule];
          factsKeys.push(factOrRule.name);
        }
        break;
      case Logic.Rule: {
        const ruleKey = factOrRule.follows.name;
        if (rulesDict[ruleKey]) {
          rulesDict[ruleKey].push(factOrRule);
        } else {
          rulesDict[ruleKey] = [factOrRule];
          rulesKeys.push(ruleKey);
        }
        break;
      }
      default:
        throw new Error("not finished db");
    }
  }

  return {
    kind: Logic.Database,
    factsKeys,
    factsDict,
    rulesKeys,
    rulesDict,
  };
}
