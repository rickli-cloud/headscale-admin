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
	<div
		class="flex h-full max-w-screen-2xl items-center justify-between gap-8"
		class:px-8={!container}
		class:container
	>
		<div class="h-12 w-24 min-w-24">
			<HeadscaleLogo />
		</div>

		<nav class=" flex items-center gap-4">
			{#each routes as route}
				<a
					href={base + route.path}
					class:[&_svg]:!text-foreground={(route.regex || new RegExp(`^${base}${route.path}`)).test(
						$page.url.pathname
					)}
				>
					<svelte:component this={route.icon} />
				</a>
			{/each}
			<!-- <a href="{base}/network">
				<Cog
					class="h-6 w-6 {new RegExp('^' + base + '/devices', 'i').test($page.url.pathname)
						? 'text-foreground'
						: ''}"
				/>
			</a>

			<a href="{base}/settings">
				<Cog
					class="h-6 w-6 {new RegExp('^' + base + '/devices', 'i').test($page.url.pathname)
						? 'text-foreground'
						: ''}"
				/>
			</a> -->
		</nav>

		<!-- <nav class="flex flex-nowrap items-center gap-6 text-sm">
			<a
				href={base + '/'}
				class="font-extrabold"
				class:!text-foreground={/^(#\/)?$/i.test(document.location.hash)}
			>
				<HeadscaleLogo />
			</a>

			{#if !disableNav}
				<slot name="nav">
					<a
						href={base + '/users'}
						class:!text-foreground={new RegExp('^' + base + '/users', 'i').test($page.url.pathname)}
					>
						Users
					</a>
					<a
						href={base + '/devices'}
						class:!text-foreground={new RegExp('^' + base + '/devices', 'i').test(
							$page.url.pathname
						)}
					>
						Devices
					</a>
					<a
						href={base + '/acl'}
						class="whitespace-nowrap"
						class:!text-foreground={new RegExp('^' + base + '/acl', 'i').test($page.url.pathname)}
					>
						Access control
					</a>
				</slot>
			{/if}
		</nav> -->

		<!-- <div class="flex items-center gap-4">
			<slot />

			<a href="{base}/settings">
				<Cog
					class="h-6 w-6 {new RegExp('^' + base + '/devices', 'i').test($page.url.pathname)
						? 'text-foreground'
						: ''}"
				/>
			</a>
		</div> -->
	</div>
</header>

<style scoped lang="postcss">
	header.header {
		& a,
		& svg {
			@apply text-foreground/60 transition-colors hover:text-foreground/90;
		}
	}
</style>
