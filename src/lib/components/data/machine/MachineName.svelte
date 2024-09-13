<script lang="ts">
	import type { ClassValue } from 'clsx';

	interface $$Props extends Partial<HTMLSpanElement> {
		class?: ClassValue;
		name: string | undefined;
		givenName: string | undefined;
	}

	export let name: $$Props['name'];
	export let givenName: $$Props['givenName'];
</script>

<span {...$$restProps}>
	{name}

	<span class="text-muted-foreground">
		{givenName}
	</span>
</span>
