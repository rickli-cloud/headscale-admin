<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { get, writable } from "svelte/store";
	import type { Selected } from "bits-ui";

  import * as Select from "$lib/components/ui/select";
	import Label from "$lib/components/ui/label/label.svelte";
	import Input from "$lib/components/ui/input/input.svelte";

	import * as Form from "$lib/components/form";
	import { Acl, type V1Policy } from "$lib/api";
	import { AclStore } from "$lib/store/acl";

	import SelectRuleTarget from "./SelectRuleTarget.svelte";

  type V1PolicyRule = V1Policy["acls"][0];

  export let rule: V1PolicyRule;
  export let index: number;

  const Data = writable<V1PolicyRule>(rule);
  const SelectedProto = writable<Selected<string>>({ label: "Accept", value: "accept"});
  const Description = writable<string>(get(AclStore).$$comments.$acls?.[index]?.[0]?.[0]);
  SelectedProto.subscribe(({ value }) => Data.update(state => ({ ...state, action: value as "accept" })));

  const dispatch = createEventDispatcher();

  async function onSubmit() {
    const acl = get(AclStore);
    const data = get(Data);
    const description = get(Description);

    if (!description) {
      if (typeof acl.$$comments.$acls?.[index] !== "undefined") {
        delete acl.$$comments.$acls[index]
      }
    } else {
      if (!acl.$$comments.$acls) acl.$$comments.$acls = {}
      acl.$$comments.$acls[index] = [[Acl.stringifyComment(description)]]
    }

    acl.acls[index] = data
    
    const { error } = await acl.update();
    if (error) throw error;

    dispatch("submit");
  }

  function onReset() {
    Data.set(rule);
  }
</script>

<Form.Root 
  description="edit access rule"
  submitText="Save"
  disableReset
  action={onSubmit}
  on:reset={onReset}
  on:cancel
>
  <Form.Item>
    <Label aria-required for="acl-rule-action">Action</Label>
    <Select.Root required name="acl-rule-action" bind:selected={$SelectedProto}>
      <Select.Trigger class="w-full">
        <Select.Value placeholder="Action" />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="accept">Accept</Select.Item>
      </Select.Content>
    </Select.Root>
  </Form.Item>

  <Form.Item>
    <Label aria-required for="acl-rule-src">Source</Label>
    <SelectRuleTarget required id="acl-rule-src" bind:selected={$Data.src} />
  </Form.Item>

  <Form.Item>
    <Label aria-required for="acl-rule-dst">Destination</Label>
    <SelectRuleTarget required id="acl-rule-dst" bind:selected={$Data.dst} />
  </Form.Item>

  <Form.Item>
    <Label for="acl-rule-proto">Protocol</Label>
    <Input bind:value={$Data.proto} />
  </Form.Item>

  <Form.Item>
    <Label for="acl-rule-proto">Description</Label>
    <Input bind:value={$Description} />
  </Form.Item>
</Form.Root>
