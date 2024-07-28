import { Headscale, Route } from '$lib/api';

export async function load({ fetch }) {
	const headscale = new Headscale({ fetch });

	const routes = await Route.list(undefined, headscale);

	return {
		routes
	};
}
