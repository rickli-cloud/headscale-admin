import { Headscale, ApiKey } from '$lib/api';

export async function load({ fetch }) {
	const headscale = new Headscale(fetch);

	const apiKeys = await ApiKey.list(headscale);

	return {
		apiKeys
	};
}
