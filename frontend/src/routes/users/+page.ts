import { Headscale, User } from '$lib/api';

export async function load({ fetch }) {
	const headscale = new Headscale(fetch);

	const users = await User.list(headscale);

	return {
		users
	};
}
