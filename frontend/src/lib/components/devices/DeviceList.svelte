<script lang="ts">
	import { createRender, createTable, type ReadOrWritable } from 'svelte-headless-table';
	import { Plus } from 'svelte-radix';

	import ConfirmDelete from '$lib/components/general/ConfirmDelete.svelte';
	import DetailedInfo from '$lib/components/general/DetailedInfo.svelte';
	import DateTime from '$lib/components/general/DateTime.svelte';
	import List from '$lib/components/general/List.svelte';
	import DeviceStatus from './DeviceStatus.svelte';
	import CreateDevice from './CreateDevice.svelte';
	import EditDevice from './EditDevice.svelte';
	import * as Title from '$lib/components/title';
	import * as Table from '$lib/components/table';

	import { isExpired } from '$lib/utils/time';
	import Form from '../form/form.svelte';
	import type { Machine } from '$lib/api';
	import Tags from '../general/Tags.svelte';

	export let Machines: ReadOrWritable<Machine[]>;
	export let User: string | undefined = undefined;

	const HeadlessTable = createTable(Machines);
	const Columns = HeadlessTable.createColumns([
		HeadlessTable.column({
			accessor: (machine) => machine,
			header: '',
			cell: ({ value: machine }) =>
				createRender(Table.Actions, {
					Actions: [
						{
							name: 'Show',
							type: 'href',
							href: 'devices/' + machine.id
						},
						{
							name: 'Edit',
							type: 'sheet',
							title: 'Edit device',
							description: 'This action can not be undone',
							component: createRender(EditDevice, { machine })
						},
						{
							name: 'Expire',
							type: 'sheet',
							title: 'Expire device session',
							description: 'Expire the session of a device and force it to reauthenticate',
							disabled: isExpired(machine.expiry as string),
							destructive: true,
							component: createRender(Form, {
								async onSubmit() {
									await machine.expire();
								},
								SubmitText: 'Expire',
								Destructive: true,
								DisableRequiredNote: true,
								DisableReset: true
							})
						},
						{
							name: 'Delete',
							type: 'sheet',
							title: 'Delete device',
							description: 'This action can not be undone',
							destructive: true,
							component: createRender(ConfirmDelete, {
								phrase: machine.givenName || machine.name || 'machine',
								async onSubmit() {
									await machine.delete();
								}
							})
						}
					]
				})
		}),
		HeadlessTable.column({
			accessor: ({ online, lastSeen }) => ({ online, lastSeen }),
			header: ' ',
			cell: ({ value: { online, lastSeen } }) =>
				createRender(DeviceStatus, {
					online,
					lastSeen
				})
		}),
		HeadlessTable.column({
			accessor: ({ name, givenName }) => ({ name, givenName }),
			header: 'Name',
			cell: ({ value }) => createRender(DetailedInfo, { text: value.givenName, detail: value.name })
		}),
		HeadlessTable.column({
			accessor: ({ user }) => user,
			header: 'User',
			cell: ({ value }) =>
				createRender(DetailedInfo, {
					text: value?.name,
					detail: value?.id ? '#' + value.id : undefined,
					href: `users/${value?.name}`
				})
		}),
		HeadlessTable.column({
			accessor: 'ipAddresses',
			header: 'IP',
			cell: ({ value: items }) => createRender(List, { items })
		}),
		HeadlessTable.column({
			accessor: 'expiry',
			header: 'Session Expires',
			cell: ({ value: timestamp }) => createRender(DateTime, { timestamp, isExpiry: true })
		}),
		HeadlessTable.column({
			accessor: 'createdAt',
			header: 'Created',
			cell: ({ value: timestamp }) => createRender(DateTime, { timestamp })
		}),
		HeadlessTable.column({
			accessor: (machine) => ({
				valid: machine.validTags,
				invalid: machine.invalidTags,
				forced: machine.forcedTags
			}),
			header: 'Tags',
			cell: ({ value: tags }) => createRender(Tags, { tags })
		}),
		HeadlessTable.column({
			accessor: 'id',
			header: 'ID'
		})
	]);
</script>

<Title.Root Title="Devices" Description="Headscale clients">
	<Title.Action
		Title="Register a new device"
		Description="Manually connect a device. You can also connect a device over the app or with a preAuth key"
		let:close
	>
		<Plus slot="trigger" />
		<CreateDevice on:submit={close} {User} />
	</Title.Action>
</Title.Root>

<Table.Root {HeadlessTable} {Columns} Linkable={{ base: 'devices', key: 'id' }} ActionRows={2} />
