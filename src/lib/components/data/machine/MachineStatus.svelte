<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { Button } from '$lib/components/ui/button';

	export let online: boolean | undefined;
	export let lastSeen: string | undefined;
</script>

<Tooltip.Root>
	<Tooltip.Trigger asChild let:builder>
		<Button builders={[builder]} class="h-full w-full cursor-default !bg-transparent !p-0" variant="ghost">
			<div class="mx-auto h-3 w-3 rounded-full" class:bg-green-600={online} class:bg-red-600={!online} />
		</Button>
	</Tooltip.Trigger>

	<Tooltip.Content side="right">
		<p>
			Last seen: {lastSeen ? new Date(lastSeen).toLocaleString() : 'unknown'}
		</p>
	</Tooltip.Content>
</Tooltip.Root>
