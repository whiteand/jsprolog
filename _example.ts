import { concrete } from "./concrete.ts";
import { fact } from "./fact.ts";
import { follows } from "./follows.ts";
import { from } from "./from.ts";
import { generateDB } from "./generateDB.ts";
import { symbol } from "./symbol.ts";
import { and } from "./and.ts";
import { concretize } from "./concretize/concretize.ts";
import { Logic } from "./types.ts";

const db = generateDB(() => {
  fact("father", concrete("sergey"), concrete("andrew"));
  fact("father", concrete("sergey"), concrete("bohdan"));
  fact("notequal", symbol("A"), symbol("B"), (db, a, b) => {
    if (a.kind !== Logic.Concrete) return [];
    if (b.kind !== Logic.Concrete) return [];
    return a.value !== b.value ? [[a.value, b.value]] : [];
  });
  from(
    fact("father", symbol("X"), symbol("Y")),
    and,
    fact("father", symbol("X"), symbol("Z")),
    and,
    fact("notequal", symbol("Y"), symbol("Z")),
  );
  follows(
    fact("sibling", symbol("Y"), symbol("Z")),
  );
});

const request = concretize(
  db,
  fact("sibling", concrete("andrew"), symbol("B")),
);

console.log([...request].map((pair) => JSON.stringify(pair)).join("\n"));
