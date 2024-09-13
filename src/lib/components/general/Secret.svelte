<script lang="ts">
	import { writable } from 'svelte/store';

	import Eye from 'lucide-svelte/icons/eye';
	import EyeOff from 'lucide-svelte/icons/eye-off';

	export let secret: string | undefined;

	const visible = writable<boolean>(false);
</script>

{#if secret}
	<span class="flex items-center gap-2">
		<button on:click={() => visible.set(!$visible)}>
			{#if $visible}
				<EyeOff class="!h-4 w-4" />
			{:else}
				<Eye class="!h-4 w-4" />
			{/if}
		</button>

		{#if $visible}
			{secret}
		{:else}
			<span style="font-size: 1.125rem; line-height: 10px; padding-top: 6px;">
				{secret?.replaceAll(/./g, '*')}
			</span>
		{/if}
	</span>
{:else}
	Unknown
{/if}
