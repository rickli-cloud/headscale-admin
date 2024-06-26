<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { base } from '$app/paths';

	import { DotsHorizontal, Plus } from 'svelte-radix';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Sheet from '$lib/components/ui/sheet';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';

	import ConfirmDelete from '$lib/components/general/ConfirmDelete.svelte';
	import EditName from '$lib/components/general/EditName.svelte';
	import { parseValue } from '$lib/utils/misc';
	import { User } from '$lib/api/utils';
	import type { V1User } from '$lib/api/api';

	export let users: V1User[] | undefined;

	let createDialogOpen: boolean = false;
	let editDialogOpen: boolean = false;
	let deleteDialogOpen: boolean = false;
</script>

<Card.Header class="grid items-center space-y-0" style="grid-template-columns: 1fr 50px;">
	<div class="space-y-1.5">
		<Card.Title>Users</Card.Title>
		<Card.Description>All users known to headscale</Card.Description>
	</div>

	<div>
		<Sheet.Root bind:open={createDialogOpen}>
			<Sheet.Trigger
				class="{buttonVariants({
					variant: 'ghost'
				})} !h-[50px] !w-[50px]"
			>
				<Plus />
			</Sheet.Trigger>

			<Sheet.Content>
				<Sheet.Header class="mb-3">
					<Sheet.Title>Create new user</Sheet.Title>
					<Sheet.Description>You can always edit or delete this user later</Sheet.Description>
				</Sheet.Header>

				<EditName
					onSubmit={async (name) => {
						await new User({ name }).save();
						createDialogOpen = false;
						invalidateAll();
					}}
				/>
			</Sheet.Content>
		</Sheet.Root>
	</div>
</Card.Header>

<Table.Root class="linkable">
	<Table.Header>
		<Table.Row>
			<Table.Head class="w-[50px]"></Table.Head>
			<Table.Head>Username</Table.Head>
			<Table.Head>Created</Table.Head>
			<Table.Head class="w-[100px]">ID</Table.Head>
		</Table.Row>
	</Table.Header>

	<Table.Body>
		{#if users}
			{#each users as user, i (i)}
				<Table.Row>
					<Table.Cell>
						<DropdownMenu.Root>
							<DropdownMenu.Trigger asChild let:builder>
								<Button builders={[builder]} class=" h-[50px] w-full" variant="ghost">
									<DotsHorizontal />
								</Button>
							</DropdownMenu.Trigger>

							<DropdownMenu.Content side="right">
								<DropdownMenu.Group>
									<DropdownMenu.Label>Actions</DropdownMenu.Label>
									<DropdownMenu.Separator />

									<DropdownMenu.Item
										href="{base}/users/{encodeURIComponent(user.name || '')}"
										class="cursor-pointer"
									>
										Show
									</DropdownMenu.Item>

									<Sheet.Root bind:open={editDialogOpen}>
										<Sheet.Trigger
											class="{buttonVariants({
												variant: 'ghost'
											})} !block !h-8 w-full !px-2 !py-1.5 text-left !text-sm"
										>
											Edit
										</Sheet.Trigger>

										<Sheet.Content>
											<Sheet.Header class="mb-3">
												<Sheet.Title>Edit user</Sheet.Title>
												<Sheet.Description>This action cannot be undone</Sheet.Description>
											</Sheet.Header>

											<EditName
												name={user.name}
												onSubmit={async (username) => {
													if (user.name) {
														await new User(user).edit(username);
														editDialogOpen = false;
														invalidateAll();
													}
												}}
											/>
										</Sheet.Content>
									</Sheet.Root>

									<!-- <DropdownMenu.Item class="cursor-pointer !text-red-600">Delete</DropdownMenu.Item> -->
									<Sheet.Root bind:open={deleteDialogOpen}>
										<Sheet.Trigger
											class="{buttonVariants({
												variant: 'ghost'
											})} !block !h-8 w-full !px-2 !py-1.5 text-left !text-sm text-red-600"
										>
											Delete
										</Sheet.Trigger>

										<Sheet.Content>
											<Sheet.Header class="mb-3">
												<Sheet.Title>Delete user</Sheet.Title>
												<Sheet.Description>This action cannot be undone</Sheet.Description>
											</Sheet.Header>

											<ConfirmDelete
												phrase={'users/' + user.name || ''}
												onSubmit={async () => {
													if (user.name) {
														await new User(user).delete();
														deleteDialogOpen = false;
														invalidateAll();
													}
												}}
											/>
										</Sheet.Content>
									</Sheet.Root>
								</DropdownMenu.Group>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</Table.Cell>

					<Table.Cell class="font-medium">
						<a href="{base}/users/{encodeURIComponent(user.name || '')}">
							{parseValue(user.name)}
						</a>
					</Table.Cell>

					<Table.Cell>
						<a href="{base}/users/{encodeURIComponent(user.name || '')}">
							{parseValue(user.createdAt, (createdAt) => new Date(createdAt).toLocaleString())}
						</a>
					</Table.Cell>

					<Table.Cell>
						<a href="{base}/users/{encodeURIComponent(user.name || '')}">
							{parseValue(user.id)}
						</a>
					</Table.Cell>
				</Table.Row>
			{/each}
		{/if}
	</Table.Body>
</Table.Root>
