<script lang="ts">
	import { page } from '$app/stores';
	import type { Route } from '$lib/api/index.js';
	import RoutesList from '$lib/components/routes/RoutesList.svelte';
	import { writable } from 'svelte/store';

	export let data;

	console.debug(data);

	const Routes = writable<Route[]>(data.routes);

	page.subscribe(({ data }) => {
		Routes.set(data.routes);
	});
</script>

<section>
	<RoutesList {Routes} />
</section>
