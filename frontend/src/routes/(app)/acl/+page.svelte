<script>
  import hljs from "highlight.js/lib/core"
  import json from "highlight.js/lib/languages/json"
  
	import AclRules from "$lib/components/acl/AclRules.svelte";
	import Title from "$lib/components/title/title.svelte";
	import { AclStore } from "$lib/store/acl";
	import { Button } from "$lib/components/ui/button";
	import { Edit } from "lucide-svelte";
	import { base } from "$app/paths";
  
  hljs.registerLanguage("json", json)
</script>

<section>
  <AclRules />
</section>

<section>
  <Title Title="Raw policy" Description="Complete policy in HuJSON format">
    <Button variant="ghost" class="!h-[50px] !w-[50px]" href={base + "/acl/edit"}>
      <Edit />
    </Button>
  </Title>
  <pre class="whitespace-break-spaces"><code>{@html hljs.highlight($AclStore?.stringified || "", { language: "json" }).value}</code></pre>
</section>
