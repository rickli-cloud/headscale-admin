<script lang="ts">
	import ApikeyList from '$lib/components/general/ApikeyList.svelte';

	export let data;

	console.table(data.apiKeys);
</script>

<section>
	<ApikeyList keys={data.apiKeys} />
</section>
