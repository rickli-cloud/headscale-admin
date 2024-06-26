<script lang="ts">
	import { get, writable, type Writable } from 'svelte/store';

	import { Cross2 } from 'svelte-radix';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';

	export let tags: Writable<string[]> | string[];
	export let title: boolean = false;
	export let editable: boolean = false;
	export let disabled: Writable<boolean> | undefined = undefined;
	export let onSubmit: ((tags: string[]) => void) | undefined = undefined;

	export function reset() {
		NewTag.set('');
	}

	const NewTags = 'set' in tags ? tags : writable<string[]>(tags);
	const NewTag = writable<string>('');
	const tagRegex = /^tag:/;

	if ('set' in tags) NewTags.subscribe(tags.set);

	function handleSubmit() {
		NewTags.update((t) => [...t, get(NewTag)]);
		NewTag.set('');
	}
</script>

{#if typeof onSubmit === 'function'}
	<form on:submit|preventDefault={() => onSubmit($NewTags)}>
		<div>
			{#if title}
				<p class="text-sm font-medium">Tags</p>
			{/if}

			{#if editable}
				<form
					class="mb-3 mt-2 grid w-full items-center gap-4"
					on:submit|preventDefault={handleSubmit}
				>
					<div class="grid gap-2.5" style="grid-template-columns: 1fr 50px;">
						<Input required id="name" bind:value={$NewTag} disabled={$disabled} />
						<Button type="submit" disabled={$disabled}>Add</Button>
					</div>
				</form>
			{/if}

			{#if $NewTags.length}
				<div class="flex flex-wrap gap-1.5">
					{#each $NewTags as tag}
						<Badge>
							{tagRegex.test(tag) ? tag.replace(tagRegex, '') : tag}
							{#if editable}
								<Button
									variant="minimal"
									on:click={() => NewTags.update((t) => t.filter((i) => i !== tag))}
									disabled={$disabled}
								>
									<Cross2 class="ml-2 h-4 w-4" />
								</Button>
							{/if}
						</Badge>
					{/each}
				</div>
			{/if}
		</div>

		<div class="mt-6 flex justify-between gap-3">
			<p class="star-note self-start text-xs text-muted-foreground">Required</p>
			<div class="flex gap-3">
				<Button variant="outline" on:click={() => NewTags.set([])} disabled={$disabled}>
					Reset
				</Button>
				<Button type="submit" disabled={$disabled}>Continue</Button>
			</div>
		</div>
	</form>
{:else}
	<div>
		{#if title}
			<p class="text-sm font-medium">Tags</p>
		{/if}

		{#if editable}
			<form
				class="mb-3 mt-2 grid w-full items-center gap-4"
				on:submit|preventDefault={handleSubmit}
			>
				<div class="grid gap-2.5" style="grid-template-columns: 1fr 50px;">
					<Input required id="name" bind:value={$NewTag} disabled={$disabled} />
					<Button type="submit" disabled={$disabled}>Add</Button>
				</div>
			</form>
		{/if}

		{#if $NewTags.length}
			<div class="flex flex-wrap gap-1.5">
				{#each $NewTags as tag}
					<Badge>
						{tagRegex.test(tag) ? tag.replace(tagRegex, '') : tag}
						{#if editable}
							<Button
								variant="minimal"
								on:click={() => NewTags.update((t) => t.filter((i) => i !== tag))}
								disabled={$disabled}
							>
								<Cross2 class="ml-2 h-4 w-4" />
							</Button>
						{/if}
					</Badge>
				{/each}
			</div>
		{/if}
	</div>
{/if}
