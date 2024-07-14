<script lang="ts">
	import { writable } from 'svelte/store';

	import DeviceInfo from '$lib/components/devices/DeviceInfo.svelte';
	import PreauthList from '$lib/components/preauth/PreauthList.svelte';
	import RoutesList from '$lib/components/routes/RoutesList.svelte';

	import { type Machine, PreAuthKey, type Route } from '$lib/api/index.js';
	import { page } from '$app/stores';

	export let data;

	console.table(data.machine);
	console.table(data.routes);

	const Machine = writable<Machine>(data.machine);
	const Routes = writable<Route[]>(data.routes || []);
	const PreAuthKeys = writable<PreAuthKey[]>(
		data.machine?.preAuthKey ? [new PreAuthKey(data.machine.preAuthKey)] : []
	);

	page.subscribe(({ data }) => {
		Machine.set(data.machine || {});
		Routes.set(data.routes || []);
		PreAuthKeys.set(data.machine?.preAuthKey ? [new PreAuthKey(data.machine.preAuthKey)] : []);
	});
</script>

<section>
	<DeviceInfo {Machine} />
</section>

<section>
	<RoutesList {Routes} />
</section>

<section>
	<PreauthList {PreAuthKeys} />
</section>
