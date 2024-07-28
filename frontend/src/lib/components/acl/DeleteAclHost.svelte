<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { get } from "svelte/store";

  import ConfirmDelete from "$lib/components/general/ConfirmDelete.svelte";
  
	import { AclStore } from "$lib/store/acl";
	import { Acl } from "$lib/api";

  export let host: { name: string, prefix: string }

  const dispatch = createEventDispatcher()

  async function handleSubmit() {
    const acl = get(AclStore)

    if (typeof acl.Hosts[host.name] !== "undefined") {
      delete acl.Hosts[host.name]
      await acl.update()
    }

    dispatch("submit")
  } 
</script>

<ConfirmDelete
  description="delete host"
  data={{ ...host, description: Acl.parseComment(Acl.formatComments($AclStore.Hosts)[host.name]?.[0]?.[0]) }}
  phrase={host.name}
  onSubmit={handleSubmit}
/>
