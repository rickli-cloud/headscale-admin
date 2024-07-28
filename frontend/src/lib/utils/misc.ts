export function parseValue<T extends any, Returns extends any>(
	value: T,
	parse?: ((data: NonNullable<T>) => Returns) | undefined,
	fallback: string = 'unknown'
): Returns | NonNullable<T> | typeof fallback {
	return typeof value !== 'undefined' && value !== null
		? typeof parse === 'function'
			? parse(value)
			: value
		: fallback;
}
