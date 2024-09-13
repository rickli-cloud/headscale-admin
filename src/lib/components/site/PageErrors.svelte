<script lang="ts">
	import ErrorComponent from '../general/ErrorComponent.svelte';

	export let errors: any[];
</script>

{#if errors.length}
	<section class="grid gap-y-2">
		{#each errors as err}
			<ErrorComponent {err} />
		{/each}
	</section>
{/if}
