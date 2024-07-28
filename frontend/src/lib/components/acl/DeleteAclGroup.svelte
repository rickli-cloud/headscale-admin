<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { get } from "svelte/store";

	import ConfirmDelete from "$lib/components/general/ConfirmDelete.svelte";

	import { AclStore } from "$lib/store/acl";
	import { Acl, groupRegex } from "$lib/api";

  export let group: { name: string, members: string[] };

  const dispatch = createEventDispatcher();

  async function handleSubmit() {
    const acl = get(AclStore);

    if (typeof acl.groups[group.name] !== "undefined") {
      delete acl.groups[group.name];
    }
    
    for (const tag in acl.tagOwners) {
      if (acl.tagOwners[tag]?.length === 0) delete acl.tagOwners[tag]
      if (acl.tagOwners[tag].includes(group.name)) {
        if (acl.tagOwners[tag].length === 1) delete acl.tagOwners[tag]
        else { 
          acl.tagOwners[tag] = acl.tagOwners[tag].filter(i => i !== group.name)
        }
      }
    }

    const { error } = await acl.update();
    if (error) throw error

    dispatch("submit");
  }
</script>

<ConfirmDelete 
  description="delete group"
  data={{ ...group, description: Acl.parseComment(Acl.formatComments($AclStore.groups)[group.name]?.[0]?.[0]) }}
  phrase={group.name.replace(groupRegex, "")}
  onSubmit={handleSubmit}
  on:cancel
/>
