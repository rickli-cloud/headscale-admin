import { Headscale } from '$lib/api/utils.js';

export async function load({ params, fetch }) {
	const headscale = new Headscale(fetch);

	const {
		data: { user }
	} = await headscale.api.headscaleServiceGetUser(params.username);

	const {
		data: { preAuthKeys }
	} = await headscale.api.headscaleServiceListPreAuthKeys({ user: params.username });

	const {
		data: { machines }
	} = await headscale.api.headscaleServiceListMachines({ user: params.username });

	return {
		user,
		preAuthKeys,
		machines
	};
}
