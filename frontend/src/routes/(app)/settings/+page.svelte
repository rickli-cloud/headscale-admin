<script lang="ts">
	import { writable } from 'svelte/store';

	import * as Card from '$lib/components/ui/card/index.js';

	import ApikeyList from '$lib/components/apikey/ApikeyList.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	import { PUBLIC_AUTH_ENABLED } from '$env/static/public';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { endSession } from '$lib/store/session';
	import type { ApiKey } from '$lib/api/index.js';

	export let data;

	console.table(data.apiKeys);

	const Keys = writable<ApiKey[]>(data.apiKeys || []);

	page.subscribe(({ data }) => {
		Keys.set(data.apiKeys || []);
	});
</script>

{#if PUBLIC_AUTH_ENABLED === "true"}
<section class="grid items-center space-y-0" style="grid-template-columns: 1fr 100px;">
	<Card.Header>
		<Card.Title>End Session</Card.Title>
		<Card.Description>Remove current session data</Card.Description>
	</Card.Header>

	<Button
		class="mx-2"
		on:click={async () => {
			endSession();
			await invalidateAll();
			window.location.href = base + '/login';
		}}
	>
		Logout
	</Button>
</section>
{/if}


<section>
	<ApikeyList {Keys} />
</section>
