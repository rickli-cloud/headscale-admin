<!-- <script lang="ts">
	export let timestamp: string | undefined;
	export let placeholder: string = 'unknown';
</script>

{#if timestamp}
	{new Date(timestamp).toLocaleString()}
{:else}
	{placeholder}
{/if}
 -->

<script lang="ts">
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

{#if !timestamp}
	{''}
{:else if isExpiry}
	{#if timestamp === '0001-01-01T00:00:00Z'}
		Never
	{:else}
		{formatExpiry(timestamp)}
	{/if}
{:else}
	{format(timestamp)}
{/if}
