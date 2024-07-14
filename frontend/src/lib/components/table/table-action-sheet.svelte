<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import { buttonVariants } from '$lib/components/ui/button/index.js';

	export let Title: string;
	export let Description: string;
	export let Disabled: boolean = false;
	export let Destructive: boolean = false;

	let open: boolean;

	function getClasses() {
		let classes = '';
		classes += buttonVariants({ variant: 'ghost' });
		classes += Destructive ? ' text-red-600' : '';
		classes += ' !block !h-8 w-full !px-2 !py-1.5 text-left !text-sm';
		return classes;
	}

	function close() {
		open = false;
	}
</script>

<Sheet.Root bind:open>
	<Sheet.Trigger class={getClasses()} disabled={Disabled}>
		<slot name="trigger" />
	</Sheet.Trigger>

	<Sheet.Content>
		<Sheet.Header class="mb-6">
			<Sheet.Title>{Title}</Sheet.Title>
			<Sheet.Description class="!mt-0.5">{Description}</Sheet.Description>
		</Sheet.Header>

		<slot {open} {close} />
	</Sheet.Content>
</Sheet.Root>
