<script lang="ts">
	import { get, writable } from 'svelte/store';
	import { base } from '$app/paths';

	import CircleAlert from 'lucide-svelte/icons/circle-alert';
	import * as Alert from '$lib/components/ui/alert';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	import { type SessionData, initSession } from '$lib/store/session';
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

<section class="grid h-full place-items-center">
	<div class="w-full max-w-lg">
		<div class="mx-6 mb-6 flex items-center justify-between gap-3">
			<div>
				<h3 class="scroll-m-20 text-xl font-semibold tracking-tight">Authenticate</h3>
			</div>

			<div class="h-16">
				<HeadscaleLogo />
			</div>
		</div>

		<Card.Content>
			{#if $FormError}
				<div class="mb-6">
					<Alert.Root variant="destructive" class="mb-4">
						<CircleAlert class="h-4 w-4" />
						<Alert.Title>Invalid input</Alert.Title>
						<Alert.Description>
							{$FormError instanceof Error ? $FormError.message : JSON.stringify($FormError)}
						</Alert.Description>
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

		<Card.Footer class="mt-3 flex justify-between">
			<p class="star-note self-start text-xs text-muted-foreground">Required</p>
			<!-- <Button variant="outline">Reset</Button> -->
			<Button form="login" type="submit">Continue</Button>
		</Card.Footer>
	</div>
</section>
