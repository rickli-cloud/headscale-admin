<script lang="ts">
	import RoutesList from '$lib/components/devices/RoutesList.svelte';

	export let data;

	console.debug(data);
</script>

<section>
	<RoutesList routes={data.routes} />
</section>
