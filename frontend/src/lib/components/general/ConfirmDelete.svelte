<script lang="ts">
	import { writable } from 'svelte/store';
	import { stringify } from "yaml"

	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	import * as Form from '$lib/components/form';
	import { createEventDispatcher } from 'svelte';

	export let data: any = undefined
	export let phrase: string | undefined = undefined;
	export let disableRequired: boolean = !phrase;
	export let disableReset: boolean = !phrase;
	export let description: string = "delete " + phrase
	export let onSubmit: () => void | Promise<void>;

	const InputPhrase = writable<string>('');
	const MatchErr = writable<boolean>(!!phrase);

	const dispatch = createEventDispatcher();

	InputPhrase.subscribe((input) => MatchErr.set(!!phrase && input !== phrase));

	async function handleSubmit() {
		await onSubmit();
		dispatch('submit');
	}
</script>

<Form.Root
	{description}
	action={handleSubmit}
	on:reset={() => InputPhrase.set('')}
	on:cancel
	submitText="Delete"
	disableSubmit={$MatchErr}
	{disableRequired}
	{disableReset}
	destructive
	let:disabled
>
	{#if typeof data !== "undefined"}
		<div class="overflow-x-scroll">
			<pre><code>{stringify(data)}</code></pre>
		</div>
	{/if}

	{#if typeof phrase === "string"}
		<Form.Item>
			<Label aria-required for="confirmation">
				Confirm by writing out
				<span class="select-none font-bold">
					"{phrase}"
				</span>
			</Label>
			<Input required id="confirmation" bind:value={$InputPhrase} {disabled} />
		</Form.Item>
	{/if}

	<slot {disabled} />
</Form.Root>
