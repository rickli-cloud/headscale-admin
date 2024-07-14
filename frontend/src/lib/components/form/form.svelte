<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { Button } from '$lib/components/ui/button/index.js';
	import { createEventDispatcher } from 'svelte';
	import { writable, type Writable } from 'svelte/store';

	export let onSubmit: () => void | Promise<void>;
	export let onReset: () => void = () => void 0;

	export let id: string = window.crypto.randomUUID();
	export let DisableRequiredNote: boolean = false;
	export let DisableSubmit: Writable<boolean> = writable(false);
	export let DisableReset: boolean = false;
	export let DisableReload: boolean = false;
	export let Destructive: boolean = false;
	export let SubmitText: string = 'Submit';

	const Disabled = writable<boolean>();
	const dispatch = createEventDispatcher();

	async function handleSubmit() {
		dispatch('submit');
		try {
			Disabled.set(true);
			await onSubmit();
			if (!DisableReload) await invalidateAll();
			onReset();
		} catch (err) {
			throw err;
		} finally {
			Disabled.set(false);
		}
	}

	function handleReset() {
		dispatch('reset');
		onReset();
	}
</script>

<form
	{id}
	on:submit|preventDefault={handleSubmit}
	on:reset|preventDefault={handleReset}
	class="grid w-full items-center gap-5"
>
	<slot disabled={$Disabled} {id} submit={handleSubmit} reset={handleReset} />

	<div class="mt-4 flex justify-between gap-3 first:mt-0">
		{#if !DisableRequiredNote}
			<p class="star-note self-start text-xs text-muted-foreground">Required</p>
		{:else}
			<div />
		{/if}
		<div class="flex gap-3">
			{#if !DisableReset}
				<Button variant="outline" type="reset" disabled={$Disabled}>Reset</Button>
			{/if}
			<Button
				type="submit"
				disabled={$Disabled || $DisableSubmit}
				variant={Destructive ? 'destructive' : 'default'}
			>
				{SubmitText}
			</Button>
		</div>
	</div>
</form>
