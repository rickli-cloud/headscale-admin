<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';

	import type { V1PreAuthKey } from '$lib/api/api';

	export let Key: V1PreAuthKey;
</script>

<span class="flex flex-wrap gap-1.5">
	{#if Key.expiration && 0 > new Date(Key.expiration).getTime() - Date.now()}
		<Badge variant="destructive">Expired</Badge>
	{/if}
	{#if Key.used}
		<Badge>Used</Badge>
	{/if}
	{#if Key.reusable}
		<Badge>Reusable</Badge>
	{/if}
	{#if Key.ephemeral}
		<Badge>Ephemeral</Badge>
	{/if}
</span>
