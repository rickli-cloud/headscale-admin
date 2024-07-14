<script lang="ts">
	import { Column, Render, Subscribe, type Table as TableType } from 'svelte-headless-table';

	import * as Table from '$lib/components/ui/table';

	import { base } from '$app/paths';

	export let HeadlessTable: TableType<any, any>;
	export let Columns: Column<any, any>[];

	export let Linkable: { base: string; key: string } | undefined = undefined;
	export let HasActions: boolean = true;
	export let ActionRows: number = 1;

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs } =
		HeadlessTable.createViewModel(Columns);

	const data = HeadlessTable.data;
</script>

<Table.Root {...$tableAttrs} class={(Linkable ? 'linkable ' : '') + (HasActions ? 'actions' : '')}>
	<Table.Header>
		{#each $headerRows as headerRow}
			<Subscribe rowAttrs={headerRow.attrs()}>
				<Table.Row>
					{#each headerRow.cells as cell, cellIndex (cell.id)}
						<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
							<Table.Head {...attrs} class={HasActions && cellIndex === 0 ? 'w-[50px]' : ''}>
								<Render of={cell.render()} />
							</Table.Head>
						</Subscribe>
					{/each}
				</Table.Row>
			</Subscribe>
		{/each}
	</Table.Header>

	<Table.Body {...$tableBodyAttrs}>
		{#each $pageRows as row, rowIndex (row.id)}
			<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
				<Table.Row {...rowAttrs}>
					{#each row.cells as cell, cellIndex (cell.id)}
						<Subscribe attrs={cell.attrs()} let:attrs>
							<Table.Cell {...attrs}>
								{#if Linkable && (!HasActions || cellIndex >= ActionRows)}
									<a href="{base}/{Linkable?.base}/{$data?.[rowIndex]?.[Linkable?.key] || ''}">
										<Render of={cell.render()} />
									</a>
								{:else}
									<Render of={cell.render()} />
								{/if}
							</Table.Cell>
						</Subscribe>
					{/each}
				</Table.Row>
			</Subscribe>
		{/each}
	</Table.Body>
</Table.Root>
