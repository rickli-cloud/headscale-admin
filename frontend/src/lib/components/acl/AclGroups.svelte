<script lang="ts">
  import { createRender, createTable } from "svelte-headless-table";
	import { get, writable } from "svelte/store";
	import Plus from 'svelte-radix/Plus.svelte';
  
	import * as Title from "$lib/components/title";
	import * as Table from "$lib/components/table";
	import Tags from "$lib/components/general/Tags.svelte";
	import EditAclGroup from "./EditAclGroup.svelte";
	import CreateAclGroup from "./CreateAclGroup.svelte";
	import DeleteAclGroup from "./DeleteAclGroup.svelte";

	import { Acl, groupRegex, tagRegex, type JsonComments } from "$lib/api";
	import { parseValue } from "$lib/utils/misc";
	import { AclStore } from "$lib/store/acl";

  function formatGroups(aclStore = get(AclStore)) {
    return typeof aclStore.groups === "object" 
      ? Object.entries(aclStore.groups)
        .filter(([key]) => key !== "$$comments")
        .map(([name, members]) => ({ name, members })) 
      : []
  }

  const AclGroups = writable(formatGroups())
  const Comments = writable<JsonComments>(Acl.formatComments(get(AclStore).groups))
  AclStore.subscribe(state => {
    AclGroups.set(formatGroups(state))
    Comments.set(Acl.formatComments(state.groups))
  })

  const HeadlessTable = createTable(AclGroups)
  const Columns = HeadlessTable.createColumns([
    HeadlessTable.column({
      accessor: group => group,
      header: "",
      cell: ({ value: group }) => createRender(Table.Actions, { 
        Actions: [{
          type: "sheet",
          name: "Edit",
          title: "Edit group",
          description: "Change the name or members of a group",
          component: createRender(EditAclGroup, { group })
        },{
          type: "sheet",
          name: "Delete",
          title: "Delete group",
          description: "This action can not be undone",
          destructive: true,
          component: createRender(DeleteAclGroup, { group })
        }]
      })
    }),
    HeadlessTable.column({
      accessor: "name",
      header: "Name",
      cell: ({ value }) => parseValue(value, val => val.replace(groupRegex, ""))
    }),
    HeadlessTable.column({
      accessor: "members",
      header: "Members",
    }),
    HeadlessTable.column({
      accessor: (group) => group.name,
      header: "Owned tags",
      cell: ({ value }) => createRender(Tags, { tags: { 
        valid: Object.entries($AclStore.tagOwners)
          .filter(([_, groups]) => groups.includes(value))
          .map(([tag]) => (tag.replace(tagRegex, ""))) 
      }})
    }),
    HeadlessTable.column({
      accessor: (group) => group.name,
      header: "Description",
      cell: ({ value }) => Acl.parseComment($Comments[value]?.[0]?.[0])
    })
  ])
</script>

<Title.Root Title="Groups" Description="Access control groups">
  <Title.Action Title="Create group" Description="Group users together" let:close>
    <Plus slot="trigger" />
    <CreateAclGroup on:submit={close} on:cancel={close} />
  </Title.Action>
</Title.Root>

<Table.Root {HeadlessTable} {Columns} />
