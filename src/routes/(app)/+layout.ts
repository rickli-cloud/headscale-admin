import { base } from '$app/paths';
import { loadSession } from '$lib/store/session';
import { redirect } from '@sveltejs/kit';

export async function load() {
	if (!loadSession()) return redirect(302, base + '/auth');

	return {};
}
