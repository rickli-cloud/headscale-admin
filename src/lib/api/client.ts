import type { ProtobufAny, RpcStatus } from './index.d';

export type SecurityWorker = (cfg: RequestInit, path: URL) => RequestInit | Promise<RequestInit>;
export type ValidationWorker = (res: Response, data: unknown) => void | Promise<void>;

export interface ApiClientConstructorParameters {
	baseUrl?: string;
	fetch?: typeof fetch;
	securityWorker?: SecurityWorker;
	validationWorker?: ValidationWorker;
}

export enum ContentType {
	Json = 'application/json',
	Text = 'text/plain'
}

type BaseRequestParams = Omit<RequestInit, 'body'>;

/** Protected parameters for dynamic options */
export interface RequestParams extends BaseRequestParams {
	/** Request Timeout in ms @default 5000 */
	timeout?: number;
	/** Throw errors? @default false */
	throw?: boolean;
}

export interface FullRequestParams extends RequestParams {
	/** Request path */
	path: string;
	/** Request path query */
	query?: URLSearchParams | Record<string, string | number | undefined | boolean>;
	/** Request body */
	body?: unknown;
	/** Request content-type */
	type?: ContentType;
	/** Response content-type */
	format?: ContentType;
}

export interface HttpResponse<D, E = unknown> extends Response {
	data?: D;
	error?: E;
}

export class ApiClient {
	public config: {
		baseUrl?: string;
		fetch: typeof fetch;
		securityWorker?: SecurityWorker;
		validationWorker?: ValidationWorker;
	};

	public constructor(data: ApiClientConstructorParameters = {}) {
		this.config = {
			baseUrl: data.baseUrl,
			fetch: data.fetch || fetch,
			securityWorker: data.securityWorker,
			validationWorker: data.validationWorker
		};
	}

	protected async request<T = unknown, E extends RpcStatus = RpcStatus>({
		format = ContentType.Text,
		...opt
	}: FullRequestParams): Promise<HttpResponse<T, ApiError>> {
		console.debug('[request]', { ...opt, format });

		const { url, params } = this.parseRequest(opt);

		const securityParams = this.config.securityWorker ? await this.config.securityWorker(params, url) : {};

		const response = await this.config.fetch(url, { ...params, ...securityParams });

		let parsed: unknown;

		try {
			parsed = await this.parseResponse(response);
		} catch (err) {
			const error = new ApiError(err as RpcStatus, { ...opt, format });

			if (opt.throw === true) throw error;

			return {
				...response,
				error
			};
		}

		if (typeof this.config.validationWorker === 'function') {
			await this.config.validationWorker(response, parsed);
		}

		if (response.status >= 300) {
			const error = new ApiError(parsed as E, { ...opt, format });

			if (opt.throw === true) throw error;

			return {
				...response,
				error
			};
		}

		return {
			...response,
			data: parsed as T
		};
	}

	private parseRequest({ path, query, body, type = ContentType.Text, ...opt }: FullRequestParams): {
		url: URL;
		params: RequestInit;
	} {
		const url = new URL(path, this.config.baseUrl || window.location.href);

		if (query instanceof URLSearchParams) {
			url.search = query.toString();
		} else if (typeof query === 'object') {
			for (const key in query) {
				if (typeof query[key] === 'undefined') delete query[key];
				if (typeof query[key] !== 'string') query[key] = String(query[key]);
			}

			url.search = new URLSearchParams(query as { [x: string]: string }).toString();
		}

		const params: RequestInit = {
			signal: AbortSignal.timeout(opt.timeout || 5000),
			...opt,
			body: typeof body === 'undefined' || body === null ? undefined : JSON.stringify(body),
			headers: {
				Accept: Object.values(ContentType).join(','),
				...(opt.headers || {}),
				'Content-Type': type
			}
		};

		return { url, params };
	}

	private async parseResponse(response: Response, format?: ContentType): Promise<unknown> {
		switch (response.headers.get('content-type')?.split(';')[0]) {
			case ContentType.Json:
				if (format && format !== ContentType.Json) {
					throw new Error('Received response with Invalid content-type. Did not expect JSON response', { cause: response });
				}
				return await response.json();

			case ContentType.Text:
				if (format && format !== ContentType.Text) {
					throw new Error('Received response with Invalid content-type. Did not expect plain text response', {
						cause: response
					});
				}
				return response.text();

			default:
				throw new Error(
					`Received response with unsupported content-type "${response.headers.get('content-type')?.split(';')[0]}"`,
					{ cause: response }
				);
		}
	}
}

export class ApiError extends Error implements RpcStatus {
	public readonly code?: number;
	public readonly details?: ProtobufAny[];
	public readonly name: string;
	public readonly cause: FullRequestParams;
	public readonly message: string;

	constructor(data: RpcStatus, cause: FullRequestParams) {
		super(data.message, { cause });

		this.message = data.message || 'Internal server error';
		this.name = 'ApiError';
		this.details = data.details;
		this.code = data.code;
		this.cause = cause;

		console.log('ApiError', this);
	}
}
