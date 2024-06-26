<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	
	import '../app.css';
	import Header from '$lib/components/site/Header.svelte';
</script>

<ModeWatcher />

<Header />

<main class="container">
	<slot />
</main>
