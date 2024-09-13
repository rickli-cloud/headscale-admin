<script lang="ts">
	import type { HTMLTableAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/shadcn.js';

	type $$Props = HTMLTableAttributes;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<table class={cn('w-full text-sm', className)} {...$$restProps}>
	<slot />
</table>
