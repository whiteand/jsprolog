import { IConcrete, Logic } from "./types.ts";

export function concrete<T>(value: T): IConcrete<T> {
  return {
    kind: Logic.Concrete,
    value,
  };
}
