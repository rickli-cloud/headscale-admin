import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { config } from 'dotenv';
config();

import pkg from './package.json';

const { HEADSCALE_HOST = "http://localhost:8000" } = process.env;

export default defineConfig(({ mode }) => {
	if (mode === 'development') {
		console.debug(`[Proxy] ^/api => ${HEADSCALE_HOST}`);
		if (!HEADSCALE_HOST) throw new Error('Environment variable HEADSCALE_HOST is required!');
	}

	return {
		plugins: [sveltekit()],
		test: {
			include: ['src/**/*.{test,spec}.{js,ts}']
		},
		server: {
			proxy: {
				'^/api': {
					target: HEADSCALE_HOST,
					changeOrigin: true,
					secure: false
				}
			}
		},
		__APP_VERSION__: pkg.version
	};
});
