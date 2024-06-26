import { Headscale } from '$lib/api/utils.js';

export async function load({ fetch }) {
	const headscale = new Headscale(fetch);

	const {
		data: { routes }
	} = await headscale.api.headscaleServiceGetRoutes({});

	return {
		routes
	};
}
