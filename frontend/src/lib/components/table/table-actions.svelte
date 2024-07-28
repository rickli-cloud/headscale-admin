<script lang="ts">
	import { DotsHorizontal } from 'svelte-radix';
	import { ComponentRenderConfig } from 'svelte-headless-table';

	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button/index.js';

	import TableActionSheet from './table-action-sheet.svelte';

	import { invalidateAll } from '$app/navigation';
	import { base } from '$app/paths';

	interface BaseAction {
		name: string;
		destructive?: boolean;
		disabled?: boolean;
	}

	interface HrefAction extends BaseAction {
		type: 'href';
		href: string;
	}

	interface SheetAction extends BaseAction {
		type: 'sheet';
		title: string;
		description: string;
		component: ComponentRenderConfig<any>;
	}

	type Action = HrefAction | SheetAction;

	export let Actions: Action[];
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button builders={[builder]} class="h-[50px] w-full" variant="ghost">
			<DotsHorizontal />
		</Button>
	</DropdownMenu.Trigger>

	<DropdownMenu.Content side="right">
		<DropdownMenu.Group>
			<DropdownMenu.Label>Actions</DropdownMenu.Label>
			<DropdownMenu.Separator />

			{#each Actions as action}
				{#if action.type === 'sheet'}
					<TableActionSheet
						Title={action.title}
						Description={action.description}
						Destructive={action.destructive}
						let:close
						Disabled={action.disabled}
					>
						<svelte:fragment slot="trigger">
							{action.name}
						</svelte:fragment>

						<svelte:component
							this={action.component.component}
							{...action.component.props}
							on:submit={async () => {
								await invalidateAll();
								close();
								// window.location.reload();
							}}
							on:cancel={close}
						/>
					</TableActionSheet>
				{:else if action.type === 'href'}
					<DropdownMenu.Item
						href={base + action.href}
						class={action.destructive ? 'text-red-600' : ''}
						disabled={action.disabled}
					>
						{action.name}
					</DropdownMenu.Item>
				{/if}
			{/each}
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
