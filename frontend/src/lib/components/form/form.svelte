<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { writable } from "svelte/store";
	import { toast } from "svelte-sonner";
	import Check from "lucide-svelte/icons/check";
	import X from "lucide-svelte/icons/x";

	import { Button } from '$lib/components/ui/button/index.js';

	import { invalidateAll } from "$app/navigation";
	import type { Props } from "./index";
	import { cn } from "$lib/utils";
	import { ApiError } from "$lib/api/client";

  type $$Props = Props;

  export let action: $$Props["action"];
  export let description: $$Props["description"] = "complete action";
  export let id: $$Props["id"] = window.crypto.randomUUID();
	export let disableRequired: $$Props["disableRequired"] = false;
	export let disableActions: $$Props["disableActions"] = false;
	export let disableSubmit: $$Props["disableSubmit"] = false;
	export let disableReload: $$Props["disableReload"] = false;
	export let disableCancel: $$Props["disableCancel"] = false;
	export let disableToast: $$Props["disableToast"] = false;
	export let disableReset: $$Props["disableReset"] = false;
	export let destructive: $$Props["destructive"] = false;
	export let submitText: $$Props["submitText"] = 'Submit';
	export let resetText: $$Props["resetText"] = 'Reset';
	export let cancelText: $$Props["cancelText"] = 'Cancel';

  const dispatch = createEventDispatcher()
  const Disabled = writable(false)

  async function handleSubmit(ev: Event) {
    try {
      await action();
    } catch (err) {
			console.error(err);
      dispatch("error", err);

			const errorMessage = err instanceof ApiError && typeof err.code !== "undefined"
				? `#${err.code} ${err.toString()}`
				: err instanceof Error
				? err.toString()
				: err;

      toast(
        "Failed to " + description + ": " + errorMessage,
        { class: "!bg-red-600 !text-white", icon: X }
      );

      return;
    }

    if (!disableReload) await invalidateAll();

    if (!disableToast) toast("Successful: " + description, { class: "!bg-green-600 !text-white", icon: Check });
    
    dispatch("submit", ev);
  }
</script>

<form
  id={"form-" + id}
	class={cn("w-full grid items-center gap-5", $$restProps["class"])}
  {...$$restProps}
  on:submit={handleSubmit}
  on:reset
  on:cancel
>
  <slot {id} submit={handleSubmit} disabled={$Disabled} />

	{#if !disableActions}
		<div 
			class="mt-4 flex justify-between items-center gap-3 first:mt-0"
			class:!justify-end={disableRequired}
		>
			<slot name="note">
				{#if !disableRequired}
					<p class="star-note self-start text-xs text-muted-foreground">Required</p>
				{/if}
			</slot>

			<div class="flex gap-2">
				{#if !disableCancel}
					<Button variant="outline" on:click={(ev) => dispatch("cancel", ev)}>
						{cancelText}
					</Button>
				{/if}

				{#if !disableReset}
					<Button variant="outline" type="reset" disabled={$Disabled}>
						{resetText}
					</Button>
				{/if}

				<Button
					type="submit"
					disabled={$Disabled || disableSubmit}
					variant={destructive ? 'destructive' : 'default'}
				>
					{submitText}
				</Button>
			</div>
		</div>
	{/if}
</form>