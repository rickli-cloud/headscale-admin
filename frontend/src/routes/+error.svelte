<script>
	import { page } from '$app/stores';
</script>

<main class="container">
	<section>
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Critical error</h1>

		{#if $page.error instanceof Error}
			<p class="leading-7 [&:not(:first-child)]:mt-6">
				<span class="font-semibold">
					{$page.error.name}:
				</span>
				{$page.error.message}
			</p>

			<p class="leading-7 [&:not(:first-child)]:mt-6">
				<span class="font-semibold">Cause:</span>
				{$page.error.cause}
			</p>
		{:else}
			<p class="leading-7 [&:not(:first-child)]:mt-6">
				{JSON.stringify($page.error, null, 2)}
			</p>
		{/if}
	</section>
</main>
