<script lang="ts">
	import { get, writable } from 'svelte/store';

	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	import SelectUser from '$lib/components/users/SelectUser.svelte';
	import EditTags from '$lib/components/general/EditTags.svelte';
	import * as Form from '$lib/components/form';

	import { createEventDispatcher } from 'svelte';
	import type { Machine, V1User } from '$lib/api';

	export let machine: Machine;

	const MachineName = writable<string>(machine.givenName);
	const SelectedUser = writable<V1User>(machine.user);
	const MachineTags = writable<string[]>([]);
	const dispatch = createEventDispatcher();

	async function onSubmit() {
		const machineName = get(MachineName);
		if (machineName !== machine.name) {
			await machine.rename(machineName);
		}

		const selectedUser = get(SelectedUser);
		if (selectedUser?.name && (selectedUser.name !== machine.user?.name || !machine.user?.name)) {
			await machine.reassign(selectedUser.name);
		}

		const machineTags = get(MachineTags);
		if (
			((machine.forcedTags?.length || machineTags.length) &&
				machineTags.length !== machine.forcedTags?.length) ||
			JSON.stringify(machineTags) !== JSON.stringify(machine.forcedTags)
		) {
			await machine.setTags(machineTags);
		}

		dispatch('submit');
	}
</script>

<Form.Root 
	description="edit device"
	action={onSubmit}
	on:cancel
	submitText="Save"
	let:disabled
>
	<Form.Item>
		<Label aria-required for="name">Name</Label>
		<Input required id="name" bind:value={$MachineName} {disabled} />
	</Form.Item>

	<Form.Item>
		<SelectUser bind:selected={$SelectedUser} />
	</Form.Item>

	<Form.Item>
		<EditTags bind:tags={$MachineTags} />
	</Form.Item>
</Form.Root>
