<script lang="ts">
	import type { ClassValue } from 'clsx';

	interface $$Props extends Partial<HTMLUListElement> {
		class?: ClassValue;
		items: Array<any> | undefined;
	}

	export let items: $$Props['items'];
</script>

<ul {...$$restProps}>
	{#each items || [] as item}
		<li>{item}</li>
	{/each}
</ul>
