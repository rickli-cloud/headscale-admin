<script lang="ts">
	import { writable } from 'svelte/store';

	import DeviceList from '$lib/components/devices/DeviceList.svelte';

	import { page } from '$app/stores';
	import type { Machine } from '$lib/api/index.js';

	export let data;

	console.table(data.machines);

	const Machines = writable<Machine[]>(data.machines || []);

	page.subscribe(({ data }) => {
		Machines.set(data.machines || []);
	});
</script>

<section>
	<DeviceList {Machines} />
</section>
