<script lang="ts">
	import { writable } from 'svelte/store';

	import UsersList from '$lib/components/users/UsersList.svelte';
	import AclGroups from '$lib/components/acl/AclGroups.svelte';

	import { page } from '$app/stores';
	import type { User } from '$lib/api';

	export let data;

	const Users = writable<User[]>(data.users || []);

	page.subscribe(({ data }) => {
		Users.set(data.users || []);
	});
</script>

<section>
	<UsersList {Users} />
</section>

<section>
	<AclGroups />
</section>
