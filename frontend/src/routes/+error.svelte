<script>
	import { page } from '$app/stores';
</script>

<main class="container">
	<section>
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Critical error</h1>

		{#if $page.error instanceof Error}
			<p>
				<span class="font-semibold">
					{$page.error.name}:
				</span>
				{$page.error.message}
			</p>

			{#if $page.error.cause}
				<p>
					<span class="font-semibold">Cause:</span>
					{$page.error.cause}
				</p>
			{/if}

			<pre>
				<code>
{$page.error.stack}
				</code>
			</pre>
		{:else}
			<pre>
				<code>
{JSON.stringify($page.error, null, 2)}
				</code>
			</pre>
		{/if}
	</section>
</main>
