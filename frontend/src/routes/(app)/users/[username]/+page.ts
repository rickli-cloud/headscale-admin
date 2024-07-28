import { Headscale, User } from '$lib/api';

export async function load({ params, fetch }) {
	const headscale = new Headscale({ fetch });

	const user = await User.find(params.username, headscale);
	const preAuthKeys = await user?.getPreAuthKeys(headscale);
	const machines = await user?.getMachines(headscale);

	return {
		user,
		preAuthKeys,
		machines
	};
}
