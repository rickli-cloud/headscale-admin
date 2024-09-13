<script lang="ts">
	import { BodyRow, Render, Subscribe } from 'svelte-headless-table';
	import { get } from 'svelte/store';

	import MixerHorizontal from 'svelte-radix/MixerHorizontal.svelte';
	import ChevronRight from 'svelte-radix/ChevronRight.svelte';
	import ChevronLeft from 'svelte-radix/ChevronLeft.svelte';
	import DoubleArrowRight from 'svelte-radix/DoubleArrowRight.svelte';
	import DoubleArrowLeft from 'svelte-radix/DoubleArrowLeft.svelte';
	import CircleAlert from 'lucide-svelte/icons/circle-alert';

	import * as Table from '$lib/components/ui/table';
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Select from '$lib/components/ui/select';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { buttonVariants, Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';

	import DataTableColumnHeader from './data-table-column-header.svelte';
	import type { createTablePlugins, RootProps } from './index';
	import DataTableAction from './data-table-action.svelte';
	import Code from '../general/Code.svelte';

	type $$Props = RootProps;

	export let model: $$Props['model'];
	export let headerSizes: $$Props['headerSizes'] = [];
	export let caption: $$Props['caption'] = undefined;
	export let description: $$Props['description'] = undefined;
	export let omitHeader: $$Props['omitHeader'] = undefined;
	export let unHidableCells: $$Props['unHidableCells'] = undefined;
	export let actions: $$Props['actions'] = undefined;

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates, rows, flatColumns } = model;

	const { hasNextPage, hasPreviousPage, pageIndex, pageCount, pageSize } = pluginStates.page || {};
	const { selectedDataIds } = pluginStates.select || {};
	const { hiddenColumnIds } = pluginStates.hide || {};
	const { filterValue } = pluginStates.filter || {};

	const rootUnHidableCells = ['select', 'name', ...(unHidableCells || [])];

	function handleHide(id: string) {
		hiddenColumnIds.update((ids: string[]) => {
			return ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id];
		});
	}

	function handleSelect(ids: number[]) {
		selectedDataIds.set(Object.fromEntries(ids.map((i) => [String(i), true])));
	}

	function handleRowClick(ev: Event, row: BodyRow<any, ReturnType<typeof createTablePlugins>>) {
		if (
			ev.target instanceof HTMLButtonElement ||
			ev.target instanceof SVGElement ||
			(ev.target instanceof HTMLDivElement && ev.target.parentElement instanceof HTMLButtonElement)
		) {
			ev.stopImmediatePropagation();
			return;
		}

		const id = row.isData() ? row.dataId : row.id;
		const ids = get(selectedDataIds);

		if (Object.keys(ids).length > 1 && !get(row.props()).select.selected) {
			selectedDataIds.update((i) => ({ ...i, [id]: true }));
		} else {
			selectedDataIds.set({ [id]: true });
		}
	}
</script>

