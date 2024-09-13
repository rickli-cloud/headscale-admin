import { Headscale, Machine } from '$lib/api/index.js';

export async function load({ fetch }) {
	const headscale = new Headscale({ fetch });

	const machines = await Machine.list(undefined, headscale);

	return {
		machines: machines.data,
		errors: [machines.error].filter((e) => !!e)
	};
}
