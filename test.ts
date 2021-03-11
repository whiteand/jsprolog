import {
  List,
  Map,
} from "https://deno.land/x/immutable@4.0.0-rc.12-deno.1/mod.ts";
import { concrete } from "./concrete.ts";
import {
  IConcrete,
  INegation,
  IStatement,
  Logic,
  TKnowledge,
} from "./types.ts";

const sergey: IConcrete = { kind: Logic.Concrete, value: "sergey" };
const andrew: IConcrete = { kind: Logic.Concrete, value: "andrew" };
const bohdan: IConcrete = { kind: Logic.Concrete, value: "bohdan" };

const fatherRelation = List<IStatement>([
  { kind: Logic.Statement, name: "father", params: List([sergey, andrew]) },
  { kind: Logic.Statement, name: "father", params: List([sergey, bohdan]) },
]);

const db = Map<string, List<TKnowledge>>([["father", fatherRelation], [
  "notfather",
  List<INegation>([
    {
      kind: Logic.Negation,
      statement: {
        kind: Logic.Statement,
        name: "father",
        params: List([{ kind: Logic.Concrete, value: "sergey" }, {
          kind: Logic.Concrete,
          value: "elena",
        }]),
      },
    },
  ]),
]]);

for (const r of concrete(db, {
  kind: Logic.Statement,
  name: "father",
  params: List([
    { kind: Logic.Symbol, name: "X" },
    { kind: Logic.Symbol, name: "Y" },
  ]),
})) {
    console.log(r)
    break;
}
