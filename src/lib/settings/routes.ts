import Network from 'lucide-svelte/icons/network';
import Users from 'lucide-svelte/icons/users';
import Server from 'lucide-svelte/icons/server';
import SlidersHorizontal from 'lucide-svelte/icons/sliders-horizontal';

import { base } from '$app/paths';

import type { SvelteComponent } from 'svelte';

interface Route {
	name: string;
	path: string;
	icon: Partial<SvelteComponent>;
	regex?: RegExp;
}

export const routes: Route[] = [
	{ path: '/', name: 'Network', icon: Network, regex: new RegExp(`^/?${base}/?$`) },
	{ path: '/users', name: 'Users', icon: Users },
	{ path: '/machines', name: 'Machines', icon: Server },
	{ path: '/settings', name: 'Settings', icon: SlidersHorizontal }
];
