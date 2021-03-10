export function update<T>(index: number, value: T, array: T[]): T[] {
  const newArray = array.slice();
  newArray[index] = value;
  return newArray;
}
