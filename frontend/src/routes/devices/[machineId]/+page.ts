import { Headscale } from '$lib/api/utils.js';

export async function load({ fetch, params }) {
	const headscale = new Headscale(fetch);

	const {
		data: { machine }
	} = await headscale.api.headscaleServiceGetMachine(params.machineId);

	const {
		data: { routes }
	} = await headscale.api.headscaleServiceGetMachineRoutes(params.machineId);

	return {
		machine,
		routes
	};
}
