export function parseValue<T extends any, Returns extends any>(
	value: T,
	parse?: (data: NonNullable<T>) => Returns
): Returns | NonNullable<T> | 'unknown' {
	return typeof value !== 'undefined' && value !== null
		? typeof parse === 'function'
			? parse(value)
			: value
		: 'unknown';
}
