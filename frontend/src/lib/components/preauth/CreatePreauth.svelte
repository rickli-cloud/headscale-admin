<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { get, writable } from 'svelte/store';

	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	import EditTags from '$lib/components/general/EditTags.svelte';
	import * as Form from '$lib/components/form';

	import { PreAuthKey } from '$lib/api';
	import type { V1CreatePreAuthKeyRequest } from '$lib/api/api';

	export let User: string | undefined;

	const NewKey = writable<V1CreatePreAuthKeyRequest>({ user: User });
	const NewKeyAclTags = writable<string[]>([]);

	const dispatch = createEventDispatcher();

	async function handleSubmit() {
		try {
			const key = get(NewKey);
			const tags = get(NewKeyAclTags);

			await PreAuthKey.create({
				user: User,
				...key,
				expiration: key.expiration && new Date(key.expiration).toISOString(),
				aclTags: [...tags]
			});

			handleReset();
			dispatch('submit');
		} catch (err) {
			throw err;
		}
	}

	function handleReset() {
		NewKey.set({ user: User });
		NewKeyAclTags.set([]);
	}
</script>

<Form.Root onSubmit={handleSubmit} onReset={handleReset} let:disabled>
	<Form.Item>
		<Label aria-required for="expiration">Expiration</Label>
		<Input
			id="expiration"
			type="datetime-local"
			bind:value={$NewKey.expiration}
			required
			{disabled}
		/>
	</Form.Item>

	<Form.Item>
		<EditTags bind:tags={$NewKeyAclTags} />
	</Form.Item>

	<div class="mt-2 flex items-center gap-3 px-2">
		<Checkbox
			id="reusable"
			bind:checked={$NewKey.reusable}
			aria-labelledby="reusable-label"
			{disabled}
		/>
		<Label
			id="reusable-label"
			for="reusable"
			class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
		>
			Reusable
		</Label>
	</div>

	<div class="flex items-center gap-3 px-2">
		<Checkbox
			id="ephemeral"
			bind:checked={$NewKey.ephemeral}
			aria-labelledby="ephemeral-label"
			{disabled}
		/>
		<Label
			id="ephemeral-label"
			for="ephemeral"
			class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
		>
			Ephemeral
		</Label>
	</div>
</Form.Root>
