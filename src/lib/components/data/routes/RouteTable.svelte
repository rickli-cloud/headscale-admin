<script lang="ts">
	import { createTable, createRender } from 'svelte-headless-table';
	import type { Writable } from 'svelte/store';

	import * as DataTable from '$lib/components/dataTable';

	import type { Route } from '$lib/api';
	import DateTime from '$lib/components/general/DateTime.svelte';
	import RouteTableState from './route-table-state.svelte';

	export let routes: Writable<Route[]>;

	const table = createTable(
		routes,
		DataTable.createTablePlugins({
			hide: {
				initialHiddenColumnIds: ['deletedAt']
			}
		})
	);

	const model = table.createViewModel(
		table.createColumns([
			DataTable.createSelectColumn(table),
			table.column({
				id: 'prefix',
				accessor: 'prefix',
				header: 'Prefix'
			}),
			table.column({
				id: 'machine',
				accessor: 'machine',
				header: 'Machine',
				cell: ({ value }) => value?.name || ''
			}),
			table.column({
				id: 'createdAt',
				accessor: 'createdAt',
				header: 'Created',
				cell: ({ value }) => createRender(DateTime, { timestamp: value }),
				plugins: {
					filter: { exclude: true },
					sort: { getSortValue: (val) => new Date(val).getTime() }
				}
			}),
			table.column({
				id: 'deletedAt',
				accessor: 'deletedAt',
				header: 'Deleted',
				cell: ({ value }) => createRender(DateTime, { timestamp: value }),
				plugins: {
					filter: { exclude: true },
					sort: { getSortValue: (val) => new Date(val).getTime() }
				}
			}),
			table.column({
				id: 'updatedAt',
				accessor: 'updatedAt',
				header: 'Last updated',
				cell: ({ value }) => createRender(DateTime, { timestamp: value }),
				plugins: {
					filter: { exclude: true },
					sort: { getSortValue: (val) => new Date(val).getTime() }
				}
			}),
			table.column({
				id: 'state',
				accessor: (route) => route,
				header: 'State',
				cell: ({ value }) => createRender(RouteTableState, { route: value })
			}),
			table.column({
				id: 'id',
				accessor: 'id',
				header: 'ID'
			})
		]),
		{
			rowDataId: (row, index) => row.id || String(index)
		}
	);
</script>

<DataTable.Root
	{model}
	unHidableCells={['prefix']}
	caption="Routes"
	description="Advertise exit nodes or subnets for your clients"
></DataTable.Root>
