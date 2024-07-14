<script lang="ts">
	import { createRender, createTable, type ReadOrWritable } from 'svelte-headless-table';
	import { Plus } from 'svelte-radix';

	import ConfirmDelete from '$lib/components/general/ConfirmDelete.svelte';
	import EditName from '$lib/components/general/EditName.svelte';
	import DateTime from '$lib/components/general/DateTime.svelte';
	import * as Title from '$lib/components/title';
	import * as Table from '$lib/components/table';
	import CreateUser from './CreateUser.svelte';

	import { base } from '$app/paths';
	import type { User } from '$lib/api';

	export let Users: ReadOrWritable<User[]>;

	const HeadlessTable = createTable(Users);
	const Columns = HeadlessTable.createColumns([
		HeadlessTable.column({
			accessor: (user) => user,
			header: '',
			cell: ({ value: user }) =>
				createRender(Table.Actions, {
					Actions: [
						{
							name: 'Show',
							type: 'href',
							href: base + '/users/' + user.name
						},
						{
							name: 'Edit',
							type: 'sheet',
							title: 'Edit user',
							description: 'Change the name of a user',
							component: createRender(EditName, {
								name: user.name,
								async onSubmit(username) {
									await user.rename(username);
								}
							})
						},
						{
							name: 'Delete',
							destructive: true,
							type: 'sheet',
							title: 'Delete user',
							description: 'This action can not be undone',
							component: createRender(ConfirmDelete, {
								phrase: user.name || '',
								async onSubmit() {
									await user.delete();
								}
							})
						}
					]
				})
		}),
		HeadlessTable.column({
			accessor: 'name',
			header: 'Name'
		}),
		HeadlessTable.column({
			accessor: 'createdAt',
			header: 'Created',
			cell: ({ value }) => createRender(DateTime, { timestamp: value })
		}),
		HeadlessTable.column({
			accessor: 'id',
			header: 'ID'
		})
	]);
</script>

<Title.Root Title="Users" Description="All users known to headscale">
	<Title.Action
		Title="Create new user"
		Description="You can always edit or delete this user later"
		let:close
	>
		<Plus slot="trigger" />
		<CreateUser on:submit={close} />
	</Title.Action>
</Title.Root>

<Table.Root {HeadlessTable} {Columns} Linkable={{ key: 'name', base: 'users' }} />
