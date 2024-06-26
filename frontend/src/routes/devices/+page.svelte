<script lang="ts">
	import DeviceList from '$lib/components/devices/DeviceList.svelte';

	export let data;

	console.table(data.machines);
</script>

<section>
	<DeviceList machines={data.machines} />
</section>
