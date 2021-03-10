export enum Logic {
  Concrete = "Concrete",
  Symbol = "Symbol",
  Fact = "Fact",
  GeneratorFact = "GeneratorFact",
  And = "And",
  Or = "Or",
  From = "From",
  Conjunction = "Conjunction",
  CNF = "CNF",
  Rule = "Rule",
  Database = "Database",
}

export interface IAnd {
  kind: Logic.And;
}
export interface IOr {
  kind: Logic.Or;
}

interface IEnumFact {
  kind: Logic.Fact;
  name: string;
  params: (ISymbol | IConcrete<any>)[];
}

export type GenerateFunc = (
  db: IDatabase,
  ...args: (ISymbol | IConcrete<any>)[]
) => Iterable<any[]>;

interface IGeneratorFact extends Omit<IEnumFact, "kind"> {
  kind: Logic.GeneratorFact;
  generator: GenerateFunc;
}

export type TFact = IEnumFact | IGeneratorFact;

export interface ISymbol {
  kind: Logic.Symbol;
  name: string;
}

export interface IConjunction {
  kind: Logic.Conjunction;
  facts: TFact[];
}

export interface ICNF {
  kind: Logic.CNF;
  conjunctions: IConjunction[];
}

export interface IRule {
  kind: Logic.Rule;
  from: ICNF;
  follows: TFact;
}

export interface IConcrete<T> {
  kind: Logic.Concrete;
  value: T;
}

export type StackItem =
  | TFact
  | ICNF
  | IRule;

export interface IDatabase {
  kind: Logic.Database;
  factsKeys: string[];
  factsDict: Record<string, TFact[]>;
  rulesKeys: string[];
  rulesDict: Record<string, IRule[]>;
}
