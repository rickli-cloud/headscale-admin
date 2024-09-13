<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import ErrorComponent from '../general/ErrorComponent.svelte';

	export let title: string;
	export let description: string | undefined = undefined;
	export let variant: 'link' | 'sheet' | 'alert-dialog' = 'sheet';
	export let destructive: boolean = false;
	export let disabled: boolean = false;
	export let action: (() => void | Promise<void>) | undefined = undefined;
	export let href: string | undefined = undefined;

	async function handleAction() {
		try {
			if (action) await action();
		} catch (err) {
			console.error('Caught error:', err);
			toast(ErrorComponent, { class: '!border-destructive', componentProps: { err, toast: true } });
		}
	}
</script>

{#if variant === 'link'}
	<Button
		{href}
		{disabled}
		tabindex={0}
		variant={destructive ? 'destructiveOutline' : 'outline'}
		class="[&>svg]:h-5 [&>svg]:w-5"
	>
		<slot name="trigger" {open} {close} />
	</Button>
{:else if variant === 'sheet'}
	<Sheet.Root let:open let:close>
		<Sheet.Trigger asChild let:builder>
			<Button
				{disabled}
				tabindex={0}
				builders={[builder]}
				variant={destructive ? 'destructiveOutline' : 'outline'}
				class="[&>svg]:h-5 [&>svg]:w-5"
			>
				<slot name="trigger" {open} {close} />
			</Button>
		</Sheet.Trigger>

		<Sheet.Content>
			<Sheet.Header>
				<Sheet.Title>{title}</Sheet.Title>
				{#if description}
					<Sheet.Description>{description}</Sheet.Description>
				{/if}
			</Sheet.Header>

			<slot {open} {close} />
		</Sheet.Content>
	</Sheet.Root>
{:else if variant === 'alert-dialog'}
	<AlertDialog.Root>
		<AlertDialog.Trigger asChild let:builder>
			<Button
				tabindex={0}
				{disabled}
				builders={[builder]}
				variant={destructive ? 'destructiveOutline' : 'outline'}
				class="[&>svg]:h-5 [&>svg]:w-5"
			>
				<slot name="trigger" open={false} close={() => void 0} />
			</Button>
		</AlertDialog.Trigger>

		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>{title}</AlertDialog.Title>
				{#if description}
					<AlertDialog.Description>{description}</AlertDialog.Description>
				{/if}
			</AlertDialog.Header>

			<slot open={false} close={() => void 0} />

			<AlertDialog.Footer>
				<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
				<AlertDialog.Action
					on:click={handleAction}
					on:keydown={handleAction}
					class={buttonVariants({ variant: destructive ? 'destructive' : 'default' })}
				>
					Continue
				</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
{/if}
