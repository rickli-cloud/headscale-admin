<script lang="ts">
	import Trash2 from 'lucide-svelte/icons/trash-2';
	import SquarePen from 'lucide-svelte/icons/square-pen';

	import * as Table from '$lib/components/ui/table/index.js';

	import ConfirmDelete from '$lib/components/general/ConfirmDelete.svelte';
	import EditName from '$lib/components/general/EditName.svelte';
	import DateTime from '$lib/components/general/DateTime.svelte';
	import * as Title from '$lib/components/title';

	import { base } from '$app/paths';
	import { parseValue } from '$lib/utils/misc';
	import type { User } from '$lib/api';

	export let user: User | undefined;
</script>

<Title.Root children={2} Title="User metadata" Description="The metadata of a headscale user">
	<Title.Action Title="Edit user" Description="This action cannot be undone" let:close>
		<SquarePen slot="trigger" />
		<EditName
			name={user?.name}
			onSubmit={async (username) => {
				if (user?.name) {
					await user.rename(username);
					close();
					window.location.href = base + '/users/' + username;
				}
			}}
		/>
	</Title.Action>

	<Title.Action Title="Delete user" Description="This action cannot be undone" let:close>
		<Trash2 class="text-red-600" slot="trigger" />
		<ConfirmDelete
			phrase={user?.name || 'user'}
			onSubmit={async () => {
				if (user?.name) {
					await user.delete();
					close();
					window.location.href = base + '/users';
				}
			}}
		/>
	</Title.Action>
</Title.Root>

<Table.Root>
	<Table.Body>
		<Table.Row>
			<Table.Cell class="font-semibold">Name</Table.Cell>
			<Table.Cell>
				{parseValue(user?.name)}
			</Table.Cell>
		</Table.Row>

		<Table.Row>
			<Table.Cell class="font-semibold">Created</Table.Cell>
			<Table.Cell>
				<DateTime timestamp={user?.createdAt} />
			</Table.Cell>
		</Table.Row>

		<Table.Row>
			<Table.Cell class="font-semibold">ID</Table.Cell>
			<Table.Cell>
				{parseValue(user?.id)}
			</Table.Cell>
		</Table.Row>
	</Table.Body>
</Table.Root>
