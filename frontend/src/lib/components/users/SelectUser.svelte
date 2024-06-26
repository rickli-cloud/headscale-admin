<script lang="ts">
	import { tick } from 'svelte';

	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { cn } from '$lib/utils.js';

	import type { V1User } from '$lib/api/api';
	import { User } from '$lib/api/utils';

	export let users: V1User[] | undefined = undefined;
	export let selected: V1User | undefined = undefined;

	let open = false;
	const id = window.crypto.randomUUID();

	if (!users) {
		User.list().then((u) => (users = u));
	}

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
</script>

<div class="flex flex-col space-y-2">
	<Label aria-required for={id}>User</Label>
	<Popover.Root bind:open let:ids>
		<Popover.Trigger asChild let:builder>
			<Button
				builders={[builder]}
				variant="outline"
				role="combobox"
				aria-expanded={open}
				class="w-full justify-between"
				{id}
			>
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

				<Command.Empty>No users found.</Command.Empty>

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
								<Check
									class={cn('mr-2 h-4 w-4', selected?.name !== user.name && 'text-transparent')}
								/>
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
	</Popover.Root>
</div>
