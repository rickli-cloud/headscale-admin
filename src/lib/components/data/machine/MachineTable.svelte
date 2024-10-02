<script lang="ts">
	import { Machine } from '$lib/api';
	import { createTablePlugins } from '$lib/components/dataTable';
	import DataTable from '$lib/components/dataTable/data-table.svelte';
	import DateTime from '$lib/components/general/DateTime.svelte';
	import { createRender, createTable } from 'svelte-headless-table';
	import { readable } from 'svelte/store';
	import MachineStatus from './MachineStatus.svelte';
	import MachineName from './MachineName.svelte';
	import List from '$lib/components/general/List.svelte';
	import MachineUser from './MachineUser.svelte';
	import DataTableCheckbox from '$lib/components/dataTable/data-table-checkbox.svelte';
	import Secret from '$lib/components/general/Secret.svelte';
	import Code from '$lib/components/general/Code.svelte';

	export let machines: Machine[] | undefined;

	const testMachine = new Machine({
		name: 'test',
		givenName: 'test',
		online: true,
		createdAt: new Date().toISOString(),
		lastSeen: new Date().toISOString(),
		expiry: new Date(Date.now() + 4206942069).toISOString(),
		id: '999',
		ipAddresses: ['1.1.1.1'],
		user: {
			name: 'test',
			createdAt: new Date().toISOString(),
			id: '999'
		},
		nodeKey: '1231231',
		machineKey: '123123123',
		discoKey: '123123123'
	});

	const machineTable = createTable(
		readable([...(machines || []), testMachine]),
		createTablePlugins({
			hide: { initialHiddenColumnIds: ['nodeKey', 'discoKey', 'machineKey', 'lastSeen'] as (keyof Machine)[] }
		})
	);
	const machineModel = machineTable.createViewModel(
		machineTable.createColumns([
			machineTable.column({
				id: 'select',
				accessor: (col) => col.id,
				header: (_, { pluginStates }) => {
					return createRender(DataTableCheckbox, {
						checked: pluginStates.select.allPageRowsSelected
					});
				},
				cell: ({ row }, { pluginStates }) => {
					return createRender(DataTableCheckbox, {
						checked: pluginStates.select.getRowState(row).isSelected
					});
				},
				plugins: {
					filter: { exclude: true },
					sort: { disable: true }
				}
			}),
			machineTable.column({
				id: 'Status',
				accessor: (machine) => ({ online: machine.online, lastSeen: machine.lastSeen }),
				header: '',
				cell: ({ value }) => createRender(MachineStatus, value),
				plugins: {
					resize: { initialWidth: 48 },
					filter: { exclude: true },
					sort: { disable: false }
				}
			}),
			machineTable.column({
				id: 'name',
				accessor: (machine) => ({ name: machine.name, givenName: machine.givenName }),
				header: 'Name',
				cell: ({ value }) => createRender(MachineName, value)
			}),
			machineTable.column({
				id: 'user',
				accessor: 'user',
				header: 'User',
				cell: ({ value }) => createRender(MachineUser, { user: value })
			}),
			machineTable.column({
				id: 'ipAddresses',
				accessor: 'ipAddresses',
				header: "IP's",
				cell: ({ value }) => createRender(List, { items: value, class: 'list-disc pl-3.5' })
			}),
			machineTable.column({
				id: 'expiry',
				accessor: 'expiry',
				header: 'Expiry',
				cell: ({ value }) => createRender(DateTime, { timestamp: value, isExpiry: true })
			}),
			machineTable.column({
				id: 'createdAt',
				accessor: 'createdAt',
				header: 'Created',
				cell: ({ value }) => createRender(DateTime, { timestamp: value })
			}),
			machineTable.column({
				id: 'lastSeen',
				accessor: 'lastSeen',
				header: 'Last seen',
				cell: ({ value }) => createRender(DateTime, { timestamp: value })
			}),
			machineTable.column({
				id: 'nodeKey',
				accessor: 'nodeKey',
				header: 'Node key',
				cell: ({ value }) => createRender(Secret, { secret: value })
			}),
			machineTable.column({
				id: 'machineKey',
				accessor: 'machineKey',
				header: 'Machine key',
				cell: ({ value }) => createRender(Secret, { secret: value })
			}),
			machineTable.column({
				id: 'discoKey',
				accessor: 'discoKey',
				header: 'Disco key',
				cell: ({ value }) => createRender(Secret, { secret: value })
			}),
			machineTable.column({
				id: 'id',
				accessor: 'id',
				header: 'ID'
			})
		])
	);
</script>

<DataTable caption="Machines" model={machineModel} let:row>
	<svelte:fragment slot="description">
		Refer to the official guides for instructions on connecting
		<a href="/apple" class="underline-offset-4 hover:text-foreground hover:underline" aria-roledescription="external-link">
			Apple
		</a>
		or
		<a href="/windows" class="underline-offset-4 hover:text-foreground hover:underline" aria-roledescription="external-link">
			Windows
		</a>
		devices
	</svelte:fragment>

	<Code yaml={machines?.[Number(row.id)] || testMachine} />
</DataTable>
