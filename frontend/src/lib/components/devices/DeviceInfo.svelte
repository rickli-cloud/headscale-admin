<script lang="ts">
	import SquarePen from 'lucide-svelte/icons/square-pen';
	import TimerOff from 'lucide-svelte/icons/timer-off';
	import Trash2 from 'lucide-svelte/icons/trash-2';

	import * as Table from '$lib/components/ui/table/index.js';

	import ConfirmDelete from '$lib/components/general/ConfirmDelete.svelte';
	import DetailedInfo from '$lib/components/general/DetailedInfo.svelte';
	import DateTime from '$lib/components/general/DateTime.svelte';
	import List from '$lib/components/general/List.svelte';
	import Tags from '$lib/components/general/Tags.svelte';
	import Key from '$lib/components/general/Key.svelte';
	import EditDevice from './EditDevice.svelte';
	import * as Title from '$lib/components/title';
	import * as Form from '$lib/components/form';

	import { isExpired } from '$lib/utils/time';
	import { parseValue } from '$lib/utils/misc';
	import type { Machine } from '$lib/api';
	import type { Writable } from 'svelte/store';

	export let Machine: Writable<Machine>;

	const registerMethodRegex = /^REGISTER_METHOD_/;
</script>

<Title.Root Title="Device metadata" Description="The metadata of a headscale device">
	<Title.Action Title="Edit device" Description="This action cannot be undone" let:close>
		<SquarePen slot="trigger" />
		{#if Machine}
			<EditDevice machine={$Machine} on:submit={close} />
		{/if}
	</Title.Action>

	<Title.Action
		Title="Expire device session"
		Description="Expire the session of a device and force it to reauthenticate"
		let:close
	>
		<TimerOff class="text-red-600" slot="trigger" />
		<Form.Root
			description="expire device session"
			on:cancel={close}
			action={async () => {
				await $Machine?.expire();
				close();
			}}
			disableRequired
			disableReset
			destructive
		/>
	</Title.Action>

	<Title.Action Title="Delete device" Description="This action cannot be undone" let:close>
		<Trash2 class="text-red-600" slot="trigger" />
		<ConfirmDelete
			phrase={$Machine?.givenName || $Machine?.name || 'device'}
			description="delete device"
			data={$Machine}
			on:cancel={close}
			onSubmit={async () => {
				await $Machine?.delete();
				close();
			}}
		/>
	</Title.Action>
</Title.Root>

<Table.Root>
	<Table.Body>
		<Table.Row>
			<Table.Cell class="font-semibold">ID</Table.Cell>
			<Table.Cell>
				{parseValue($Machine?.id)}
			</Table.Cell>
		</Table.Row>

		<Table.Row>
			<Table.Cell class="font-semibold">Name</Table.Cell>
			<Table.Cell>
				<DetailedInfo text={$Machine?.givenName} detail={$Machine?.name} />
			</Table.Cell>
		</Table.Row>

		<Table.Row>
			<Table.Cell class="font-semibold">User</Table.Cell>
			<Table.Cell>
				<DetailedInfo
					text={$Machine?.user?.name}
					detail={$Machine?.user?.id ? '#' + $Machine.user.id : $Machine?.user?.id}
					href={'users/' + $Machine?.user?.name}
				/>
			</Table.Cell>
		</Table.Row>

		<Table.Row>
			<Table.Cell class="font-semibold">Created</Table.Cell>
			<Table.Cell>
				<DateTime timestamp={$Machine?.createdAt} />
			</Table.Cell>
		</Table.Row>

		<Table.Row>
			<Table.Cell class="font-semibold">Last seen</Table.Cell>
			<Table.Cell>
				<DateTime timestamp={$Machine?.lastSeen} />
			</Table.Cell>
		</Table.Row>

		<Table.Row>
			<Table.Cell class="font-semibold">Last successful update</Table.Cell>
			<Table.Cell>
				<DateTime timestamp={$Machine?.lastSuccessfulUpdate} />
			</Table.Cell>
		</Table.Row>

		<Table.Row>
			<Table.Cell class="font-semibold">Session expiry</Table.Cell>
			<Table.Cell>
				<DateTime timestamp={$Machine?.expiry} isExpiry />
				{#if $Machine?.expiry && isExpired($Machine.expiry)}
					<span class="text-muted-foreground"> (Expired) </span>
				{/if}
			</Table.Cell>
		</Table.Row>

		<Table.Row>
			<Table.Cell class="font-semibold">Register method</Table.Cell>
			<Table.Cell class="capitalize">
				{parseValue($Machine?.registerMethod?.replace(registerMethodRegex, '').toLowerCase())}
			</Table.Cell>
		</Table.Row>

		<Table.Row>
			<Table.Cell class="font-semibold">Online</Table.Cell>
			<Table.Cell class="capitalize">
				{parseValue($Machine?.online)}
			</Table.Cell>
		</Table.Row>

		<Table.Row>
			<Table.Cell class="font-semibold">IP addresses</Table.Cell>
			<Table.Cell>
				{#if $Machine?.ipAddresses}
					<List items={$Machine.ipAddresses} />
				{/if}
			</Table.Cell>
		</Table.Row>

		<Table.Row>
			<Table.Cell class="font-semibold">Machine key</Table.Cell>
			<Table.Cell>
				<Key key={$Machine?.machineKey} />
			</Table.Cell>
		</Table.Row>

		<Table.Row>
			<Table.Cell class="font-semibold">Node key</Table.Cell>
			<Table.Cell>
				<Key key={$Machine?.nodeKey} />
			</Table.Cell>
		</Table.Row>

		<Table.Row>
			<Table.Cell class="font-semibold">Disco key</Table.Cell>
			<Table.Cell>
				<Key key={$Machine?.discoKey} />
			</Table.Cell>
		</Table.Row>

		<Table.Row>
			<Table.Cell class="font-semibold">Tags</Table.Cell>
			<Table.Cell>
				{#if $Machine?.validTags}
					<Tags
						tags={{
							valid: $Machine.validTags,
							forced: $Machine.forcedTags,
							invalid: $Machine.invalidTags
						}}
					/>
				{/if}
			</Table.Cell>
		</Table.Row>
	</Table.Body>
</Table.Root>
