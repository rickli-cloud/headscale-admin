<script lang="ts">
	import { createRender, createTable } from 'svelte-headless-table';
	import { get, type Writable } from 'svelte/store';

	import { Plus, Trash } from 'svelte-radix';

	import { invalidateAll } from '$app/navigation';

	import * as Sheet from '$lib/components/ui/sheet';

	import * as DataTable from '$lib/components/dataTable';
	import DateTime from '$lib/components/general/DateTime.svelte';

	import type { User } from '$lib/api';

	import CreateUserForm from './CreateUserForm.svelte';
	import ErrorComponent from '$lib/components/general/ErrorComponent.svelte';

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
			title: 'Delete users',
			variant: 'alert-dialog',
			destructive: true,
			icon: Trash,
			disabled: (ids) => !ids.length,
			data: getSelectedUsers,
			action: handleDelete
		}),
		DataTable.createAction({
			title: 'Create user',
			icon: Plus,
			component: CreateUserForm
		})
	];

	function getSelectedUsers(ids: string[]) {
		return get(users).filter((u) => u.id && ids.includes(u.id));
	}

	async function handleDelete(ids: string[]) {
		for (const usr of getSelectedUsers(ids)) {
			const { error } = await usr.delete();
			if (error) throw error;
		}

		await invalidateAll();
	}
</script>

<DataTable.Root
	unHidableCells={['name']}
	{model}
	{actions}
	caption="Users"
	description="Users can own multiple devices"
	let:index
>
	{#if $users?.[index]}
		<Sheet.Header>
			<Sheet.Title>User details</Sheet.Title>
			<Sheet.Description></Sheet.Description>
		</Sheet.Header>

		<table class="table">
			<tr>
				<th class="pr-6 text-left">ID</th>
				<td>{$users[index].id}</td>
			</tr>

			<tr>
				<th class="pr-6 text-left">Name</th>
				<td>{$users[index].name}</td>
			</tr>

			<tr>
				<th class="pr-6 text-left">Created</th>
				<td>{$users[index].createdAt ? new Date($users[index].createdAt).toLocaleString() : ''}</td>
			</tr>
		</table>
	{:else}
		<ErrorComponent err={new Error('User not found')} />
	{/if}
</DataTable.Root>
