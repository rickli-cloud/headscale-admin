<script lang="ts">
	import { invalidateAll } from '$app/navigation';

	import Trash2 from 'lucide-svelte/icons/trash-2';
	import SquarePen from 'lucide-svelte/icons/square-pen';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Sheet from '$lib/components/ui/sheet';
	import { buttonVariants } from '$lib/components/ui/button/index.js';

	import ConfirmDelete from '$lib/components/general/ConfirmDelete.svelte';
	import EditName from '$lib/components/general/EditName.svelte';
	import { parseValue } from '$lib/utils/misc';
	import { User } from '$lib/api/utils';
	import type { V1User } from '$lib/api/api';
	import { base } from '$app/paths';

	export let user: V1User | undefined;
</script>

<Card.Header class="grid items-center space-y-0" style="grid-template-columns: 1fr 104px;">
	<div class="space-y-1.5">
		<Card.Title>User metadata</Card.Title>
		<Card.Description>The metadata of a headscale user</Card.Description>
	</div>

	<div class="flex gap-1">
		<Sheet.Root>
			<Sheet.Trigger
				class="{buttonVariants({
					variant: 'ghost'
				})} !h-[50px] !w-[50px]"
			>
				<SquarePen />
			</Sheet.Trigger>

			<Sheet.Content>
				<Sheet.Header class="mb-3">
					<Sheet.Title>Edit user</Sheet.Title>
					<Sheet.Description>This action cannot be undone.</Sheet.Description>
				</Sheet.Header>

				<EditName
					name={user?.name}
					onSubmit={async (username) => {
						if (user?.name) {
							await new User(user).edit(username);
							invalidateAll();
						}
					}}
				/>
			</Sheet.Content>
		</Sheet.Root>

		<Sheet.Root>
			<Sheet.Trigger
				class="{buttonVariants({
					variant: 'ghost'
				})} !h-[50px] !w-[50px]"
			>
				<Trash2 class="text-red-600" />
			</Sheet.Trigger>

			<Sheet.Content>
				<Sheet.Header class="mb-3">
					<Sheet.Title>Delete user</Sheet.Title>
					<Sheet.Description>This action cannot be undone.</Sheet.Description>
				</Sheet.Header>

				<ConfirmDelete
					phrase={'users/' + user?.name || ''}
					onSubmit={async () => {
						if (user?.name) {
							await new User(user).delete();
							window.location.href = base + '/users';
							invalidateAll();
						}
					}}
				/>
			</Sheet.Content>
		</Sheet.Root>
	</div>
</Card.Header>

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
				{parseValue(user?.createdAt, (createdAt) => new Date(createdAt).toLocaleString())}
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
