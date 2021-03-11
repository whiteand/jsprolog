export function update<T>(index: number, value: T, array: T[]): T[] {
  const newArray = array.slice();
  newArray[index] = value;
  return newArray;
}

export function has(value: any, key: string | number) {
  if (!value) return false;
  return Object.prototype.hasOwnProperty.call(value, key);
}
