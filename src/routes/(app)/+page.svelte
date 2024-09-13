<script lang="ts">
	import { page } from '$app/stores';
	import RoutesTable from '$lib/components/data/routes/RouteTable.svelte';
	import PageErrors from '$lib/components/site/PageErrors.svelte';
	import { writable } from 'svelte/store';

	export let data;

	const { errors } = data;

	const routes = writable(data.routes || []);

	page.subscribe((state) => {
		routes.set(state.data.routes);
	});
</script>

<PageErrors {errors} />

<section>
	<RoutesTable {routes} />
</section>
