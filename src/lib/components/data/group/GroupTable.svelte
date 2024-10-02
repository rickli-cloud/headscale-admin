<script lang="ts">
	import { createRender, createTable } from 'svelte-headless-table';
	import { get, writable, type Writable } from 'svelte/store';

	import { Plus, Trash } from 'svelte-radix';

	import * as DataTable from '$lib/components/dataTable';

	import { groupRegex, type User } from '$lib/api';
	import { AclStore } from '$lib/store/acl';

	import CreateGroupForm from './CreateGroupForm.svelte';
	import GroupTableMembers from './group-table-members.svelte';
	import Code from '$lib/components/general/Code.svelte';

	export let users: Writable<User[]>;

	const groups = writable(formatGroups());
	AclStore.subscribe((state) => groups.set(formatGroups(state)));

	const table = createTable(groups, DataTable.createTablePlugins());

	const model = table.createViewModel(
		table.createColumns([
			DataTable.createSelectColumn(table),
			table.column({
				accessor: 'name',
				header: 'Name',
				cell: ({ value }) => value.replace(groupRegex, '')
			}),
			table.column({
				accessor: 'members',
				header: 'Members',
				cell: ({ value }) => createRender(GroupTableMembers, { usernames: value, users: get(users) })
			}),
			table.column({
				accessor: 'ownedTags',
				header: 'Owned tags'
			})
		]),
		{
			rowDataId: (row) => row.name
		}
	);

	const actions = [
		DataTable.createAction({
			title: 'Delete group',
			variant: 'alert-dialog',
			destructive: true,
			icon: Trash,
			disabled: (ids) => !ids.length,
			data: getSelectedGroups,
			action: handleDelete
		}),
		DataTable.createAction({
			title: 'Create group',
			icon: Plus,
			component: CreateGroupForm
		})
	];

	function formatGroups(acl = get(AclStore)) {
		const { groups, tagOwners } = acl;

		if (typeof groups !== 'object') return [];

		delete groups['$$comments'];
		delete tagOwners['$$comments'];

		return Object.entries(groups).map(([name, members]) => ({
			name,
			members,
			ownedTags: Object.entries(tagOwners)
				.filter(([_, owners]) => owners.includes(name))
				.map((i) => i[0])
		}));
	}

	function getSelectedGroups(names: string[]) {
		return get(groups).filter(({ name }) => names.includes(name));
	}

	async function handleDelete(names: string[]) {
		const acl = get(AclStore);
		try {
			for (const name of names) delete acl.groups[name];
			const { data, error } = await acl.update();
			if (error) throw error;
			if (data) AclStore.set(data);
		} catch (err) {
			AclStore.set(acl.reset());
		}
	}
</script>

<DataTable.Root {model} {actions} caption="Groups" description="Group users together and control tag ownership" let:index>
	<Code yaml={$groups[index]} />
</DataTable.Root>
