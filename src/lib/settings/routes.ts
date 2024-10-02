import type { ComponentProps, SvelteComponent } from 'svelte';
import type { Constructor } from 'svelte-headless-table';

import SlidersHorizontal from 'lucide-svelte/icons/sliders-horizontal';
import Network from 'lucide-svelte/icons/network';
import Server from 'lucide-svelte/icons/server';
import Users from 'lucide-svelte/icons/users';

import { base } from '$app/paths';

interface Route<T extends SvelteComponent = SvelteComponent> {
	name: string;
	path: string;
	icon: Constructor<T>;
	iconProps?: ComponentProps<T>;
	regex?: RegExp;
}

export const routes: Route[] = [
	{ path: '/', name: 'Network', icon: Network, regex: new RegExp(`^/?${base}/?$`) },
	{ path: '/users', name: 'Users', icon: Users },
	{ path: '/machines', name: 'Machines', icon: Server },
	{ path: '/settings', name: 'Settings', icon: SlidersHorizontal }
];
