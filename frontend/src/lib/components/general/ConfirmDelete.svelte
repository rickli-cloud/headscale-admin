<script lang="ts">
	import { writable } from 'svelte/store';

	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	import * as Form from '$lib/components/form';
	import { createEventDispatcher } from 'svelte';

	export let phrase: string;
	export let onSubmit: () => void | Promise<void>;

	const InputPhrase = writable<string>('');
	const MatchErr = writable<boolean>(true);

	const dispatch = createEventDispatcher();

	InputPhrase.subscribe((input) => MatchErr.set(input !== phrase));

	async function handleSubmit() {
		await onSubmit();
		dispatch('submit');
	}
</script>

<Form.Root
	onSubmit={handleSubmit}
	onReset={() => InputPhrase.set('')}
	let:disabled
	DisableSubmit={MatchErr}
	Destructive
	SubmitText="Delete"
>
	<Form.Item>
		<Label aria-required for="confirmation">
			Confirm by writing out
			<span class="select-none font-bold">
				"{phrase}"
			</span>
		</Label>
		<Input required id="confirmation" bind:value={$InputPhrase} {disabled} />
	</Form.Item>
</Form.Root>
