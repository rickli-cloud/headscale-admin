<script lang="ts">
	import { get, writable } from 'svelte/store';
	import { base } from '$app/paths';

	import CircleAlert from 'lucide-svelte/icons/circle-alert';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	import { type SessionData, initSession } from '$lib/store/session';
	import Title from '$lib/components/title/title.svelte';
	import HeadscaleLogo from '$lib/components/site/HeadscaleLogo.svelte';

	const FormData = writable<SessionData>({
		token: '',
		baseUrl: undefined
	});

	const FormError = writable<unknown | undefined>();

	function handleSubmit() {
		try {
			FormError.set(undefined);
			initSession(get(FormData));
			window.location.href = base;
		} catch (err) {
			FormError.set(err);
		}
	}
</script>

<section class="grid place-items-center">
	<div class="w-full max-w-lg">
		<Title Title="Login" Description="Authentication required">
			<div class="ml-2">
				<HeadscaleLogo height={50} width={100} />
			</div>
		</Title>

		<Card.Content>
			{#if $FormError}
				<div class="mb-6">
					<Alert.Root variant="destructive" class="mb-4">
						<CircleAlert class="h-4 w-4" />
						<Alert.Title>Invalid input</Alert.Title>
						<Alert.Description
							>{$FormError instanceof Error
								? $FormError.message
								: JSON.stringify($FormError)}</Alert.Description
						>
					</Alert.Root>
				</div>
			{/if}

			<form
				id="login"
				class="grid w-full items-center gap-4"
				on:submit|preventDefault={handleSubmit}
			>
				<div class="flex flex-col space-y-1.5">
					<Label aria-required for="token">Token</Label>
					<Input autofocus required id="token" type="password" bind:value={$FormData.token} />
				</div>

				<div class="flex flex-col space-y-1.5">
					<Label for="apihost">API host</Label>
					<Input
						id="apihost"
						type="url"
						placeholder="{location.protocol}//{location.host}"
						bind:value={$FormData.baseUrl}
					/>
				</div>
			</form>
		</Card.Content>

		<Card.Footer class="flex justify-between mt-3">
			<p class="star-note self-start text-xs text-muted-foreground">Required</p>
			<!-- <Button variant="outline">Reset</Button> -->
			<Button form="login" type="submit">Continue</Button>
		</Card.Footer>
	</div>
</section>