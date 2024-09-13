<script lang="ts">
	import { defaults, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { createEventDispatcher } from 'svelte';
	import { writable } from 'svelte/store';
	import type { ClassValue } from 'clsx';
	import { z } from 'zod';

	import { Input } from '$lib/components/ui/input';

	import ErrorComponent from '$lib/components/general/ErrorComponent.svelte';
	import * as Form from '$lib/components/form';

	import { User } from '$lib/api';

	const dispatch = createEventDispatcher();

	export const createUserSchema = z.object({
		name: z.string()
	});

	interface $$Props extends Partial<Form.Root> {
		class?: ClassValue;
	}

	const err = writable<unknown>();

	const form = superForm(defaults(zod(createUserSchema)), {
		SPA: true,
		dataType: 'json',
		invalidateAll: true,
		validators: zod(createUserSchema),
		async onUpdate(ev) {
			if (ev.form.valid) {
				try {
					err.set(undefined);
					await User.create(ev.form.data.name, undefined, { throw: true });
					dispatch('submit');
				} catch (e) {
					console.error('Error while creating user:', e);
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

<Form.Root {...$$restProps} {form} resettable on:reset={() => formData.set({ name: '' })}>
	<Form.Field {form} name="name">
		<Form.Control let:attrs>
			<Form.Label>Name</Form.Label>
			<Input {...attrs} required={$constraints.name?.required} bind:value={$formData.name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
</Form.Root>
