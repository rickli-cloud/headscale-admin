<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';

	export let Title: string;
	export let Description: string | undefined = undefined;

	export let children: number = 1;
</script>

<Card.Header
	class="grid items-center gap-2 space-y-0"
	style="grid-template-columns: 1fr repeat({children}, 50px);"
>
	<div class="space-y-1.5">
		<Card.Title>{Title}</Card.Title>
		{#if Description}
			<Card.Description>{Description}</Card.Description>
		{/if}
	</div>

	<slot />
</Card.Header>
