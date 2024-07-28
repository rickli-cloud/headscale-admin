<script lang="ts">
  import { createRender, createTable } from "svelte-headless-table";
	import { get, writable } from "svelte/store";
	import Plus from 'svelte-radix/Plus.svelte';
  
	import * as Title from "$lib/components/title";
	import * as Table from "$lib/components/table";

	import { AclStore } from "$lib/store/acl";
	import { parseValue } from "$lib/utils/misc";
	import EditAclHost from "./EditAclHost.svelte";
	import CreateAclHost from "./CreateAclHost.svelte";
	import { Acl, type JsonComments } from "$lib/api";
	import DeleteAclHost from "./DeleteAclHost.svelte";

  function formatHosts(aclStore = get(AclStore)) {
    return typeof aclStore?.Hosts === "object" 
      ? Object.entries(aclStore?.Hosts)
        .filter(([name]) => name !== "$$comments")
        .map(([name, prefix]) => ({ name, prefix })) 
      : []
  }

  const AclHosts = writable(formatHosts())
  const Comments = writable<JsonComments>(Acl.formatComments(get(AclStore).Hosts))
  AclStore.subscribe(state => {
    AclHosts.set(formatHosts(state))
    Comments.set(Acl.formatComments(state.Hosts))
  })

  const HeadlessTable = createTable(AclHosts)
  const Columns = HeadlessTable.createColumns([
    HeadlessTable.column({
      accessor: host => host,
      header: "",
      cell: ({ value: host }) => createRender(Table.Actions, { 
        Actions: [{
          type: "sheet",
          name: "Edit",
          title: "Edit host",
          description: "Change the name or prefix of a host",
          component: createRender(EditAclHost, { host })
        },{
          type: "sheet",
          name: "Delete",
          title: "Delete host",
          description: "This action can not be undone",
          component: createRender(DeleteAclHost, { host }),
          destructive: true
        }]
      })
    }),
    HeadlessTable.column({
      accessor: "name",
      header: "Name",
      cell: ({ value }) => parseValue(value)
    }),
    HeadlessTable.column({
      accessor: "prefix",
      header: "Prefix",
      cell: ({ value }) => parseValue(value)
    }),
    HeadlessTable.column({
      accessor: host => host.name,
      header: "Description",
      cell: ({ value }) => Acl.parseComment($Comments[value]?.[0]?.[0])
    })
  ])
</script>

<Title.Root Title="Hosts" Description="Access control hosts">
  <Title.Action Title="Create host" Description="Hosts can be a single host /32 or a whole network" let:close>
    <Plus slot="trigger" />
    <CreateAclHost on:submit={close} on:cancel={close} />
  </Title.Action>
</Title.Root>

<Table.Root {HeadlessTable} {Columns} />
