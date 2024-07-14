<script lang="ts">
	import Eye from 'lucide-svelte/icons/eye';
	import EyeOff from 'lucide-svelte/icons/eye-off';
	import { writable } from 'svelte/store';
	import Button from '../ui/button/button.svelte';

	export let key: string | undefined;

	const visible = writable<boolean>(false);
</script>

<span class="flex items-center gap-2">
	<Button on:click={() => visible.set(!$visible)} variant="minimal">
		{#if $visible}
			<EyeOff class="!h-4 w-4" />
		{:else}
			<Eye class="!h-4 w-4" />
		{/if}
	</Button>

	{#if $visible}
		{key}
	{:else}
		<span style="font-size: 1.125rem; line-height: 10px; padding-top: 6px;">
			{key?.replaceAll(/./g, '*')}
		</span>
	{/if}
</span>
