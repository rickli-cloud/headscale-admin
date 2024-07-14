<script lang="ts">
	import { parseValue } from '$lib/utils/misc';
	import { formatDuration, isExpired } from '$lib/utils/time';

	export let timestamp: string | undefined;
	export let isExpiry: boolean = false;

	function format(t: string) {
		return new Date(t).toLocaleString();
	}

	function formatExpiry(t: string) {
		const timeLeft = new Date(t).getTime() - Date.now();
		return timeLeft > 0 ? formatDuration(timeLeft) : new Date(t).toLocaleString();
	}
</script>

{#if isExpiry && timestamp === '0001-01-01T00:00:00Z'}
	Never
{:else if isExpiry}
	{parseValue(timestamp, formatExpiry)}
{:else}
	{parseValue(timestamp, format)}
{/if}
