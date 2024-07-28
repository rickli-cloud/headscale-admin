<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';

	export let tags: Partial<{
		valid: string[];
		forced: string[];
		invalid: string[];
	}>;

	const tagRegex = /^tag:/;
	function parseTag(tag: string): string {
		return tagRegex.test(tag) ? tag.replace(tagRegex, '') : tag;
	}
</script>

<span class="flex flex-wrap gap-1.5">
	{#if tags?.valid}
		{#each tags.valid as tag}
			<Badge>{parseTag(tag)}</Badge>
		{/each}
	{/if}
	{#if tags?.forced}
		{#each tags.forced as tag}
			<Badge variant="secondary">{parseTag(tag)}</Badge>
		{/each}
	{/if}
	{#if tags?.invalid}
		{#each tags.invalid as tag}
			<Badge variant="destructive">{parseTag(tag)}</Badge>
		{/each}
	{/if}
</span>
