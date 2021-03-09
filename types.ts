export enum Logic {
  Symbol = 1,
  Fact = 2,
  And = 4,
  Or = 8,
  From = 12, // And | Or,
  Rule = 14, // From | Fact
  Conjunction = 16,
  CNF = 24, // Conjunction | Or
  Data = 32,
}

export interface IAnd {
  kind: Logic.And;
}
export interface IOr {
  kind: Logic.Or;
}

export interface IFact {
  kind: Logic.Fact;
  name: string;
  params: ISymbol[];
}

export interface ISymbol {
  kind: Logic.Symbol;
  name: string;
}

export interface IConjunction {
  kind: Logic.Conjunction;
  facts: IFact[];
}

export interface ICNF {
  kind: Logic.CNF;
  conjunctions: IConjunction[];
}

export interface IFrom {
  kind: Logic.From;
  cnf: ICNF;
}

export interface IRule {
  kind: Logic.Rule;
  from: IFrom;
  follows: IFact;
}

export type StackItem =
  | ISymbol
  | IFact
  | IAnd
  | IOr
  | IFrom
  | ICNF
  | IRule;
