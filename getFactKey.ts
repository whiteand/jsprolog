export function getFactKey(name: string, arity: number): string {
  return `${name}/${arity}`;
}
