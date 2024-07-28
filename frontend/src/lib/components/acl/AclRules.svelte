<script lang="ts">
	import { AclStore } from "$lib/store/acl";
	import { createRender, createTable } from "svelte-headless-table";
	import { get, writable } from "svelte/store";
	import * as Title from "$lib/components/title";
	import * as Table from "$lib/components/table";
	import Plus from "svelte-radix/Plus.svelte";
	import CreateAclRule from "./CreateAclRule.svelte";
	import List from "../general/List.svelte";
	import { Acl } from "$lib/api";
	import ConfirmDelete from "../general/ConfirmDelete.svelte";
	import { parseValue } from "$lib/utils/misc";
	import EditAclRule from "./EditAclRule.svelte";

  const AclList = writable(get(AclStore).acls || [])
  AclStore.subscribe((acl) => AclList.set(acl.acls || []))

  const HeadlessTable = createTable(AclList);
  const Columns = HeadlessTable.createColumns([
    HeadlessTable.column({
      accessor: acl => acl,
      header: "",
      cell: ({ value: acl, row: { id } }) => createRender(Table.Actions, { 
        Actions: [{
          type: "sheet",
          name: "Edit",
          title: "Edit access rule",
          description: "Change how this rule affects your clients",
          component: createRender(EditAclRule, { rule: acl, index: Number(id) })
        },{
          type: "sheet",
          name: "Delete",
          title: "Delete access rule",
          description: "This action can not be undone",
          destructive: true,
          component: createRender(ConfirmDelete, {
            data: { ...acl, description: Acl.parseComment(get(AclStore).$$comments.$acls?.[Number(id)]?.[0]?.[0]) },
            async onSubmit() {
              const acl = get(AclStore)

              if (typeof acl.acls[Number(id)] === "undefined") {
                throw new Error("Failed to find item inside storage")
              }

              delete acl.acls[Number(id)]
              
              const { error } = await acl.update();
              if (error) throw error
            }
          })
        }]
      })
    }),
    HeadlessTable.column({
      accessor: "proto",
      header: "Protocol",
      cell: ({ value }) => parseValue(value, undefined, "*")
    }),
    HeadlessTable.column({
      accessor: "src",
      header: "Source",
      cell: ({ value: items }) => createRender(List, { items })
    }),
    HeadlessTable.column({
      accessor: "dst",
      header: "Destination",
      cell: ({ value: items }) => createRender(List, { items })
    }),
    HeadlessTable.column({
      accessor: acl => acl,
      header: "Description",
      cell: ({ row: { id } }) => Acl.parseComment(get(AclStore).$$comments.$acls?.[Number(id)]?.[0]?.[0])
    }),
  ])
</script>

<Title.Root Title="Access rules" Description="Limit connections between your clients">
  <Title.Action 
    Title="Create access rule"
    Description="Access rules can be based on wide set of arguments"
    let:close
  >
    <Plus slot="trigger" />
    <CreateAclRule on:submit={close} on:cancel={close}/>
  </Title.Action>
</Title.Root>

<Table.Root {HeadlessTable} {Columns} />
