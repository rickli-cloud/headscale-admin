<script lang="ts">
	import { parseValue } from '$lib/utils/misc';

	export let items: ArrayLike<any> | undefined;
</script>

<ul class="list-disc">
	{#if items}
		{#each items as item}
			<li>
				{parseValue(item)}
			</li>
		{/each}
	{/if}
</ul>
