<script lang="ts">
	import { createRender, createTable, type ReadOrWritable } from 'svelte-headless-table';
	import { Plus } from 'svelte-radix';

	import * as Title from '$lib/components/title';
	import * as Table from '$lib/components/table';

	import DateTime from '$lib/components/general/DateTime.svelte';
	import Tags from '$lib/components/general/Tags.svelte';
	import Key from '$lib/components/general/Key.svelte';
	import Form from '$lib/components/form/form.svelte';
	import CreatePreauth from './CreatePreauth.svelte';
	import PreauthState from './PreauthState.svelte';

	import type { PreAuthKey } from '$lib/api';

	export let PreAuthKeys: ReadOrWritable<PreAuthKey[]>;
	export let Creatable: boolean = false;
	export let User: string | undefined = undefined;

	const HeadlessTable = createTable(PreAuthKeys);
	const Columns = HeadlessTable.createColumns([
		HeadlessTable.column({
			accessor: (key) => key,
			header: '',
			cell: ({ value: key }) =>
				createRender(Table.Actions, {
					Actions: [
						{
							name: 'Expire',
							type: 'sheet',
							destructive: true,
							title: 'Expire preAuth key',
							description: 'Make the key unusable. This action cannot be undone',
							component: createRender(Form, {
								async onSubmit() {
									await key.expire();
								},
								SubmitText: 'Expire',
								Destructive: true,
								DisableRequiredNote: true,
								DisableReset: true
							})
						}
					]
				})
		}),
		HeadlessTable.column({
			accessor: 'key',
			header: 'Key',
			cell: ({ value }) => createRender(Key, { key: value as string })
		}),
		HeadlessTable.column({
			accessor: 'createdAt',
			header: 'Created',
			cell: ({ value: timestamp }) => createRender(DateTime, { timestamp })
		}),
		HeadlessTable.column({
			accessor: 'expiration',
			header: 'Expires',
			cell: ({ value: timestamp }) => createRender(DateTime, { timestamp, isExpiry: true })
		}),
		HeadlessTable.column({
			accessor: (key) => key,
			header: 'State',
			cell: ({ value: Key }) => createRender(PreauthState, { Key })
		}),
		HeadlessTable.column({
			accessor: (key) => key.aclTags,
			header: 'Tags',
			cell: ({ value: valid }) => createRender(Tags, { tags: { valid } })
		}),
		HeadlessTable.column({
			accessor: 'id',
			header: 'ID'
		})
	]);
</script>

<Title.Root Title="Preauth keys" Description="Connect headless devices directly to your network">
	{#if Creatable}
		<Title.Action
			Title="Create new preauth key"
			Description="Keys can only be expired not deleted"
			let:close
		>
			<Plus slot="trigger" />
			<CreatePreauth {User} on:submit={close} />
		</Title.Action>
	{/if}
</Title.Root>

<Table.Root {HeadlessTable} {Columns} />
