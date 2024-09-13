import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { config } from 'dotenv';

import pkg from './package.json';

config();
const { HEADSCALE_HOST = 'http://localhost:8080' } = process.env;

export default defineConfig(({ mode }) => {
	if (mode === 'development') {
		if (!HEADSCALE_HOST) throw new Error('Environment variable HEADSCALE_HOST is required!');
		console.debug(`[Proxy] ^/api => ${HEADSCALE_HOST}`);
	}

	return {
		__APP_VERSION__: pkg.version,
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
		}
	};
});
