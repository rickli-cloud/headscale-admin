<script lang="ts">
	import Code from '$lib/components/general/Code.svelte';

	import { AclStore } from '$lib/store/acl';
</script>

<Code>{$AclStore.stringified}</Code>
