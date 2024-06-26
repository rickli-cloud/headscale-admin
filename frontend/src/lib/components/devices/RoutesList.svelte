<script lang="ts">
	import { DotsHorizontal } from 'svelte-radix';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Sheet from '$lib/components/ui/sheet';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge';

	import { parseValue } from '$lib/utils/misc.js';
	import type { V1Route } from '$lib/api/api';
	import { base } from '$app/paths';
	import ConfirmDelete from '../general/ConfirmDelete.svelte';
	import { invalidateAll } from '$app/navigation';
	import { Route } from '$lib/api/utils';

	export let routes: V1Route[] | undefined;

	let editDialogOpen: boolean = false;
	let deleteDialogOpen: boolean = false;
</script>

<Card.Header>
	<Card.Title>Routes</Card.Title>
	<Card.Description>Advertise exit nodes or IP ranges for your clients.</Card.Description>
</Card.Header>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head class="w-[50px]"></Table.Head>
			<Table.Head>Prefix</Table.Head>
			<Table.Head>Device</Table.Head>
			<Table.Head>Created</Table.Head>
			<Table.Head>Updated</Table.Head>
			<Table.Head>State</Table.Head>
			<Table.Head class="w-[100px]">ID</Table.Head>
		</Table.Row>
	</Table.Header>

	<Table.Body>
		{#if routes}
			{#each routes as route}
				<Table.Row>
					<Table.Cell class="!p-0">
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

									<Sheet.Root bind:open={editDialogOpen}>
										<Sheet.Trigger
											class="{buttonVariants({
												variant: 'ghost'
											})} !block !h-8 w-full !px-2 !py-1.5 text-left !text-sm"
										>
											{route.enabled ? 'Disable' : 'Enable'}
										</Sheet.Trigger>

										<Sheet.Content>
											<Sheet.Header class="mb-3">
												<Sheet.Title>{route.enabled ? 'Disable' : 'Enable'} route</Sheet.Title>
												<Sheet.Description>
													{route.enabled ? 'Disable' : 'Enable'} a route for all your clients
												</Sheet.Description>
											</Sheet.Header>

											<Sheet.Footer>
												<Button variant="outline" on:click={() => (editDialogOpen = false)}>
													Cancel
												</Button>

												<Button
													type="submit"
													variant={route.enabled ? 'destructive' : 'default'}
													on:click={async () => {
														if (route.id) {
															await new Route(route)[route.enabled ? 'disable' : 'enable']();
														}
														editDialogOpen = false;
														invalidateAll();
													}}
												>
													Continue
												</Button>
											</Sheet.Footer>
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
												<Sheet.Title>Delete route</Sheet.Title>
												<Sheet.Description>
													This action cannot be undone. Routes cant be created using the API, only
													clients can advertise them.
												</Sheet.Description>
											</Sheet.Header>

											<ConfirmDelete
												phrase={`routes/${route.prefix || ''}`}
												onSubmit={async () => {
													if (route.id) await new Route(route).delete();
													deleteDialogOpen = false;
													invalidateAll();
												}}
											/>
										</Sheet.Content>
									</Sheet.Root>
								</DropdownMenu.Group>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</Table.Cell>

					<Table.Cell class="font-medium">
						{parseValue(route.prefix)}
					</Table.Cell>

					<Table.Cell>
						<a href="{base}/devices/{encodeURIComponent(route.machine?.id || '')}" class="link">
							{parseValue(route.machine?.name)}
							{#if route.machine?.id}
								<span class="text-muted-foreground">
									#{route.machine?.id}
								</span>
							{/if}
						</a>
					</Table.Cell>

					<Table.Cell>
						{parseValue(route.createdAt, (createdAt) => new Date(createdAt).toLocaleString())}
					</Table.Cell>

					<Table.Cell>
						{parseValue(route.updatedAt, (updatedAt) => new Date(updatedAt).toLocaleString())}
					</Table.Cell>

					<Table.Cell class="flex flex-wrap gap-1.5">
						{#if route.enabled}
							<Badge>Enabled</Badge>
						{:else}
							<Badge variant="destructive">Disabled</Badge>
						{/if}
						{#if route.deletedAt}
							<Badge variant="destructive">Deleted</Badge>
						{/if}
						{#if route.isPrimary}
							<Badge>Primary</Badge>
						{/if}
						{#if route.advertised}
							<Badge>Advertised</Badge>
						{/if}
					</Table.Cell>

					<Table.Cell>
						{parseValue(route.id)}
					</Table.Cell>
				</Table.Row>
			{/each}
		{/if}
	</Table.Body>
</Table.Root>
