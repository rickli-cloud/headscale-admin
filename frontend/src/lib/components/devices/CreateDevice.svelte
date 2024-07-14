<script lang="ts">
	import { get, writable } from 'svelte/store';
	import { createEventDispatcher } from 'svelte';

	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	import SelectUser from '$lib/components/users/SelectUser.svelte';
	import * as Form from '$lib/components/form';

	import { invalidateAll } from '$app/navigation';
	import type { V1User } from '$lib/api/api';
	import { Machine } from '$lib/api';

	export let User: string | undefined = '';

	interface RegisterMachineData {
		key?: string;
	}

	const RegisterData = writable<RegisterMachineData>({ key: '' });
	const SelectedUser = writable<V1User | undefined>({ name: User });

	const dispatch = createEventDispatcher();

	async function handleSubmit() {
		const selectedUser = get(SelectedUser);
		const { key } = get(RegisterData);
		if (!selectedUser?.name || !key) return void 0;

		await Machine.register({ key: key, user: selectedUser.name });

		invalidateAll();
		dispatch('submit');
	}

	function handleReset() {
		RegisterData.set({ key: undefined });
		SelectedUser.set(undefined);
	}
</script>

<Form.Root onSubmit={handleSubmit} onReset={handleReset} let:disabled let:id>
	<Form.Item>
		<SelectUser bind:selected={$SelectedUser} />
	</Form.Item>

	<Form.Item>
		<Label aria-required for="{id}-register-machine-publickey">Device key</Label>
		<Input
			required
			{disabled}
			id="{id}-register-machine-publickey"
			bind:value={$RegisterData.key}
		/>
	</Form.Item>
</Form.Root>
