import {
  List,
  Map,
} from "https://deno.land/x/immutable@4.0.0-rc.12-deno.1/mod.ts";

export enum Logic {
  Symbol = "Symbol",
  Concrete = "Concrete",
  Statement = "Statement",
  DependentStatement = "DependentStatement",
  Relation = "Relation",
  Negation = "Negation",
}

export interface ISymbol {
  kind: Logic.Symbol;
  name: string;
}
export interface IConcrete {
  kind: Logic.Concrete;
  value: any;
}
export type TParam = ISymbol | IConcrete;
export interface IStatement {
  kind: Logic.Statement;
  name: string;
  params: List<TParam>;
}
export interface IDependentStatement {
  kind: Logic.DependentStatement;
  name: string;
  params: List<TParam>;
  deps: List<TKnowledge>;
}

interface IRule {
  kind: Logic.Relation;
  name: string;
  apply: (db: TDatabase, ...args: TParam[]) => Iterable<TKnowledge>;
}

export interface INegation {
  kind: Logic.Negation;
  statement: IStatement | IDependentStatement;
}

export type TKnowledge = IStatement | IDependentStatement | IRule | INegation;
export type TDatabase = Map<string, List<TKnowledge>>;
