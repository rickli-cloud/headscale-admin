import { redirect } from '@sveltejs/kit';

import { base } from '$app/paths';
import { env } from '$env/dynamic/public';
import { loadSession } from '$lib/store/session.js';
import { Acl, Headscale } from '$lib/api/index.js';
import { AclStore } from '$lib/store/acl.js';

export async function load({ fetch }) {
	if (env.PUBLIC_DISABLE_TOKEN_AUTH !== 'true' && !loadSession()) {
		return redirect(302, base + '/login');
	}

	const headscale = new Headscale({ fetch });
	const { data, error } = await Acl.load(headscale);
	if (data) AclStore.set(data);

	return {
		errors: [error]
	};
}
