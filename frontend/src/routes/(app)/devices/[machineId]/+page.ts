import { Headscale, Machine } from '$lib/api';

export async function load({ fetch, params }) {
	const headscale = new Headscale({ fetch });

	const machine = await Machine.get(params.machineId, headscale);
	const routes = await machine?.getRoutes();

	return {
		machine,
		routes
	};
}
