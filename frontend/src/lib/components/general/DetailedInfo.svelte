<script lang="ts">
	import { base } from '$app/paths';
	import { parseValue } from '$lib/utils/misc';

	export let text: string | undefined;
	export let detail: string | undefined;
	export let href: string | undefined = undefined;
</script>

{#if href}
	<a href="{base}/{href}" class="link whitespace-nowrap">
		{parseValue(text)}
		<span class="text-muted-foreground">
			{parseValue(detail)}
		</span>
	</a>
{:else}
	{parseValue(text)}
	<span class="ml-0.5 text-muted-foreground">
		{parseValue(detail)}
	</span>
{/if}
