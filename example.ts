import { concrete } from "./concrete.ts";
import { fact } from "./fact.ts";
import { follows } from "./follows.ts";
import { from } from "./from.ts";
import { generateDB } from "./generateDB.ts";
import { symbol } from "./symbol.ts";
import { and } from "./and.ts";

const db = generateDB(() => {
  fact("father", concrete("sergey"), concrete("andrew"));
  fact("father", concrete("sergey"), concrete("bohdan"));
  from(
    fact("father", symbol("X"), symbol("Y")),
    and(),
    fact("father", symbol("X"), symbol("Z")),
  );
  follows(
    fact("sibling", symbol("Y"), symbol("Z")),
  );
});

console.log(Deno.inspect(db, { colors: true, depth: 100 }));