<Table.Root {...$tableAttrs}>
	<Table.Caption>
		{#if caption || $$slots.caption}
			<div class="mb-6 space-y-1 text-left">
				<h4 class="scroll-m-20 text-xl font-semibold tracking-tight text-foreground">
					<slot name="caption" {caption}>
						{caption}
					</slot>
				</h4>

				{#if description || $$slots.description}
					<p class="text-muted-foreground">
						<slot name="description" {description}>
							{description}
						</slot>
					</p>
				{/if}
			</div>
		{/if}

		<div class="mb-5 grid w-full items-center gap-2.5" style="grid-template-columns: 1fr auto;">
			<div class="flex items-center gap-1.5">
				<Input class="w-full max-w-xs" placeholder="Filter..." type="text" bind:value={$filterValue} />
			</div>

			<div class="flex items-center gap-1.5">
				<slot name="actions" selected={Object.keys($selectedDataIds)} select={handleSelect} />

				{#each actions || [] as action}
					<DataTableAction
						title={action.title}
						description={action.description}
						destructive={action.destructive}
						variant={action.variant}
						href={action.href}
						disabled={typeof action.disabled === 'function' ? action.disabled(Object.keys($selectedDataIds)) : undefined}
						action={() => (typeof action.action === 'function' ? action.action(Object.keys($selectedDataIds)) : void 0)}
						let:close
					>
						<svelte:component this={action.icon} slot="trigger" {...action.iconProps || {}} />

						{#if action.component}
							<svelte:component
								this={action.component}
								{...typeof action.componentProps === 'function' ? action.componentProps(Object.keys($selectedDataIds)) : {}}
								on:submit={() => {
									close();
									selectedDataIds.set({});
								}}
							/>
						{/if}

						{#if typeof action.data === 'function'}
							<Code yaml={action.data(Object.keys($selectedDataIds))} />
						{/if}
					</DataTableAction>
				{/each}

				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild let:builder>
						<button class={buttonVariants({ variant: 'outline' })} use:builder.action {...builder}>
							<MixerHorizontal class="h-5 w-5" />
						</button>
					</DropdownMenu.Trigger>

					<DropdownMenu.Content>
						<DropdownMenu.Label>Columns</DropdownMenu.Label>
						<DropdownMenu.Separator />

						{#each flatColumns as col}
							{#if !col.plugins?.sort?.disable}
								<DropdownMenu.CheckboxItem
									on:click={() => handleHide(col.id)}
									checked={!$hiddenColumnIds.includes(col.id)}
									disabled={rootUnHidableCells.includes(col.id)}
								>
									{typeof col.header === 'string' && col.header.length ? col.header : col.id}
								</DropdownMenu.CheckboxItem>
							{/if}
						{/each}
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</div>
	</Table.Caption>

	{#if !omitHeader}
		<Table.Header>
			{#each $headerRows as headerRow}
				<Subscribe rowAttrs={headerRow.attrs()}>
					<Table.Row>
						{#each headerRow.cells as cell, index}
							<Subscribe attrs={cell.attrs()} props={cell.props()} let:attrs let:props>
								<Table.Head
									{...attrs}
									style={headerSizes?.[index] ? `width: ${headerSizes[index]};` : ''}
									class="[&:has([role=checkbox])]:w-8 [&:has([role=checkbox])]:pr-4 "
								>
									{#if props.sort?.disabled}
										<Render of={cell.render()} />
									{:else}
										{#key props}
											<DataTableColumnHeader {model} {cell} unHidable={rootUnHidableCells.includes(cell.id)}>
												<Render of={cell.render()} />
											</DataTableColumnHeader>
										{/key}
									{/if}
								</Table.Head>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Header>
	{/if}

	<Table.Body {...$tableBodyAttrs}>
		{#each $pageRows as row, index}
			<Sheet.Root let:open let:close>
				<Sheet.Trigger asChild let:builder>
					<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
						<tr
							class="cursor-pointer !border-t transition-colors first:!border-t-0 hover:bg-muted/50 data-[state=selected]:bg-muted/50"
							{...rowAttrs}
							{...builder}
							use:builder.action
							data-state={selectedDataIds && $selectedDataIds[row.id] && 'selected'}
						>
							{#each row.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs>
									<td
										class="p-4 align-middle [&:has([role=checkbox])]:pr-0"
										{...attrs}
										on:click={(ev) => handleRowClick(ev, row)}
									>
										<Render of={cell.render()} />
									</td>
								</Subscribe>
							{/each}
						</tr>
					</Subscribe>
				</Sheet.Trigger>

				<Sheet.Content>
					<slot {row} {index} {open} {close} />

					<!-- <Sheet.Header>
            <Sheet.Title>Are you sure absolutely sure?</Sheet.Title>
            <Sheet.Description>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </Sheet.Description>
          </Sheet.Header> -->
				</Sheet.Content>
			</Sheet.Root>
		{/each}
	</Table.Body>
</Table.Root>

{#key model.rows}
	{#if !get(model.rows).length}
		<div class="grid justify-center gap-1.5 pb-4 pt-8 text-center">
			<CircleAlert class="mx-auto h-5 w-5 text-muted-foreground" />
			<p class="text-sm font-semibold text-muted-foreground">No data available</p>
		</div>
	{:else}
		<div class="mt-3 flex items-center justify-between gap-4 whitespace-nowrap px-2">
			<div class="flex-1 text-sm text-muted-foreground">
				{Object.keys($selectedDataIds).length} of {$rows.length} row{$rows.length > 1 ? 's' : ''} selected
			</div>

			<div class="flex items-center space-x-2">
				<p class="text-sm font-medium">Rows per page</p>
				<Select.Root
					onSelectedChange={(selected) => pageSize.set(Number(selected?.value))}
					selected={{ value: $pageSize, label: String($pageSize) }}
				>
					<Select.Trigger class="h-8 w-[70px]">
						<Select.Value placeholder="Select page size" />
					</Select.Trigger>

					<Select.Content>
						<Select.Item value="10">10</Select.Item>
						<Select.Item value="20">20</Select.Item>
						<Select.Item value="30">30</Select.Item>
						<Select.Item value="40">40</Select.Item>
						<Select.Item value="50">50</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>

			<div class="text-sm font-medium">
				Page {$pageIndex + 1} of {$pageCount}
			</div>

			<div class="flex items-center space-x-2">
				<Button variant="outline" class="flex h-8 w-8 p-0" on:click={() => ($pageIndex = 0)} disabled={!$hasPreviousPage}>
					<span class="sr-only">Go to first page</span>
					<DoubleArrowLeft size={15} />
				</Button>
				<Button
					variant="outline"
					class="h-8 w-8 p-0"
					on:click={() => ($pageIndex = $pageIndex - 1)}
					disabled={!$hasPreviousPage}
				>
					<span class="sr-only">Go to previous page</span>
					<ChevronLeft size={15} />
				</Button>
				<Button variant="outline" class="h-8 w-8 p-0" disabled={!$hasNextPage} on:click={() => ($pageIndex = $pageIndex + 1)}>
					<span class="sr-only">Go to next page</span>
					<ChevronRight size={15} />
				</Button>
				<Button
					variant="outline"
					class="flex h-8 w-8 p-0"
					disabled={!$hasNextPage}
					on:click={() => ($pageIndex = Math.ceil($rows.length / $pageRows.length) - 1)}
				>
					<span class="sr-only">Go to last page</span>
					<DoubleArrowRight size={15} />
				</Button>
			</div>
		</div>
	{/if}
{/key}
