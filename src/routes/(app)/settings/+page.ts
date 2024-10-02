import { Acl, Headscale } from '$lib/api';
import { AclStore } from '$lib/store/acl.js';

export async function load({ fetch }) {
	const headscale = new Headscale({ fetch });

	const acl = await Acl.load(headscale);
	if (acl?.data) AclStore.set(acl.data);

	return {
		errors: [acl.error].filter((e) => !!e)
	};
}
