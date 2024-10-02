<script lang="ts">
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { createEventDispatcher } from 'svelte';
	import { get, writable } from 'svelte/store';
	import { z } from 'zod';

	import { Input } from '$lib/components/ui/input';

	import * as Select from '$lib/components/ui/select';

	import SelectUser from '$lib/components/data/user/SelectUser.svelte';
	import * as Form from '$lib/components/form';

	import { Acl, groupRegex, type User } from '$lib/api';
	import ErrorComponent from '$lib/components/general/ErrorComponent.svelte';
	import { AclStore } from '$lib/store/acl';

	const dispatch = createEventDispatcher();

	export const createGroupSchema = z.object({
		name: z.string(),
		members: z.array(z.string()),
		description: z.string().optional(),
		ownedTags: z.array(z.string()).optional()
	});

	interface $$Props extends Partial<Form.Root> {
		users?: User[] | undefined;
	}

	const err = writable<unknown>();

	export let users: $$Props['users'] = undefined;

	const form = superForm(defaults(zod(createGroupSchema)), {
		SPA: true,
		dataType: 'json',
		invalidateAll: true,
		validators: zod(createGroupSchema),
		async onUpdate(ev) {
			if (ev.form.valid) {
				try {
					err.set(undefined);

					const acl = get(AclStore);
					const data = get(formData);

					const groupName = groupRegex.test(data.name) ? data.name : 'group:' + data.name;

					if (typeof acl.groups[groupName] !== 'undefined') {
						throw new Form.Error('Group already exists');
					}

					acl.groups[groupName] = data.members;

					if (data.description?.length) {
						const comments = Acl.formatComments(acl.groups);
						comments[groupName] = [[Acl.stringifyComment(data.description)]];
						acl.groups.$$comments = comments as unknown as string[]; // funky
					}

					console.debug({ acl });

					const result = await acl.update();

					if (result.error) throw result.error;
					if (result.data) AclStore.set(result.data);

					dispatch('submit');
				} catch (e) {
					console.error('Error while creating group:', e);
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
	<Form.Field {form} name="name">
		<Form.Control let:attrs>
			<Form.Label>Name</Form.Label>
			<Input {...attrs} {...$constraints.name} bind:value={$formData.name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="description">
		<Form.Control let:attrs>
			<Form.Label>Description</Form.Label>
			<Input {...attrs} {...$constraints.description} bind:value={$formData.description} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="members">
		<Form.Control let:attrs>
			<Form.Label>Members</Form.Label>
			<SelectUser {...attrs} {users} {...$constraints.members} multiple bind:selected={$formData.members} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="members">
		<Form.Control let:attrs>
			<Form.Label>Owned tags</Form.Label>
			<Select.Root {...attrs} multiple>
				<Select.Trigger>
					<Select.Value asChild></Select.Value>
				</Select.Trigger>
			</Select.Root>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
</Form.Root>
