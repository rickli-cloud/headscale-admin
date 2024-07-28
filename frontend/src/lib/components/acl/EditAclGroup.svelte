<script lang="ts">
	import { createEventDispatcher } from 'svelte';

  import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	import MultiSelect from '$lib/components/general/MultiSelect.svelte';
	import EditTags from '$lib/components/general/EditTags.svelte';
	import * as Form from "$lib/components/form";

	import { get, writable } from 'svelte/store';
	import { Acl, groupRegex, tagRegex, User } from '$lib/api';
	import { AclStore } from '$lib/store/acl';

  export let group: { name: string, members: string[] }
  export let users: User[] | undefined = undefined
  
  if (!users) {
    User.list().then(u => users = u)
  }

  const NewData = writable<{ 
    name: string,
    members: string[],
    ownedTags: string[],
    description: string
  }>({
    name: group.name.replace(groupRegex, ""),
    members: group.members,
    ownedTags: Object.entries(get(AclStore).tagOwners).filter(([_, groups]) => groups.includes(group.name)).map(([tag]) => (tag.replace(tagRegex, ""))),
    description: Acl.parseComment(Acl.formatComments(get(AclStore).groups)[group.name]?.[0]?.[0])
  });

  console.debug({ group })
  NewData.subscribe(newData => console.table(newData));

  const dispatch = createEventDispatcher();

  async function onSubmit() {
    const acl = get(AclStore);
    const data = get(NewData);

    // if name changed clean up
    if (group.name.replace(groupRegex, "") !== data.name.replace(groupRegex, "")) {
      // group
      if (typeof acl.groups[group.name] !== "undefined") {
        delete acl.groups[group.name];
      }

      // owned tags
      for (const key in acl.tagOwners) {
        if (acl.tagOwners[key].includes(group.name)) {
          if (acl.tagOwners[key]?.length === 1) delete acl.tagOwners[key]
          if (typeof acl.tagOwners[key] !== "undefined") acl.tagOwners[key] = acl.tagOwners[key].filter(i => i !== group.name);
        }
      }
    } else { 
      // remove old owned tags
      for (const tag in acl.tagOwners) {
        if (!data.ownedTags.includes(tag) && acl.tagOwners[tag].includes(group.name)) {
          if (acl.tagOwners[tag]?.length === 1) delete acl.tagOwners[tag]
          if (typeof acl.tagOwners[tag] !== "undefined") acl.tagOwners[tag] = acl.tagOwners[tag].filter(i => i !== group.name);
        }
      }
    }

    const groupName = groupRegex.test(data.name) ? data.name : "group:" + data.name

    // set new data
    acl.groups[groupName] = data.members;

    // set new owned tags
    if (data.ownedTags.length > 0) {
      for (const tag of data.ownedTags) {
        const tagName = tagRegex.test(tag) ? tag : "tag:" + tag;

        if (!Array.isArray(acl.tagOwners[tagName])) acl.tagOwners[tagName] = [groupName];
        else if (!acl.tagOwners[tagName].includes(groupName)) acl.tagOwners[tagName].push(groupName);
      }
    }

    // set comment
    const groupComments = Acl.formatComments(acl.groups);
    if (data.description || typeof groupComments[groupName] !== "undefined") {
      if (!data.description) {
        delete groupComments[groupName];
      } else {
        groupComments[groupName] = [[Acl.stringifyComment(data.description)]]
      }
      acl.groups.$$comments = groupComments as unknown as string[] // funky
    }

    console.debug({ acl })

    await acl.update();

    dispatch("submit");
  };

  async function onReset() {
    NewData.set({
      name: group.name.replace(/^group:/, ""),
      members: group.members,
      ownedTags: Object.entries(get(AclStore).tagOwners).filter(([_, groups]) => groups.includes(group.name)).map(([tag]) => (tag.replace(tagRegex, ""))),
      description: Acl.parseComment(Acl.formatComments(get(AclStore).groups)[group.name]?.[0]?.[0])
    })
  };
</script>

<Form.Root
  description="edit group"
  submitText="Save"
  action={onSubmit}
  on:reset{onReset}
  on:cancel
  let:disabled
  let:id
>
  <Form.Item>
    <Label aria-required for={id + "-name"}>Name</Label>
		<Input required id={id + "-name"} bind:value={$NewData.name} {disabled} />
  </Form.Item>

  <Form.Item>
    <Label aria-required for={id + "-selectUsers"}>Members</Label>
    <MultiSelect 
      title="Users" 
      name={id + "-selectUsers"}
      items={(users?.map(i => i.name) || [])} 
      bind:selected={$NewData.members}
      invalidSelected={group.members?.filter(i => !users?.find(user => user.name === i)?.id)}
    />
  </Form.Item>

  <Form.Item>
    <EditTags bind:tags={$NewData.ownedTags} title="Owned tags" />
  </Form.Item>

  <Form.Item>
    <Label for={id + "-description"}>Description</Label>
    <Input id={id + "-description"} bind:value={$NewData.description} {disabled} />
  </Form.Item>
</Form.Root>
