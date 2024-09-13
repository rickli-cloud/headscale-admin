export function filterArrayByIndexes<T>(arr: T[], indexes: number[]): T[] {
	return arr?.length ? arr.filter((_, i) => indexes.includes(i)) : new Array<T>();
}
