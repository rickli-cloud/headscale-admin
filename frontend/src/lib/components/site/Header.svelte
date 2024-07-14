<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/stores';

	import Cog from 'lucide-svelte/icons/cog';

	import HeadscaleLogo from './HeadscaleLogo.svelte';

	export let position: 'sticky' | 'fixed' = 'sticky';
	export let disableContainer: boolean = false;
	export let disableNav: boolean = false;
</script>

<header
	class="header top-0 z-40 h-12 w-full border-b border-border/40 bg-background/95 shadow-md backdrop-blur supports-[backdrop-filter]:bg-background/60"
	class:sticky={position === 'sticky'}
	class:fixed={position === 'fixed'}
>
	<div
		class="flex h-full max-w-screen-2xl items-center justify-between gap-8"
		class:container={!disableContainer}
		class:max-w-screen-2xl={!disableContainer}
		class:px-8={disableContainer}
	>
		<nav class="flex flex-nowrap items-center gap-6 text-sm">
			<a
				href={base}
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
				</slot>
			{/if}
		</nav>

		<div class="flex items-center gap-4">
			<slot />

			<a href="{base}/settings">
				<Cog
					class="h-6 w-6 {new RegExp('^' + base + '/devices', 'i').test($page.url.pathname)
						? 'text-foreground'
						: ''}"
				/>
			</a>
		</div>
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
