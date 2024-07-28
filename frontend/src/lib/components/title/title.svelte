<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';

	export let Title: string;
	export let Description: string | undefined = undefined;
</script>

<Card.Header
	class="grid items-center gap-3 space-y-0"
	style="grid-template-columns: 1fr auto;"
>
	<div class="space-y-1.5">
		<Card.Title>{Title}</Card.Title>
		{#if Description}
			<Card.Description>{Description}</Card.Description>
		{/if}
	</div>

	<div class="flex gap-2">
		<slot />
	</div>
</Card.Header>
