import { base } from '$app/paths';
import { loadSession } from '$lib/store/session.js';
import { env } from '$env/dynamic/public';

export async function load({}) {
	if (env.PUBLIC_DISABLE_TOKEN_AUTH === 'true' || loadSession()) {
		window.location.href = base + '/';
		return;
	}
}
