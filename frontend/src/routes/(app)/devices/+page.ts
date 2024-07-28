import { Headscale, Machine } from '$lib/api';

export async function load({ fetch }) {
	const headscale = new Headscale({ fetch });

	const machines = await Machine.list(undefined, headscale);

	return {
		machines
	};
}
