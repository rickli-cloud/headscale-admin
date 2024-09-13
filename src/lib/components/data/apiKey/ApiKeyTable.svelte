<script lang="ts">
	import type { ApiKey } from '$lib/api';
	import * as DataTable from '$lib/components/dataTable';
	import Code from '$lib/components/general/Code.svelte';
	import DateTime from '$lib/components/general/DateTime.svelte';
	import { createRender, createTable } from 'svelte-headless-table';
	import { Plus } from 'svelte-radix';
	import type { Writable } from 'svelte/store';
	import CreateApiKeyForm from './CreateApiKeyForm.svelte';

	export let apiKeys: Writable<ApiKey[]>;

	const table = createTable(
		apiKeys,
		DataTable.createTablePlugins({
			hide: {
				initialHiddenColumnIds: ['lastSeen']
			}
		})
	);

	const model = table.createViewModel(
		table.createColumns([
			DataTable.createSelectColumn(table),
			table.column({
				id: 'prefix',
				accessor: 'prefix',
				header: 'Key',
				cell: ({ value }) => String(value ? value + '...' : value)
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
				id: 'expiration',
				accessor: 'expiration',
				header: 'Expires',
				cell: ({ value }) => createRender(DateTime, { timestamp: value }),
				plugins: {
					filter: { exclude: true },
					sort: { getSortValue: (val) => new Date(val).getTime() }
				}
			}),
			table.column({
				id: 'lastSeen',
				accessor: 'lastSeen',
				header: 'Last seen',
				cell: ({ value }) => createRender(DateTime, { timestamp: value }),
				plugins: {
					filter: { exclude: true },
					sort: { getSortValue: (val) => new Date(val).getTime() }
				}
			}),
			table.column({
				id: 'id',
				accessor: 'id',
				header: 'ID'
			})
		]),
		{
			rowDataId: (item, index) => item.id ?? String(index)
		}
	);

	const actions = [
		DataTable.createAction({
			title: 'Create API key',
			icon: Plus,
			component: CreateApiKeyForm
		})
	];
</script>

<DataTable.Root {model} {actions} caption="API keys" description="Allows full access to the headscale REST API" let:row>
	<Code>{row.isData() ? row.dataId : row.id}</Code>
</DataTable.Root>
