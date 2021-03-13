import { Logic } from "./types.ts";

const memoized = new Map<string, { kind: Logic.Symbol; name: string }>();
export function symbol<N extends string>(
  name: N,
): { readonly kind: Logic.Symbol; readonly name: N } {
  const memorizedresult = memoized.get(name);
  if (memorizedresult) {
    return memorizedresult as { kind: Logic.Symbol; name: N };
  }
  const res = {
    kind: Logic.Symbol,
    name,
  } as const;
  memoized.set(name, res);
  return res;
}
