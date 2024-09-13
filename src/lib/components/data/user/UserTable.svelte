<script lang="ts">
	import { createRender, createTable } from 'svelte-headless-table';
	import { get, type Writable } from 'svelte/store';

	import { Plus, Trash } from 'svelte-radix';

	import { invalidateAll } from '$app/navigation';

	import * as DataTable from '$lib/components/dataTable';
	import DateTime from '$lib/components/general/DateTime.svelte';
	import Code from '$lib/components/general/Code.svelte';

	import type { User } from '$lib/api';

	import CreateUserForm from './CreateUserForm.svelte';

	export let users: Writable<User[]>;

	const table = createTable(users, DataTable.createTablePlugins());

	const model = table.createViewModel(
		table.createColumns([
			DataTable.createSelectColumn(table),
			table.column({
				accessor: 'name',
				header: 'Name'
			}),
			table.column({
				accessor: 'createdAt',
				header: 'Created',
				cell: ({ value }) => createRender(DateTime, { timestamp: value }),
				plugins: {
					filter: { exclude: true },
					sort: { getSortValue: (val) => new Date(val).getTime() }
				}
			}),
			table.column({
				accessor: 'id',
				header: 'ID',
				plugins: {}
			})
		]),
		{
			rowDataId: (row, index) => row.id ?? String(index)
		}
	);

	const actions = [
		DataTable.createAction({
			title: 'Create user',
			icon: Plus,
			component: CreateUserForm
		}),
		DataTable.createAction({
			title: 'Delete users',
			variant: 'alert-dialog',
			destructive: true,
			icon: Trash,
			disabled: (ids) => !ids.length,
			data: getSelectedUsers,
			action: handleDelete
		})
	];

	function getSelectedUsers(ids: string[]) {
		return get(users).filter((u) => u.id && ids.includes(u.id));
	}

	async function handleDelete(ids: string[]) {
		for (const usr of getSelectedUsers(ids)) await usr.delete(undefined, { throw: true });
		await invalidateAll();
	}
</script>

<DataTable.Root
	unHidableCells={['name']}
	{model}
	{actions}
	caption="Users"
	description="Users can own multiple devices"
	let:row
>
	<Code yaml={$users?.[Number(row.id)]} />
</DataTable.Root>
