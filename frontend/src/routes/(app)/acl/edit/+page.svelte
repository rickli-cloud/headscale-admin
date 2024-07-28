<script lang="ts">
	import { onMount } from "svelte";
  import { get, writable } from "svelte/store";

	import MonacoEditor from "$lib/components/editor/MonacoEditor.svelte";
	import * as Title from "$lib/components/title";
	import Form from "$lib/components/form/form.svelte";

	import { base } from "$app/paths";
	import { AclStore } from "$lib/store/acl";
	import { Acl } from "$lib/api";

  const Content = writable<string>(get(AclStore).stringified || "");
  const disableSave = writable<boolean>(true);
  Content.subscribe((state) => disableSave.set(state === get(AclStore).stringified));

  onMount(() => {
    window.onbeforeunload = function(ev) {
      if (get(Content) !== get(AclStore).stringified) {
        return "You have unsaved changes on this page. Do you want to leave this page and discard your changes or stay on this page?";
      }
    }

    return () => {
      window.onbeforeunload = () => void 0
    }
  })

  async function handleSave() {
    const { error } = await new Acl(get(Content)).update();
    if (error) throw error;
  }
</script>

<section>
  <Title.Root Title="Edit policy" Description="Manually edit the ACL policy">      
    <Form 
      description="save policy"
      submitText="Save"
      action={handleSave}
      on:reset={() => Content.set($AclStore.stringified || "")}
      on:cancel={() => window.location.href = base + "/acl"}
      disableSubmit={$disableSave}
      disableRequired
      disableReset
    />
  </Title.Root>
</section>

<section class="-m-8" id="editor">
  <MonacoEditor {Content} />
</section>
