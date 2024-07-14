<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	export let online: boolean | undefined;
	export let lastSeen: string | undefined;
</script>

<Tooltip.Root>
	<Tooltip.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			class=" h-[50px] w-[50px] cursor-default !bg-transparent"
			variant="ghost"
		>
			<div
				class="mx-auto h-3 w-3 rounded-full"
				class:bg-green-600={online}
				class:bg-red-600={!online}
			/>
		</Button>
	</Tooltip.Trigger>

	<Tooltip.Content side="right">
		<p>
			Last seen: {lastSeen ? new Date(lastSeen).toLocaleString() : 'unknown'}
		</p>
	</Tooltip.Content>
</Tooltip.Root>
