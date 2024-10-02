export * from './headscale';
export type * from './headscale.d';

export class ApiError extends Error {
	public readonly code?: number;
	public readonly name: string;
	public readonly message: string;

	constructor(data: { message?: string }) {
		super(data.message);

		this.message = data.message || 'Internal server error';
		this.name = 'ApiError';

		console.log('ApiError', this);
	}
}
