<script lang="ts">
	import MachineTable from '$lib/components/data/machine/MachineTable.svelte';
	import Code from '$lib/components/general/Code.svelte';

	export let data;
</script>

<section>
	<MachineTable machines={data.machines} />
</section>

<section>
	<Code yaml={data} />
</section>
