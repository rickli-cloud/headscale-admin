<script lang="ts">
	import Header from '$lib/components/site/Header.svelte';

	import ApiErrors from '$lib/components/general/ApiErrors.svelte';

	export let data;
</script>

<Header />

<main class="container">
	<ApiErrors errors={data.errors} />

	<slot />
</main>
