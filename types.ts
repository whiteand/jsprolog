export enum Logic {
  Symbol = "Symbol",
  Fact = "Fact",
  And = "And",
  Or = "Or",
  From = "From",
  Rule = "Rule",
  Conjunction = "Conjunction",
  CNF = "CNF",
  Data = "Data",
  Concrete = "Concrete",
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
  params: (ISymbol | IConcrete<any>)[];
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

export interface IRule {
  kind: Logic.Rule;
  from: ICNF;
  follows: IFact;
}

export interface IConcrete<T> {
  kind: Logic.Concrete;
  value: T;
}

export type StackItem =
  | ISymbol
  | IConcrete<any>
  | IFact
  | IAnd
  | IOr
  | ICNF
  | IRule;
