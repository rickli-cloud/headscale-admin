<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';

	import type { V1Route } from '$lib/api';

	export let route: V1Route;
</script>

<span class="flex flex-wrap gap-1.5">
	{#if route.enabled}
		<Badge>Enabled</Badge>
	{:else}
		<Badge variant="destructive">Disabled</Badge>
	{/if}
	{#if route.deletedAt}
		<Badge variant="destructive">Deleted</Badge>
	{/if}
	{#if route.isPrimary}
		<Badge>Primary</Badge>
	{/if}
	{#if route.advertised}
		<Badge>Advertised</Badge>
	{/if}
</span>
