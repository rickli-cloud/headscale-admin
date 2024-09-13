<script lang="ts">
	import { Dialog as SheetPrimitive } from 'bits-ui';
	import type { ComponentProps } from 'svelte';

	type $$Props = ComponentProps<SheetPrimitive.Root>;

	let open: boolean = false;

	function close(): void {
		open = false;
	}
</script>

<SheetPrimitive.Root bind:open {...$$restProps}>
	<slot {open} {close} />
</SheetPrimitive.Root>
