<script lang="ts">
	import { writable } from 'svelte/store';

	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	export let phrase: string;
	export let onSubmit: () => void | Promise<void>;

	const InputPhrase = writable<string>('');
	const MatchErr = writable<boolean>(true);
	const Working = writable<boolean>(false);

	InputPhrase.subscribe((input) => MatchErr.set(input !== phrase));

	async function handleSubmit() {
		Working.set(true);
		await onSubmit();
		Working.set(false);
	}
</script>

<form id="userinfo" class="grid w-full items-center gap-4" on:submit|preventDefault={handleSubmit}>
	<div class="flex flex-col space-y-3">
		<Label aria-required for="confirmation">
			Confirm deletion by writing out
			<span class="select-none font-bold">
				"{phrase}"
			</span>
		</Label>
		<Input required id="confirmation" bind:value={$InputPhrase} disabled={$Working} />
	</div>
</form>

<div class="mt-3 flex justify-between gap-3">
	<p class="star-note self-start text-xs text-muted-foreground">Required</p>
	<div class="flex gap-3">
		<Button variant="outline" type="reset" on:click={() => InputPhrase.set('')} disabled={$Working}>
			Reset
		</Button>
		<Button form="userinfo" type="submit" disabled={$MatchErr || $Working} variant="destructive">
			Continue
		</Button>
	</div>
</div>
