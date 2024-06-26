<script lang="ts">
	import DeviceList from '$lib/components/devices/DeviceList.svelte';
	import PreauthList from '$lib/components/users/PreauthList.svelte';
	import UserInfo from '$lib/components/users/UserInfo.svelte';

	export let data;

	console.table(data.user);
	console.table(data.machines);
	console.table(data.preAuthKeys);
</script>

<section>
	<UserInfo user={data.user} />
</section>

<section>
	<DeviceList machines={data.machines} />
</section>

<section>
	<PreauthList preAuthKeys={data.preAuthKeys} user={data.user?.name} creatable />
</section>
