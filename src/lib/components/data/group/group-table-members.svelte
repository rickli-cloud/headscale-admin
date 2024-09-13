<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';

	import type { User } from '$lib/api';

	export let usernames: string[];
	export let users: User[] | undefined = undefined;
</script>

{#each usernames as name}
	<Badge variant={!users || !!users.find((i) => i.name === name) ? 'default' : 'destructive'}>
		{name}
	</Badge>
{/each}
