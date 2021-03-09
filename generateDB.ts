import { withNewStack } from "./stacks";
import { IFact, IRule, Logic } from "./types";

export function generateDB(callback: () => void) {
  const factsAndRules = withNewStack(callback);
  const factsDict: Record<string, IFact[]> = {};
  const factsKeys: string[] = [];
  const rulesDict: Record<string, IRule[]> = {};
  const rulesKeys: string[] = [];
  for (let i = 0; i < factsAndRules.length; i++) {
    const factOrRule = factsAndRules[i];
    switch (factOrRule.kind) {
      case Logic.Fact:
        if (factsDict[factOrRule.name]) {
          factsDict[factOrRule.name].push(factOrRule);
        } else {
          factsDict[factOrRule.name] = [factOrRule];
          factsKeys.push(factOrRule.name);
        }
        break;
      case Logic.Rule:
        const ruleKey = factOrRule.follows.name;
        if (rulesDict[ruleKey]) {
          rulesDict[ruleKey].push(factOrRule);
        } else {
          rulesDict[ruleKey] = [factOrRule];
          rulesKeys.push(ruleKey);
        }
        break;
      default:
        throw new Error("not finished db");
    }
  }

  return {
    kind: Logic.Data,
    factsKeys,
    factsDict,
    rulesKeys,
    rulesDict,
  };
}
