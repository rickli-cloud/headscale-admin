<script lang="ts">
  import CircleAlert from "lucide-svelte/icons/circle-alert";
  import yaml from "yaml"

	import * as Alert from "$lib/components/ui/alert";

	import type { ApiError } from "$lib/api/client";

  export let errors: (ApiError | undefined)[];

  const filteredErrors = errors?.filter(i => typeof i !== "undefined" && i !== null)

  function parseStack(stack: string | undefined, index = 2): string {
    return stack?.split(/\n/gm)?.[index]?.trim()?.replaceAll(/^(async\*)?headscaleService|@.*/gm, "") || "Anonymous"
  }
</script>


{#if filteredErrors?.length}
<section class="space-y-2.5">
  {#each filteredErrors as error}
  <Alert.Root variant="destructive" class="items-center">
    <CircleAlert class="h-4 w-4" />
    
    <Alert.Title>API error</Alert.Title>
    
    <Alert.Description>
      {parseStack(error?.stack)}:

      {error?.message || "Internal error"}

      {#if error?.code}
        #{error?.code}
      {/if}
    </Alert.Description>

    {#if error?.details?.length}
      {#each error.details as detail}
      <Alert.Description class="mt-2">
        <pre><code>{yaml.stringify(detail, null, 2)}</code></pre>
      </Alert.Description>
      {/each}
    {/if}
    </Alert.Root>
  {/each}
</section>
{/if}
