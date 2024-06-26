<script lang="ts">
	import UsersList from '$lib/components/users/UsersList.svelte';

	export let data;

	console.table(data.users);
</script>

<section>
	<UsersList users={data.users} />
</section>
