import { IDatabase, TFact } from "../types.ts";
import { concretizePlainFact } from "./concretizePlainFact.ts";
import { concretizeRule } from "./concretizeRule.ts";

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (!a) return false;
  if (!b) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  if (Array.isArray(a) || Array.isArray(b)) {
    return false;
  }
  return JSON.stringify(a) === JSON.stringify(b);
}

export function* concretize(
  db: IDatabase,
  fact: TFact,
  isSame: (first: any[], second: any[]) => boolean = deepEqual,
): Generator<any[]> {
  let occurred: any[][] = [];
  for (const entry of concretizePlainFact(db, fact)) {
    if (occurred.some((oldEntry) => isSame(oldEntry, entry))) continue;
    occurred.push(entry);
    yield entry;
  }
  for (const entry of concretizeRule(db, fact)) {
    if (occurred.some((oldEntry) => isSame(oldEntry, entry))) continue;
    occurred.push(entry);
    yield entry;
  }
}
