<script lang="ts">
	import { writable } from 'svelte/store';

	import ApikeyList from '$lib/components/apikey/ApikeyList.svelte';

	import { page } from '$app/stores';
	import type { ApiKey } from '$lib/api/index.js';

	export let data;

	console.table(data.apiKeys);

	const Keys = writable<ApiKey[]>(data.apiKeys || []);

	page.subscribe(({ data }) => {
		Keys.set(data.apiKeys || []);
	});
</script>

<section>
	<ApikeyList {Keys} />
</section>
