import { Headscale, Route } from '$lib/api/index.js';
import { loadSession } from '$lib/store/session.js';

export async function load({ fetch }) {
	loadSession();
	const headscale = new Headscale({ fetch });

	const routes = await Route.list(undefined, headscale);

	return {
		routes: routes.data,
		errors: [routes.error].filter((i) => !!i)
	};
}
