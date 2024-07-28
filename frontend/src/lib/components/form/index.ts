import Root from './form.svelte';
import Item from './form-item.svelte';

export { Root, Item };

export interface Props
	extends Omit<Partial<HTMLButtonElement>, 'onsubmit' | 'onreset' | 'oncancel'> {
	action: () => Promise<void> | void;
	description: string;
	id?: string;
	disableReset?: boolean;
	disableSubmit?: boolean;
	disableCancel?: boolean;
	disableActions?: boolean;
	/** Prevent call to invalidateAll on submit */
	disableReload?: boolean;
	disableToast?: boolean;
	disableRequired?: boolean;
	destructive?: boolean;
	submitText?: string;
	resetText?: string;
	cancelText?: string;
}
