<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import { buttonVariants } from '$lib/components/ui/button/index.js';

	export let Title: string;
	export let Description: string;

	let open: boolean;

	function close() {
		open = false;
	}
</script>

<Sheet.Root bind:open>
	<Sheet.Trigger
		class="{buttonVariants({
			variant: 'ghost'
		})} !h-[50px] !w-[50px]"
	>
		<slot name="trigger" />
	</Sheet.Trigger>

	<Sheet.Content>
		<Sheet.Header class="mb-6">
			<Sheet.Title>{Title}</Sheet.Title>
			<Sheet.Description class="!mt-0.5">{Description}</Sheet.Description>
		</Sheet.Header>
		<slot {close} />
	</Sheet.Content>
</Sheet.Root>
