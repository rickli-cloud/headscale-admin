<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { cn } from '$lib/utils/shadcn';
	import { routes } from '$lib/settings/routes';

	import HeadscaleLogo from './HeadscaleLogo.svelte';

	interface $$Props extends Partial<HTMLHeadingElement> {
		container?: boolean;
	}

	export let container: $$Props['container'] = true;
</script>

<header
	{...$$restProps}
	class={cn(
		'header sticky top-0 z-40 h-12 w-full border-b border-border/40 bg-background/95 shadow-md backdrop-blur supports-[backdrop-filter]:bg-background/60',
		$$restProps.class
	)}
>
	<div class="flex h-full max-w-screen-2xl items-center justify-between gap-8" class:px-8={!container} class:container>
		<div class="h-12 w-24 min-w-24">
			<HeadscaleLogo />
		</div>

		<nav class="flex h-full items-center gap-4">
			{#each routes as route}
				<a
					class="flex h-full items-center [&>svg]:text-foreground/60 [&>svg]:transition-colors"
					href={base + route.path}
					class:active={(route.regex || new RegExp(`^${base}${route.path}`)).test($page.url.pathname)}
				>
					<svelte:component this={route.icon} {...route.iconProps || {}} />
				</a>
			{/each}
		</nav>
	</div>
</header>

<style lang="postcss">
	header {
		& nav > a.active {
			@apply -mb-0.5 border-b-2 border-current;
		}

		& nav > a.active,
		& nav > a:hover {
			@apply [&>svg]:text-foreground/90;
		}
	}
</style>
