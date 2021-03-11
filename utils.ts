import { IConcrete, ISymbol, Logic } from "./types.ts";

export function has(value: any, key: string | number) {
  if (!value) return false;
  return Object.prototype.hasOwnProperty.call(value, key);
}

export function isConcrete(value: ISymbol | IConcrete): value is IConcrete {
  return value.kind === Logic.Concrete;
}
