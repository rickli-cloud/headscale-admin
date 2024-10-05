import { Acl, ApiKey, formatApiErrors, Headscale, User } from '$lib/api';
import { AclStore } from '$lib/store/acl.js';

export async function load({ fetch }) {
	const headscale = new Headscale({ fetch });

	const acl = await Acl.load(headscale);
	if (acl?.data) AclStore.set(acl.data);

	const users = await User.list(headscale);

	const apiKeys = await ApiKey.list(headscale);

	return {
		users: users.data,
		apiKeys: apiKeys.data,
		errors: formatApiErrors([users.error, acl.error, apiKeys.error])
	};
}
