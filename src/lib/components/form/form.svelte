<script lang="ts">
	import type { SuperForm } from 'sveltekit-superforms';
	import type { ClassValue } from 'tailwind-variants';

	import { cn } from '$lib/utils/shadcn';
	import { Button } from '$lib/components/ui/form';

	interface $$Props extends Partial<HTMLFormElement> {
		class?: ClassValue;
		form: SuperForm<any, any>;
		resettable?: boolean;
		disabled?: boolean;
	}

	export let form: $$Props['form'];
	export let resettable: $$Props['resettable'] = true;
	export let disabled: $$Props['disabled'] = undefined;
</script>

<form
	{...$$restProps}
	class={cn('data-form mt-4 space-y-6', $$restProps.class || '')}
	use:form.enhance
	on:reset={() => form.reset()}
	on:submit
>
	<slot />

	<div class="!mt-8 flex justify-between gap-3">
		<div class="star-note text-xs text-muted-foreground">required</div>

		<div class="flex gap-2">
			{#if resettable}
				<Button type="reset" {disabled} variant="outline">Reset</Button>
			{/if}

			<Button type="submit" {disabled}>Submit</Button>
		</div>
	</div>
</form>

<style lang="postcss">
	.star-note {
		@apply invisible;
	}

	.data-form:has(*[required]),
	.data-form:has(*[aria-required='true']),
	.data-form:has(*.required) {
		& .star-note {
			@apply visible;
		}
	}

	.data-form {
		& label:has(+ *[required])::after,
		& label:has(+ *[aria-required='true'])::after,
		& label:has(+ *.required)::after,
		& .required > label::after,
		& .star-note::before {
			@apply mx-0.5;
			content: '*';
		}
	}
</style>
