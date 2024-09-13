<script lang="ts">
	import { type HeaderCell, Subscribe } from 'svelte-headless-table';
	import { get } from 'svelte/store';

	import EyeNone from 'svelte-radix/EyeNone.svelte';
	import ArrowDown from 'svelte-radix/ArrowDown.svelte';
	import ArrowUp from 'svelte-radix/ArrowUp.svelte';
	import Cross1 from 'svelte-radix/Cross1.svelte';
	import ArrowUpDown from 'lucide-svelte/icons/arrow-up-down';

	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

	import type { createTablePlugins, RootProps } from '.';

	interface $$Props extends Partial<HTMLButtonElement> {
		model: RootProps['model'];
		cell: HeaderCell<any, ReturnType<typeof createTablePlugins>>;
		unHidable?: boolean;
	}

	export let cell: $$Props['cell'];
	export let model: $$Props['model'];
	export let unHidable: $$Props['unHidable'] = false;

	const { hiddenColumnIds } = model.pluginStates?.hide || {};

	function handleAscSort(e: Event) {
		const props = get(cell.props());

		if (props.sort.order === 'asc') return;
		if (props.sort.order === 'desc') {
			props.sort.toggle(e);
		}
		props.sort.toggle(e);
	}

	function handleDescSort(e: Event) {
		const props = get(cell.props());

		if (props.sort.order === 'desc') return;
		if (typeof props.sort.order === 'undefined') {
			props.sort.toggle(e);
		}
		props.sort.toggle(e);
	}

	function handleClearSort(e: Event) {
		const props = get(cell.props());

		if (typeof props.sort.order === 'undefined') return;
		if (props.sort.order === 'asc') {
			props.sort.toggle(e);
			props.sort.toggle(e);
			return;
		}
		if (props.sort.order === 'desc') {
			props.sort.toggle(e);
			return;
		}
	}

	function handleHide() {
		hiddenColumnIds.update((ids) => (ids.includes(cell.id) ? ids : [...ids, cell.id]));
	}
</script>

<Subscribe props={cell.props()} let:props>
	<DropdownMenu.Root>
		<DropdownMenu.Trigger asChild let:builder>
			<button
				class="-mx-4 flex h-full w-[calc(100%+32px)] items-center rounded-md px-4 hover:bg-accent"
				use:builder.action
				{...builder}
			>
				<slot />

				{#key props.sort.order}
					{#if props.sort.order === 'asc'}
						<ArrowUp class="ml-1 h-4 w-4 fill-foreground" />
					{:else if props.sort.order === 'desc'}
						<ArrowDown class="ml-1 h-4 w-4 fill-foreground" />
					{:else}
						<ArrowUpDown class="ml-1 h-4 w-4" />
					{/if}
				{/key}
			</button>
		</DropdownMenu.Trigger>

		<DropdownMenu.Content align="start">
			<DropdownMenu.Item on:click={handleAscSort} disabled={props.sort.order === 'asc'}>
				<ArrowUp class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
				Asc
			</DropdownMenu.Item>

			<DropdownMenu.Item on:click={handleDescSort} disabled={props.sort.order === 'desc'}>
				<ArrowDown class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
				Desc
			</DropdownMenu.Item>

			<DropdownMenu.Item on:click={handleClearSort} disabled={typeof props.sort.order === 'undefined'}>
				<Cross1 class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
				Clear
			</DropdownMenu.Item>

			<DropdownMenu.Separator />

			<DropdownMenu.Item on:click={handleHide} disabled={unHidable}>
				<EyeNone class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
				Hide
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</Subscribe>
