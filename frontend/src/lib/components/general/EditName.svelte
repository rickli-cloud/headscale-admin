<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { get, writable } from 'svelte/store';

	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	import * as Form from '$lib/components/form';

	export let name: string | undefined = undefined;
	export let onSubmit: (name: string) => void | Promise<void>;

	const NewName = writable<string>(name || '');

	const dispatch = createEventDispatcher();

	async function handleSubmit() {
		const newName = get(NewName);
		if (newName === name) return;
		await onSubmit(newName);
		dispatch('submit');
	}

	function handleReset() {
		NewName.set(name || '');
	}
</script>

<Form.Root onSubmit={handleSubmit} onReset={handleReset} let:disabled SubmitText="Save">
	<Form.Item>
		<Label aria-required for="name">Name</Label>
		<Input required id="name" bind:value={$NewName} {disabled} />
	</Form.Item>
</Form.Root>
