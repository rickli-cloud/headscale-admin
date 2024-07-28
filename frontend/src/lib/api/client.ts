import type { ProtobufAny, RpcStatus } from '.';

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

export interface RequestParams extends BaseRequestParams {}

export interface FullRequestParams extends BaseRequestParams {
	/** Request path */
	path: string;
	/** Path query */
	query?: URLSearchParams | Record<string, string | number | undefined | boolean>;
	/** Request body */
	body?: unknown;
	/** Response content-type */
	format?: ContentType;
	/** Request content-type */
	type?: ContentType;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
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

	protected async request<T extends unknown = unknown, E extends RpcStatus = RpcStatus>({
		format = ContentType.Text,
		...opt
	}: FullRequestParams): Promise<HttpResponse<T, ApiError>> {
		console.debug('[request]', { ...opt, format });

		const { url, params } = this.parseRequest(opt);

		const securityParams = this.config.securityWorker
			? await this.config.securityWorker(params, url)
			: {};

		const response = await this.config.fetch(url, { ...params, ...securityParams });

		const parsed = await this.parseResponse(response);

		if (typeof this.config.validationWorker === 'function') {
			await this.config.validationWorker(response, parsed);
		}

		if (response.status >= 300) {
			return {
				...response,
				error: new ApiError(parsed as E),
				data: undefined
			};
		}

		if (response.headers.get('content-type')?.split(';')[0] !== format) {
			throw new Error("Response did not match expected format '" + format + "'", {
				cause: response
			});
		}

		return {
			...response,
			data: parsed as T,
			error: undefined
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
			signal: AbortSignal.timeout(5000),
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
					throw new Error('Did not expect JSON response', { cause: response });
				}
				return await response.json();

			case ContentType.Text:
				if (format && format !== ContentType.Text) {
					throw new Error('Did not expect plain text response', { cause: response });
				}
				return response.text();

			default:
				throw new Error('Unsupported content-type!', { cause: response });
		}
	}
}

export class ApiError extends Error implements RpcStatus {
	public readonly code?: number;
	public readonly details?: ProtobufAny[];
	public readonly name: string;

	constructor(data: RpcStatus, cause?: unknown) {
		super(data.message, { cause });

		this.name = 'ApiError';
		this.details = data.details;
		this.code = data.code;

		console.log('ApiError', this, data);
	}
}
