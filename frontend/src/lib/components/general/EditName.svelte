<script lang="ts">
	import { get, writable } from 'svelte/store';

	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	export let name: string | undefined = undefined;
	export let onSubmit: (name: string) => void | Promise<void>;
	export let id = window.crypto.randomUUID();

	const NewName = writable<string>(name || '');
	const Working = writable<boolean>(false);

	async function handleSubmit() {
		Working.set(true);
		const newName = get(NewName);

		if (name === newName) {
			Working.set(false);
			return;
		}

		await onSubmit(newName);
		Working.set(false);
	}
</script>

<form {id} class="grid w-full items-center gap-4" on:submit|preventDefault={handleSubmit}>
	<div class="flex flex-col space-y-2">
		<Label aria-required for="{id}-name">Name</Label>
		<Input required id="{id}-name" bind:value={$NewName} disabled={$Working} />
	</div>
</form>

<div class="mt-6 flex justify-between gap-3">
	<p class="star-note self-start text-xs text-muted-foreground">Required</p>
	<div class="flex gap-3">
		<Button variant="outline" on:click={() => NewName.set(name || '')} disabled={$Working}>
			Reset
		</Button>
		<Button form={id} type="submit" disabled={$Working}>Continue</Button>
	</div>
</div>
