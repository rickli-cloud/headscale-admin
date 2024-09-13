<script lang="ts">
	import { tick } from 'svelte';

	import * as Select from '$lib/components/ui/select/index.js';

	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import Check from 'lucide-svelte/icons/check';

	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils/shadcn';

	import { User } from '$lib/api';
	import type { Selected } from 'bits-ui';
	import { writable } from 'svelte/store';

	export let users: User[] | undefined = undefined;
	export let selected: string[];
	export let required: boolean | undefined = undefined;
	export let multiple: boolean | undefined = false;

	const sel = writable<Selected<User[]>[]>([]);
	sel.subscribe((state) => {
		// @ts-expect-error
		selected = state?.map((i) => i?.value);
	});

	if (!users) {
		User.list().then(({ data }) => (users = data));
	}

	// // We want to refocus the trigger button when the user selects
	// // an item from the list so users can continue navigating the
	// // rest of the form with the keyboard.
	// function closeAndFocusTrigger(triggerId: string) {
	// 	open = false;
	// 	tick().then(() => {
	// 		document.getElementById(triggerId)?.focus();
	// 	});
	// }
</script>

<Select.Root {multiple} bind:selected={$sel} {required}>
	<Select.Trigger>
		<Select.Value asChild>
			<span>
				{#if multiple}
					{($sel.length || 0) + ' selected'}
				{:else}
					Select
				{/if}
			</span>
		</Select.Value>
	</Select.Trigger>

	<Select.Content>
		<!-- {#if Array.isArray(invalidSelected) && invalidSelected.length}
			<Select.Group>
				<Select.Label>Invalid {title}</Select.Label>
				{#each invalidSelected as item}
					<Select.Item value={item} label={item}>
						{item}
					</Select.Item>
				{/each}
			</Select.Group>
		{/if} -->

		{#if users}
			<Select.Group>
				<Select.Label>Users</Select.Label>
				{#each users as user}
					<Select.Item value={user.name} label={user.name}>
						{user.name}
						<span class="ml-auto px-1 text-muted-foreground">#{user.id}</span>
					</Select.Item>
				{/each}
			</Select.Group>
		{/if}

		<slot {users} />
	</Select.Content>

	<Select.Input name="select-user" id="select-user" />
</Select.Root>

<!-- <Popover.Root bind:open let:ids>
	<Popover.Trigger asChild let:builder>
		<Button builders={[builder]} variant="outline" role="combobox" aria-expanded={open} class="w-full justify-between" {id}>
			{#if selected?.name}
				<span>
					{selected.name}
					<span class="text-muted-foreground">
						#{selected.id}
					</span>
				</span>
			{:else}
				Select
			{/if}
			<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
		</Button>
	</Popover.Trigger>

	<Popover.Content class="w-[calc(100%-49px)] p-0">
		<Command.Root>
			<Command.Input placeholder="Search..." />

			<Command.Empty>No users found</Command.Empty>

			<Command.Group>
				{#if users}
					{#each users as user}
						<Command.Item
							value={user.name}
							onSelect={() => {
								selected = user;
								closeAndFocusTrigger(ids.trigger);
							}}
						>
							<Check class={cn('mr-2 h-4 w-4', selected?.name !== user.name && 'text-transparent')} />
							{user.name}
							<span class="ml-1 text-muted-foreground">
								#{user.id}
							</span>
						</Command.Item>
					{/each}
				{/if}
			</Command.Group>
		</Command.Root>
	</Popover.Content>
</Popover.Root> -->
