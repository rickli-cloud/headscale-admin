<script lang="ts">
	import { get, writable } from 'svelte/store';
	import { invalidateAll } from '$app/navigation';

	import { DotsHorizontal, Plus } from 'svelte-radix';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Sheet from '$lib/components/ui/sheet';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Badge } from '$lib/components/ui/badge';

	import Tags from '$lib/components/general/Tags.svelte';
	import { formatDuration } from '$lib/utils/time';
	import { parseValue } from '$lib/utils/misc';
	import type { V1CreatePreAuthKeyRequest, V1PreAuthKey } from '$lib/api/api';
	import { PreAuthKey } from '$lib/api/utils';

	export let preAuthKeys: V1PreAuthKey[] | undefined;
	export let creatable: boolean = false;
	export let user: string | undefined = undefined;

	const NewKey = writable<V1CreatePreAuthKeyRequest>({ user });
	const NewKeyAclTags = writable<string[]>([]);
	const Working = writable<boolean>(false);
	let actionsDialogOpen: boolean = false;
	let expireDialogOpen: boolean = false;
	let tagsEditor: Tags;

	async function handleSubmit() {
		try {
			Working.set(true);
			const key = get(NewKey);
			const tags = get(NewKeyAclTags);

			await new PreAuthKey({
				user,
				...key,
				expiration: key.expiration && new Date(key.expiration).toISOString(),
				aclTags: tags
			}).save();

			invalidateAll();
		} catch (err) {
			Working.set(false);
			throw err;
		}
	}

	function handleReset() {
		NewKey.set({ user });
		NewKeyAclTags.set([]);
		tagsEditor?.reset();
	}
</script>

<Card.Header class="grid items-center space-y-0" style="grid-template-columns: 1fr 50px;">
	<div class="space-y-1.5">
		<Card.Title>Preauth keys</Card.Title>
		<Card.Description>Connect headless devices directly to your network.</Card.Description>
	</div>

	<div>
		{#if creatable}
			<Sheet.Root bind:open={actionsDialogOpen}>
				<Sheet.Trigger
					class="{buttonVariants({
						variant: 'ghost'
					})} !h-[50px] !w-[50px]"
				>
					<Plus />
				</Sheet.Trigger>

				<Sheet.Content>
					<Sheet.Header class="mb-3">
						<Sheet.Title>Create new preauth key</Sheet.Title>
						<Sheet.Description>Keys can only be expired not deleted.</Sheet.Description>
					</Sheet.Header>

					<form
						id="userinfo"
						class="grid w-full items-center gap-4"
						on:submit|preventDefault={handleSubmit}
					>
						<div class="flex flex-col space-y-2">
							<Label aria-required for="expiration">Expiration</Label>
							<Input
								required
								id="expiration"
								bind:value={$NewKey.expiration}
								disabled={$Working}
								type="datetime-local"
							/>
						</div>

						<Tags bind:this={tagsEditor} tags={NewKeyAclTags} disabled={Working} editable title />

						<div class="flex items-center space-x-2 px-2">
							<Checkbox
								id="reusable"
								bind:checked={$NewKey.reusable}
								aria-labelledby="reusable-label"
								disabled={$Working}
							/>
							<Label
								id="reusable-label"
								for="reusable"
								class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>
								Reusable
							</Label>
						</div>

						<div class="flex items-center space-x-2 px-2">
							<Checkbox
								id="ephemeral"
								bind:checked={$NewKey.ephemeral}
								aria-labelledby="ephemeral-label"
								disabled={$Working}
							/>
							<Label
								id="ephemeral-label"
								for="ephemeral"
								class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>
								Ephemeral
							</Label>
						</div>
					</form>

					<div class="mt-4 flex justify-between gap-3">
						<p class="star-note self-start text-xs text-muted-foreground">Required</p>
						<div class="flex gap-3">
							<Button variant="outline" on:click={handleReset} disabled={$Working}>Reset</Button>
							<Button form="userinfo" type="submit" disabled={$Working}>Continue</Button>
						</div>
					</div>
				</Sheet.Content>
			</Sheet.Root>
		{/if}
	</div>
</Card.Header>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head class="w-[50px]"></Table.Head>
			<Table.Head>Key</Table.Head>
			<Table.Head>Created</Table.Head>
			<Table.Head>Expires</Table.Head>
			<Table.Head>State</Table.Head>
			<Table.Head class="w-[100px]">ID</Table.Head>
		</Table.Row>
	</Table.Header>

	<Table.Body>
		{#if preAuthKeys}
			{#each preAuthKeys as key, i (i)}
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

									<Sheet.Root bind:open={expireDialogOpen}>
										<Sheet.Trigger
											class="{buttonVariants({
												variant: 'ghost'
											})} !block !h-8 w-full !px-2 !py-1.5 text-left !text-sm text-red-600"
											disabled={new Date(key.expiration || '').getTime() - Date.now() < 0}
										>
											Expire
										</Sheet.Trigger>

										<Sheet.Content>
											<Sheet.Header class="mb-3">
												<Sheet.Title>Expire preauth key</Sheet.Title>
												<Sheet.Description>
													This makes the key unusable. This action cannot be undone.
												</Sheet.Description>
											</Sheet.Header>

											<Sheet.Footer>
												<Button variant="outline" on:click={() => (expireDialogOpen = false)}>
													Cancel
												</Button>

												<Button
													type="submit"
													variant="destructive"
													on:click={async () => {
														if (key?.key) await new PreAuthKey(key).expire(key.key);
														expireDialogOpen = false;
														invalidateAll();
													}}
												>
													Continue
												</Button>
											</Sheet.Footer>
										</Sheet.Content>
									</Sheet.Root>
								</DropdownMenu.Group>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</Table.Cell>

					<Table.Cell class="font-semibold">
						{parseValue(key.key)}
					</Table.Cell>

					<Table.Cell>
						{parseValue(key.createdAt, (createdAt) => new Date(createdAt).toLocaleString())}
					</Table.Cell>

					<Table.Cell>
						{parseValue(key.expiration, (expiration) =>
							new Date(expiration).getTime() - Date.now() > 0
								? formatDuration(new Date(expiration).getTime() - Date.now())
								: new Date(expiration).toLocaleString()
						)}
					</Table.Cell>

					<Table.Cell class="flex flex-wrap gap-1.5">
						{#if key.expiration && 0 > new Date(key.expiration).getTime() - Date.now()}
							<Badge variant="destructive">Expired</Badge>
						{/if}
						{#if key.used}
							<Badge>Used</Badge>
						{/if}
						{#if key.reusable}
							<Badge>Reusable</Badge>
						{/if}
						{#if key.ephemeral}
							<Badge>Ephemeral</Badge>
						{/if}
					</Table.Cell>

					<Table.Cell>
						{parseValue(key.id)}
					</Table.Cell>
				</Table.Row>
			{/each}
		{/if}
	</Table.Body>
</Table.Root>
