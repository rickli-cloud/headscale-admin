<script lang="ts">
	import { createRender, createTable, type ReadOrWritable } from 'svelte-headless-table';
	import { Plus } from 'svelte-radix';

	import DateTime from '$lib/components/general/DateTime.svelte';
	import Form from '$lib/components/form/form.svelte';
	import CreateApiKey from './CreateApiKey.svelte';
	import * as Title from '$lib/components/title';
	import * as Table from '$lib/components/table';

	import { ApiKey } from '$lib/api';
	import { isExpired } from '$lib/utils/time';

	export let Keys: ReadOrWritable<ApiKey[]>;

	const HeadlessTable = createTable(Keys);
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
							description: 'This will make the key unusable forever',
							title: 'Expire API key',
							disabled: !key.expiration || isExpired(key.expiration),
							component: createRender(Form, {
								DisableRequiredNote: true,
								SubmitText: 'Expire',
								DisableReset: true,
								Destructive: true,
								onSubmit: async () => {
									await key.expire();
								}
							})
						}
					]
				})
		}),
		HeadlessTable.column({
			accessor: 'prefix',
			header: 'Key',
			cell: ({ value }) => value + '...'
		}),
		HeadlessTable.column({
			accessor: 'createdAt',
			header: 'Created',
			cell: ({ value: timestamp }) => createRender(DateTime, { timestamp })
		}),
		HeadlessTable.column({
			accessor: 'expiration',
			header: 'Expiration',
			cell: ({ value: timestamp }) => createRender(DateTime, { timestamp, isExpiry: true })
		}),
		HeadlessTable.column({
			accessor: 'lastSeen',
			header: 'Last seen',
			cell: ({ value: timestamp }) => createRender(DateTime, { timestamp })
		}),
		HeadlessTable.column({
			accessor: 'id',
			header: 'ID'
		})
	]);
</script>

<Title.Root Title="API keys" Description="Keys can be used to manage headscale over the REST API">
	<Title.Action
		Title="Create API key"
		Description="Keys can not be deleted, only expired"
		let:close
	>
		<Plus slot="trigger" />
		<CreateApiKey on:submit={close} />
	</Title.Action>
</Title.Root>

<Table.Root {HeadlessTable} {Columns} />
