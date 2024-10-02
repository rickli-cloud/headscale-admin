import { base } from '$app/paths';
import { env } from '$env/dynamic/public';

if (env.PUBLIC_MOCK_ENABLED === 'true') {
	const { worker } = await import('./msw/browser');

	await worker.start({
		onUnhandledRequest(request, print) {
			if (/^\/api/.test(request.url)) {
				print.warning();
			}
		},
		serviceWorker: {
			url: base + '/mockServiceWorker.js'
		}
	});
}

// TODO: handle error
