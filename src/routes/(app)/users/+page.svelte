<script lang="ts">
	import { page } from '$app/stores';
	import ApiKeyTable from '$lib/components/data/apiKey/ApiKeyTable.svelte';
	import GroupTable from '$lib/components/data/group/GroupTable.svelte';
	import UserTable from '$lib/components/data/user/UserTable.svelte';
	import Code from '$lib/components/general/Code.svelte';
	import PageErrors from '$lib/components/site/PageErrors.svelte';
	import { writable } from 'svelte/store';

	export let data;

	const { errors } = data;

	const users = writable(data.users || []);
	const apiKeys = writable(data.apiKeys || []);

	page.subscribe((state) => {
		users.set(state.data.users || []);
		apiKeys.set(state.data.apiKeys || []);
	});
</script>

<PageErrors {errors} />

<section>
	<UserTable {users} />
</section>

<section>
	<GroupTable {users} />
</section>

<section>
	<ApiKeyTable {apiKeys} />
</section>

<Code yaml={data} />
