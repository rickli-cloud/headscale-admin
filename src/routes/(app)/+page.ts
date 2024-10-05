import { formatApiErrors, Headscale, Route } from '$lib/api';
import { loadSession } from '$lib/store/session';

export async function load({ fetch }) {
	loadSession();
	const headscale = new Headscale({ fetch });

	const routes = await Route.list(headscale);

	return {
		routes: routes.data,
		errors: formatApiErrors([routes.error])
	};
}
