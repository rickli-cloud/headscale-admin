<script lang="ts">
	import DeviceInfo from '$lib/components/devices/DeviceInfo.svelte';
	import PreauthList from '$lib/components/users/PreauthList.svelte';
	import RoutesList from '$lib/components/devices/RoutesList.svelte';

	export let data;

	console.table(data.machine);
	console.table(data.routes);
</script>

<section>
	<DeviceInfo machine={data.machine} />
</section>

<section>
	<RoutesList routes={data.routes} />
</section>

<section>
	<PreauthList preAuthKeys={data.machine?.preAuthKey ? [data.machine.preAuthKey] : []} />
</section>
