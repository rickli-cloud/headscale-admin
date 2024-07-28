<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { get, writable } from 'svelte/store';
	import Copy from 'lucide-svelte/icons/copy';

	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	import * as Form from '$lib/components/form';
	import { ApiKey } from '$lib/api';

	const NewKeyExp = writable<string | undefined>();
	const NewKeyResult = writable<{ key: string; exp: string } | undefined>();
	const disableSubmit = writable<boolean>(false);

	NewKeyResult.subscribe((d) => disableSubmit.set(!!d));

	const dispatch = createEventDispatcher();

	async function handleSubmit() {
		const exp = get(NewKeyExp);
		if (!exp) return void 0;

		const key = await ApiKey.create({ expiration: new Date(exp).toISOString() });
		if (key) NewKeyResult.set({ key, exp });
	}

	function handleReset() {
		NewKeyExp.set(undefined);
	}

	function handleFinish() {
		dispatch('submit');
		handleReset();
		NewKeyResult.set(undefined);
	}

	function copyResult() {
		const newKeyResult = get(NewKeyResult);
		if (newKeyResult) navigator.clipboard.writeText(newKeyResult.key);
	}
</script>

<Form.Root 
	description="create API key"
	action={handleSubmit}
	on:reset={handleReset} 
	on:cancel
	disableSubmit={$disableSubmit} 
	disableReload
	disableToast
	let:disabled 
>
	<Form.Item>
		<Label aria-required for="expiration">Expiration</Label>
		<Input
			required
			id="expiration"
			type="datetime-local"
			bind:value={$NewKeyExp}
			disabled={disabled || $disableSubmit}
		/>
	</Form.Item>
</Form.Root>

{#if $NewKeyResult}
	<hr class="spacer" />

	<Form.Root 
		description="create API key"
		action={handleFinish} 
		submitText="Finish"
		disableCancel
		disableReset
	>
		<div class="space-y-1">
			<h2 class="text-lg font-semibold text-foreground">Success!</h2>
			<p class="text-sm text-muted-foreground">
				Make sure to save this token somewhere safe. You will not be able to see this again
			</p>
		</div>

		<div
			class="scrolltrack-hidden relative flex h-11 overflow-x-scroll rounded bg-muted px-5 py-3 font-mono text-sm font-semibold"
		>
			<div>{$NewKeyResult.key}</div>
			<div
				class="fixed right-6 cursor-pointer rounded bg-muted px-2.5 hover:text-white"
				on:click={copyResult}
				on:keydown={copyResult}
				role="button"
				tabindex="0"
			>
				<Copy class="h-5 w-5" />
			</div>
		</div>

		<small class="text-sm font-medium leading-none" slot="note">
			Expires:
			<span class="font-bold">
				{new Date($NewKeyResult.exp).toLocaleString()}
			</span>
		</small>
	</Form.Root>
{/if}
