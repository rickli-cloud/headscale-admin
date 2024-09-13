<script lang="ts">
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { createEventDispatcher } from 'svelte';
	import { get, writable } from 'svelte/store';
	import { z } from 'zod';

	import { Input } from '$lib/components/ui/input';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	import * as Form from '$lib/components/form';
	import Code from '$lib/components/general/Code.svelte';
	import ErrorComponent from '$lib/components/general/ErrorComponent.svelte';

	import { ApiKey, type V1CreateApiKeyResponse } from '$lib/api';
	import Button from '$lib/components/ui/button/button.svelte';

	const dispatch = createEventDispatcher();

	export const createApiKeySchema = z.object({
		expiration: z.string()
	});

	interface $$Props extends Partial<Form.Root> {}

	interface CreateApiKeyResult extends V1CreateApiKeyResponse {
		expiration: string;
	}

	const err = writable<unknown>();
	const result = writable<CreateApiKeyResult>();

	const form = superForm(defaults(zod(createApiKeySchema)), {
		SPA: true,
		dataType: 'json',
		invalidateAll: true,
		validators: zod(createApiKeySchema),
		async onUpdate(ev) {
			if (ev.form.valid) {
				try {
					const data = get(formData);
					data.expiration = new Date(data.expiration).toISOString();
					const response = await ApiKey.create(data, undefined, { throw: true });
					if (response.data) {
						result.set({ ...data, ...response.data });
					}
				} catch (e) {
					console.error('Error while creating api key:', e);
					err.set(e);
				}
			}
		}
	});

	const { form: formData, constraints } = form;
</script>

{#if $err}
	<ErrorComponent err={$err} />
{/if}

<Form.Root {...$$restProps} {form}>
	<Form.Field {form} name="expiration">
		<Form.Control let:attrs>
			<Form.Label>Expiration</Form.Label>
			<Input {...attrs} type="datetime-local" {...$constraints.expiration} bind:value={$formData.expiration} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
</Form.Root>

{#if $result}
	<hr class="spacer" />

	<h4 class="mb-1 scroll-m-20 text-xl font-semibold tracking-tight">Success!</h4>
	<p class="mb-2 text-sm text-muted-foreground">
		Make sure to save this token somewhere safe. You will not be able to see this again
	</p>

	<div class="overflow-x-scroll">
		<table class="table">
			<tr>
				<th class="pr-2 text-left">Key</th>
				<td>{$result.apiKey}</td>
			</tr>
			<tr>
				<th class="pr-2 text-left">Expiration</th>
				<td>{new Date($result.expiration).toLocaleString()}</td>
			</tr>
		</table>
	</div>

	<div class="mt-2 flex w-full items-center justify-end">
		<Button on:click={() => dispatch('submit')}>Finish</Button>
	</div>
{/if}

<!-- <AlertDialog.Root>
	<AlertDialog.Trigger let:builder>
		<button class="hidden" {...builder} use:builder.action bind:this={dialogButton} />
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Success!</AlertDialog.Title>
			<AlertDialog.Description class="whitespace-break-spaces">
				Make sure to save this token somewhere safe. You will not be able to see this again
			</AlertDialog.Description>
		</AlertDialog.Header>

		<table class="table">
			<tr>
				<th>Key</th>
				<td>{$result.apiKey}</td>
			</tr>
			<tr>
				<th>Expiration</th>
				<td>{new Date($result.expiration).toLocaleString()}</td>
			</tr>
		</table>

		<Code yaml={$result} class="whitespace-break-spaces" />

		<AlertDialog.Footer>
			<AlertDialog.Action on:click={() => dispatch('submit')}>Finish</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root> -->
