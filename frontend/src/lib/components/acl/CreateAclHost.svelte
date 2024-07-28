<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import * as Form from "$lib/components/form";

  import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { get, writable } from "svelte/store";
	import { AclStore } from "$lib/store/acl";
	import { Acl } from "$lib/api";

  const Data = writable({ name: "", prefix: "", description: "" });

  const dispatch = createEventDispatcher();

  async function handleSubmit() {
    const acl = get(AclStore);
    const data = get(Data);

    if (typeof acl.Hosts[data.name] !== "undefined") {
      throw new Error("Host name already exists")
    }

    acl.Hosts[data.name] = data.prefix;

    if (data.description) {
      const comments = Acl.formatComments(acl.Hosts)
      comments[data.name] = [[Acl.stringifyComment(data.description)]]
      acl.Hosts.$$comments = comments as unknown as string // funky
    }

    console.debug({ acl })

    const result = await acl.update()

    if (result.error) throw result.error;
    if (result.data) AclStore.set(result.data)

    dispatch("submit");
  }

  function handleReset() {
    Data.set({ name: "", prefix: "", description: "" });
  }
</script>


<Form.Root
  description="create host"
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
    <Label aria-required for={id + "-prefix"}>Prefix</Label>
		<Input required id={id + "-prefix"} bind:value={$Data.prefix} {disabled} />
  </Form.Item>

  <Form.Item>
    <Label for={id + "-description"}>Description</Label>
    <Input id={id + "-description"} bind:value={$Data.description} {disabled} />
  </Form.Item>
</Form.Root>
