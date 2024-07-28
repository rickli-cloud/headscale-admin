<script lang="ts">
	import { createEventDispatcher } from 'svelte';
  
  import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	import * as Form from "$lib/components/form";
	import { get, writable } from 'svelte/store';
	import { AclStore } from '$lib/store/acl';
	import { Acl } from '$lib/api';

  export let host: { name: string, prefix: string }

  const NewData = writable({ 
    ...host,
    comment: Acl.parseComment(Acl.formatComments(get(AclStore).Hosts)[host.name]?.[0]?.[0])
  })

  const dispatch = createEventDispatcher();

  async function onSubmit() {
    const acl = get(AclStore);
    const data = get(NewData);

    // if name changed
    if (data.name !== host.name) {
      if (typeof acl.Hosts[data.name] !== "undefined") {
        throw new Error("Hostname " + data.name + " already taken")
      }

      delete acl.Hosts[host.name];
    }

    // description
    const hostComments = Acl.formatComments(acl.Hosts)

    if (data.comment?.length) hostComments[data.name] = [[Acl.stringifyComment(data.comment)]]
    else if (typeof hostComments[data.name] !== "undefined") {
      delete hostComments[data.name]
    }

    // TODO: change ACL hostname references

    acl.Hosts.$$comments = hostComments as unknown as string // funky
    acl.Hosts[data.name] = data.prefix;

    await acl.update();

    dispatch("submit");
  }

  function onReset() {
    NewData.set({
      ...host,
      comment: Acl.parseComment(Acl.formatComments(get(AclStore).Hosts)[host.name]?.[0]?.[0])
    })
  }
</script>

<Form.Root
  description="edit host"
  submitText="Save"
  action={onSubmit}
  on:reset={onReset}
  on:cancel
  let:disabled
  let:id
>
  <Form.Item>
    <Form.Item>
      <Label aria-required for={id + "-name"}>Name</Label>
      <Input required id={id + "-name"} bind:value={$NewData.name} {disabled} />
    </Form.Item>
  </Form.Item>

  <Form.Item>
    <Form.Item>
      <Label aria-required for={id + "-prefix"}>Prefix</Label>
      <Input required id={id + "-prefix"} bind:value={$NewData.prefix} {disabled} />
    </Form.Item>
  </Form.Item>

  <Form.Item>
    <Form.Item>
      <Label for={id + "-description"}>Description</Label>
      <Input id={id + "-description"} bind:value={$NewData.comment} {disabled} />
    </Form.Item>
  </Form.Item>
</Form.Root>
