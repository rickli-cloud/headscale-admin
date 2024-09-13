<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';
	import type { Selected } from 'bits-ui';
	import { writable } from 'svelte/store';

	export let title: string;
	export let items: string[];
	export let selected: string[];
	export let invalidSelected: string[] | undefined = [];
	export let name = 'multiSelect';
	export let required = true;

	const sel = writable<Selected<string>[]>(selected?.map((value) => ({ value })) || []);
	sel.subscribe((state) => {
		if (!Array.isArray(state)) return;
		selected = state?.map((i) => i.value);
	});
</script>

<Select.Root portal={null} multiple bind:selected={$sel} {required}>
	<Select.Trigger>
		<Select.Value asChild>
			<span>
				{($sel.length || 0) + ' selected'}
			</span>
		</Select.Value>
	</Select.Trigger>

	<Select.Content>
		{#if Array.isArray(invalidSelected) && invalidSelected.length}
			<Select.Group>
				<Select.Label>Invalid {title}</Select.Label>
				{#each invalidSelected as item}
					<Select.Item value={item} label={item}>
						{item}
					</Select.Item>
				{/each}
			</Select.Group>
		{/if}

		{#if items}
			<Select.Group>
				<Select.Label>{title}</Select.Label>
				{#each items as item}
					<Select.Item value={item} label={item}>
						{item}
					</Select.Item>
				{/each}
			</Select.Group>
		{/if}
	</Select.Content>

	<Select.Input {name} id={name} />
</Select.Root>
