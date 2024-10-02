import { env } from '$env/dynamic/public';

if (env.PUBLIC_MOCK_ENABLED === 'true') {
	const { server } = await import('./msw/node');

	console.debug('[MSW] Mocking API');

	server.listen();
}
