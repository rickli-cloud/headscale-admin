<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import EditName from '$lib/components/general/EditName.svelte';

	import { User } from '$lib/api';

	const dispatch = createEventDispatcher();
</script>

<EditName
	description="create user"
	onSubmit={async (name) => {
		await User.create(name);
		dispatch('submit');
	}}
	on:cancel
/>
