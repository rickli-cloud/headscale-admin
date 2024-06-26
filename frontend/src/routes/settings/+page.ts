import { Headscale } from '$lib/api/utils.js';

export async function load({ fetch }) {
	const headscale = new Headscale(fetch);

	const {
		data: { apiKeys }
	} = await headscale.api.headscaleServiceListApiKeys();

	return {
		apiKeys
	};
}
