<script lang="ts">
	import { get, writable } from 'svelte/store';
	import { Cross2 } from 'svelte-radix';

	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';

	export let tags: string[];
	export let DisableTitle: boolean = false;
	// export let Tags: Writable<Set<string>>;

	const TagInput = writable<string | undefined>();
	const tagRegex = /^tag:/;
	const NewTags = writable(new Set<string>(...tags));
	NewTags.subscribe((data) => (tags = [...data].map((i) => (tagRegex.test(i) ? i : 'tag:' + i))));

	function handleAdd() {
		const tag = get(TagInput);
		if (tag) NewTags.update((tags) => tags.add(tag));
		TagInput.set(undefined);
	}

	function handleRemove(item: string) {
		NewTags.update((tags) => {
			tags.delete(item);
			return tags;
		});
	}
</script>

{#if !DisableTitle}
	<p class="text-sm font-medium">Tags</p>
{/if}

<form
	class="mb-3 mt-2 grid gap-2.5"
	style="grid-template-columns: 1fr 50px;"
	on:submit|preventDefault={handleAdd}
>
	<Input bind:value={$TagInput} />
	<Button type="submit">Add</Button>
</form>

{#if $NewTags.size}
	<div class="flex flex-wrap gap-1.5">
		{#each $NewTags as tag}
			<Badge>
				{tagRegex.test(tag) ? tag.replace(tagRegex, '') : tag}

				<Button variant="minimal" on:click={() => handleRemove(tag)}>
					<Cross2 class="ml-2 h-4 w-4" />
				</Button>
			</Badge>
		{/each}
	</div>
{/if}
