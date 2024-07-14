<script lang="ts">
	import { writable } from 'svelte/store';

	import DeviceList from '$lib/components/devices/DeviceList.svelte';
	import PreauthList from '$lib/components/preauth/PreauthList.svelte';
	import UserInfo from '$lib/components/users/UserInfo.svelte';

	import { page } from '$app/stores';
	import type { Machine, PreAuthKey } from '$lib/api/index.js';

	export let data;

	console.table(data.user);
	console.table(data.machines);
	console.table(data.preAuthKeys);

	const Machines = writable<Machine[]>(data.machines || []);
	const PreAuthKeys = writable<PreAuthKey[]>(data.preAuthKeys || []);

	page.subscribe(({ data }) => {
		Machines.set(data.machines || []);
		PreAuthKeys.set(data.preAuthKeys || []);
	});
</script>

<section>
	<UserInfo user={data.user} />
</section>

<section>
	<DeviceList {Machines} />
</section>

<section>
	<PreauthList {PreAuthKeys} User={data.user?.name} Creatable />
</section>
