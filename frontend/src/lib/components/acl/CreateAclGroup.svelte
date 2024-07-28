<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { get, writable } from "svelte/store";
  
  import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
  
	import MultiSelect from "$lib/components/general/MultiSelect.svelte";
	import * as Form from "$lib/components/form";
  
	import { AclStore } from "$lib/store/acl";
	import { Acl, tagRegex, User } from "$lib/api";
	import EditTags from "../general/EditTags.svelte";

  export let users: User[] | undefined = undefined

  if (!users) {
    User.list().then(u => users = u)
  }

  const Data = writable<{ 
    name: string,
    members: string[],
    ownedTags: string[],
    description: string
  }>({ 
    name: "",
    members: [], 
    ownedTags: [],
    description: ""
  });

  const dispatch = createEventDispatcher();

  async function handleSubmit() {
    const acl = get(AclStore);
    const data = get(Data);

    const groupName = /^group:/.test(data.name) ? data.name : "group:" + data.name

    if (typeof acl.groups[groupName] !== "undefined") {
      throw new Error("Group name already exists")
    }

    acl.groups[groupName] = data.members;

    if (data.ownedTags.length) {
      for (const tag of data.ownedTags) {
        const tagName = tagRegex.test(tag) ? tag : "tag:" + tag

        if (!Array.isArray(acl.tagOwners[tagName])) {
          acl.tagOwners[tagName] = [groupName]
        } else if (!acl.tagOwners[tagName].includes(groupName)) {
          acl.tagOwners[tagName].push(groupName)
        }
      }
    }

    if (data.description) {
      const comments = Acl.formatComments(acl.groups)
      comments[groupName] = [[Acl.stringifyComment(data.description)]]
      acl.groups.$$comments = comments as unknown as string[] // funky
    }

    console.log({ acl })

    const result = await acl.update()

    if (result.error) throw result.error;
    if (result.data) AclStore.set(result.data)

    dispatch("submit");
  }

  function handleReset() {
    Data.set({ 
      name: "",
      members: [], 
      ownedTags: [],
      description: ""
    });
  }
</script>

<Form.Root
  description="create group"
  action={handleSubmit}
  on:reset={handleReset}
  on:cancel
  let:disabled
  let:id
>
  <Form.Item>
    <Label aria-required for={id + "-name"}>Name</Label>
		<Input required id={id + "-name"} bind:value={$Data.name} {disabled} />
  </Form.Item>
  
  <Form.Item>
    <Label aria-required for={id + "-users"}>Members</Label>
		<MultiSelect title="Users" items={users?.map(i => i.name) || []} bind:selected={$Data.members} />
  </Form.Item>
  
  <Form.Item>
    <EditTags bind:tags={$Data.ownedTags} title="Owned tags" />
  </Form.Item>
  
  <Form.Item>
    <Label for={id + "-description"}>Description</Label>
    <Input id={id + "-description"} bind:value={$Data.description} {disabled} />
  </Form.Item>
</Form.Root>
