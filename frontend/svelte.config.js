import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

import dotenv from 'dotenv';
dotenv.config();

/** @type {typeof import("./package.json")}; */
const pkg = JSON.parse(
	readFileSync(fileURLToPath(new URL('package.json', import.meta.url)), 'utf8')
);

const { BASE_PATH = "/admin" } = process.env;

if (BASE_PATH && !BASE_PATH.startsWith('/')) {
	throw new Error("env BASE_PATH does not seem to be a path. A path must start with '/'.");
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			fallback: 'index.html'
		}),
		paths: {
			base: BASE_PATH
			// assets: '/static'
		},
		version: {
			name: pkg.version
		}
	}
};

export default config;
