import { base } from '$app/paths';
import { loadSession } from '$lib/store/session.js';
import { PUBLIC_AUTH_ENABLED } from '$env/static/public';

export async function load({}) {
	if (PUBLIC_AUTH_ENABLED !== 'true' || loadSession()) {
		window.location.href = base + '/';
		return;
	}
}
