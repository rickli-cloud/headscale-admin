export function formatStack(stack: string | undefined) {
	return (
		stack
			?.trim()
			.split(/\n/gm)
			.map((i) => [i.substring(0, i.indexOf('@')) || 'anonymous', i.substring(i.indexOf('@') + 1)]) || []
	);
}
