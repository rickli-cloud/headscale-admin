<script lang="ts">
	import { writable } from 'svelte/store';

	import RoutesList from '$lib/components/routes/RoutesList.svelte';
	
	import { page } from '$app/stores';
	import type { Route } from '$lib/api/index.js';
	import AclHosts from '$lib/components/acl/AclHosts.svelte';

	export let data;

	console.table(data);

	const Routes = writable<Route[]>(data.routes);

	page.subscribe(({ data }) => Routes.set(data.routes));
</script>

<section>
	<RoutesList {Routes} />
</section>

<section>
	<AclHosts />
</section>
