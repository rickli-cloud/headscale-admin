<script lang="ts">
	import type { V1User } from '$lib/api';
	import DateTime from '$lib/components/general/DateTime.svelte';
	import * as HoverCard from '$lib/components/ui/hover-card';

	export let user: V1User | undefined;
</script>

<HoverCard.Root>
	<HoverCard.Trigger class="underline-offset-4 hover:underline">
		{user?.name}
		{#if user?.id}<span class="text-muted-foreground">#{user.id}</span>{/if}
	</HoverCard.Trigger>

	<HoverCard.Content class="w-96 whitespace-nowrap">
		<div class="flex items-center justify-between gap-1">
			<span class="text-lg font-semibold">
				{user?.name}
			</span>
			{#if user?.id}
				<span class="text-muted-foreground">
					#{user.id}
				</span>
			{/if}
		</div>

		<div class="mt-1 flex items-center justify-between gap-2 text-muted-foreground">
			<div>Created:</div>
			<div>
				<DateTime timestamp={user?.createdAt} />
			</div>
		</div>
	</HoverCard.Content>
</HoverCard.Root>
