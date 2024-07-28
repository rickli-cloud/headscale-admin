<script lang="ts">
	import { createRender, createTable, type ReadOrWritable } from 'svelte-headless-table';

	import ConfirmDelete from '$lib/components/general/ConfirmDelete.svelte';
	import DetailedInfo from '$lib/components/general/DetailedInfo.svelte';
	import DateTime from '$lib/components/general/DateTime.svelte';
	import Tags from '$lib/components/general/Tags.svelte';
	import Form from '$lib/components/form/form.svelte';
	import RouteState from './RouteState.svelte';
	import * as Title from '$lib/components/title';
	import * as Table from '$lib/components/table';

	import type { Route } from '$lib/api';

	export let Routes: ReadOrWritable<Route[]>;

	const HeadlessTable = createTable(Routes);
	const Columns = HeadlessTable.createColumns([
		HeadlessTable.column({
			accessor: (route) => route,
			header: '',
			cell: ({ value: route }) =>
				createRender(Table.Actions, {
					Actions: [
						{
							name: route.enabled ? "Disable" : "Enable",
							type: "sheet",
							title: (route.enabled ? "Disable" : "Enable") + " route",
							description: (route.enabled ? "Disable" : "Enable") + " a route for your clients",
							component: createRender(Form, {
								description: (route.enabled ? "disable" : "enable") + " route",
								submitText: route.enabled ? "Disable" : "Enable",
								disableRequired: true,
								disableReset: true,
								async action() {
									await (route.enabled ? route.disable() : route.enable());
								},
							})
						},
						{
							name: 'Delete',
							type: 'sheet',
							title: 'Delete route',
							description: 'This action cannot be undone. Only clients can advertise routes',
							destructive: true,
							component: createRender(ConfirmDelete, {
								description: "delete route",
								data: route,
								phrase: route.prefix || route.id || 'route',
								async onSubmit() {
									await route.delete();
								}
							})
						}
					]
				})
		}),
		HeadlessTable.column({
			accessor: 'prefix',
			header: 'Prefix'
		}),
		HeadlessTable.column({
			accessor: (route) => route.machine,
			header: 'Device',
			cell: ({ value: machine }) =>
				createRender(DetailedInfo, {
					text: machine?.name,
					detail: machine?.id ? '#' + machine.id : machine?.id
				})
		}),
		HeadlessTable.column({
			accessor: 'createdAt',
			header: 'Created',
			cell: ({ value: timestamp }) => createRender(DateTime, { timestamp })
		}),
		HeadlessTable.column({
			accessor: 'updatedAt',
			header: 'Last updated',
			cell: ({ value: timestamp }) => createRender(DateTime, { timestamp })
		}),
		HeadlessTable.column({
			accessor: (route) => route,
			header: 'State',
			cell: ({ value: route }) => createRender(RouteState, { route })
		}),
		HeadlessTable.column({
			accessor: (route) => route.machine,
			header: 'Tags',
			cell: ({ value }) =>
				createRender(Tags, {
					tags: { invalid: value?.invalidTags, valid: value?.validTags, forced: value?.forcedTags }
				})
		}),
		HeadlessTable.column({
			accessor: 'id',
			header: 'ID'
		})
	]);
</script>

<Title.Root Title="Routes" Description="Advertise exit nodes or IP ranges for your clients" />

<Table.Root {HeadlessTable} {Columns} />
