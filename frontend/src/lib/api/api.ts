/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ProtobufAny {
	'@type'?: string;
	[key: string]: any;
}

export interface RpcStatus {
	/** @format int32 */
	code?: number;
	message?: string;
	details?: ProtobufAny[];
}

export interface V1ApiKey {
	/** @format uint64 */
	id?: string;
	prefix?: string;
	/** @format date-time */
	expiration?: string;
	/** @format date-time */
	createdAt?: string;
	/** @format date-time */
	lastSeen?: string;
}

export interface V1CreateApiKeyRequest {
	/** @format date-time */
	expiration?: string;
}

export interface V1CreateApiKeyResponse {
	apiKey?: string;
}

export interface V1CreatePreAuthKeyRequest {
	user?: string;
	reusable?: boolean;
	ephemeral?: boolean;
	/** @format date-time */
	expiration?: string;
	aclTags?: string[];
}

export interface V1CreatePreAuthKeyResponse {
	preAuthKey?: V1PreAuthKey;
}

export interface V1CreateUserRequest {
	name?: string;
}

export interface V1CreateUserResponse {
	user?: V1User;
}

export interface V1DebugCreateMachineRequest {
	user?: string;
	key?: string;
	name?: string;
	routes?: string[];
}

export interface V1DebugCreateMachineResponse {
	machine?: V1Machine;
}

export type V1DeleteMachineResponse = object;

export type V1DeleteRouteResponse = object;

export type V1DeleteUserResponse = object;

export type V1DisableRouteResponse = object;

export type V1EnableRouteResponse = object;

export interface V1ExpireApiKeyRequest {
	prefix?: string;
}

export type V1ExpireApiKeyResponse = object;

export interface V1ExpireMachineResponse {
	machine?: V1Machine;
}

export interface V1ExpirePreAuthKeyRequest {
	user?: string;
	key?: string;
}

export type V1ExpirePreAuthKeyResponse = object;

export interface V1GetMachineResponse {
	machine?: V1Machine;
}

export interface V1GetMachineRoutesResponse {
	routes?: V1Route[];
}

export interface V1GetRoutesResponse {
	routes?: V1Route[];
}

export interface V1GetUserResponse {
	user?: V1User;
}

export interface V1ListApiKeysResponse {
	apiKeys?: V1ApiKey[];
}

export interface V1ListMachinesResponse {
	machines?: V1Machine[];
}

export interface V1ListPreAuthKeysResponse {
	preAuthKeys?: V1PreAuthKey[];
}

export interface V1ListUsersResponse {
	users?: V1User[];
}

export interface V1Machine {
	/** @format uint64 */
	id?: string;
	machineKey?: string;
	nodeKey?: string;
	discoKey?: string;
	ipAddresses?: string[];
	name?: string;
	user?: V1User;
	/** @format date-time */
	lastSeen?: string;
	/** @format date-time */
	lastSuccessfulUpdate?: string;
	/** @format date-time */
	expiry?: string;
	preAuthKey?: V1PreAuthKey;
	/** @format date-time */
	createdAt?: string;
	registerMethod?: V1RegisterMethod;
	forcedTags?: string[];
	invalidTags?: string[];
	validTags?: string[];
	givenName?: string;
	online?: boolean;
}

export interface V1MoveMachineResponse {
	machine?: V1Machine;
}

export interface V1PreAuthKey {
	user?: string;
	id?: string;
	key?: string;
	reusable?: boolean;
	ephemeral?: boolean;
	used?: boolean;
	/** @format date-time */
	expiration?: string;
	/** @format date-time */
	createdAt?: string;
	aclTags?: string[];
}

export interface V1RegisterMachineResponse {
	machine?: V1Machine;
}

/** @default "REGISTER_METHOD_UNSPECIFIED" */
export enum V1RegisterMethod {
	REGISTER_METHOD_UNSPECIFIED = 'REGISTER_METHOD_UNSPECIFIED',
	REGISTER_METHOD_AUTH_KEY = 'REGISTER_METHOD_AUTH_KEY',
	REGISTER_METHOD_CLI = 'REGISTER_METHOD_CLI',
	REGISTER_METHOD_OIDC = 'REGISTER_METHOD_OIDC'
}

export interface V1RenameMachineResponse {
	machine?: V1Machine;
}

export interface V1RenameUserResponse {
	user?: V1User;
}

export interface V1Route {
	/** @format uint64 */
	id?: string;
	machine?: V1Machine;
	prefix?: string;
	advertised?: boolean;
	enabled?: boolean;
	isPrimary?: boolean;
	/** @format date-time */
	createdAt?: string;
	/** @format date-time */
	updatedAt?: string;
	/** @format date-time */
	deletedAt?: string;
}

export interface V1SetTagsResponse {
	machine?: V1Machine;
}

export interface V1User {
	id?: string;
	name?: string;
	/** @format date-time */
	createdAt?: string;
}

import type {
	AxiosInstance,
	AxiosRequestConfig,
	AxiosResponse,
	HeadersDefaults,
	ResponseType
} from 'axios';
import axios from 'axios';

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
	extends Omit<AxiosRequestConfig, 'data' | 'params' | 'url' | 'responseType'> {
	/** set parameter to `true` for call `securityWorker` for this request */
	secure?: boolean;
	/** request path */
	path: string;
	/** content type of request body */
	type?: ContentType;
	/** query params */
	query?: QueryParamsType;
	/** format of response (i.e. response.json() -> format: "json") */
	format?: ResponseType;
	/** request body */
	body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

export interface ApiConfig<SecurityDataType = unknown>
	extends Omit<AxiosRequestConfig, 'data' | 'cancelToken'> {
	securityWorker?: (
		securityData: SecurityDataType | null
	) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
	secure?: boolean;
	format?: ResponseType;
}

export enum ContentType {
	Json = 'application/json',
	FormData = 'multipart/form-data',
	UrlEncoded = 'application/x-www-form-urlencoded',
	Text = 'text/plain'
}

export class HttpClient<SecurityDataType = unknown> {
	public instance: AxiosInstance;
	private securityData: SecurityDataType | null = null;
	private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
	private secure?: boolean;
	private format?: ResponseType;

	constructor({
		securityWorker,
		secure,
		format,
		...axiosConfig
	}: ApiConfig<SecurityDataType> = {}) {
		this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || '' });
		this.secure = secure;
		this.format = format;
		this.securityWorker = securityWorker;
	}

	public setSecurityData = (data: SecurityDataType | null) => {
		this.securityData = data;
	};

	protected mergeRequestParams(
		params1: AxiosRequestConfig,
		params2?: AxiosRequestConfig
	): AxiosRequestConfig {
		const method = params1.method || (params2 && params2.method);

		return {
			...this.instance.defaults,
			...params1,
			...(params2 || {}),
			headers: {
				...((method &&
					this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) ||
					{}),
				...(params1.headers || {}),
				...((params2 && params2.headers) || {})
			}
		};
	}

	protected stringifyFormItem(formItem: unknown) {
		if (typeof formItem === 'object' && formItem !== null) {
			return JSON.stringify(formItem);
		} else {
			return `${formItem}`;
		}
	}

	protected createFormData(input: Record<string, unknown>): FormData {
		return Object.keys(input || {}).reduce((formData, key) => {
			const property = input[key];
			const propertyContent: any[] = property instanceof Array ? property : [property];

			for (const formItem of propertyContent) {
				const isFileType = formItem instanceof Blob || formItem instanceof File;
				formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
			}

			return formData;
		}, new FormData());
	}

	public request = async <T = any, _E = any>({
		secure,
		path,
		type,
		query,
		format,
		body,
		...params
	}: FullRequestParams): Promise<AxiosResponse<T>> => {
		const secureParams =
			((typeof secure === 'boolean' ? secure : this.secure) &&
				this.securityWorker &&
				(await this.securityWorker(this.securityData))) ||
			{};
		const requestParams = this.mergeRequestParams(params, secureParams);
		const responseFormat = format || this.format || undefined;

		if (type === ContentType.FormData && body && body !== null && typeof body === 'object') {
			body = this.createFormData(body as Record<string, unknown>);
		}

		if (type === ContentType.Text && body && body !== null && typeof body !== 'string') {
			body = JSON.stringify(body);
		}

		return this.instance.request({
			...requestParams,
			headers: {
				...(requestParams.headers || {}),
				...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {})
			},
			params: query,
			responseType: responseFormat,
			data: body,
			url: path
		});
	};
}

/**
 * @title headscale/v1/headscale.proto
 * @version version not set
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
	api = {
		/**
		 * No description
		 *
		 * @tags HeadscaleService
		 * @name HeadscaleServiceListApiKeys
		 * @request GET:/api/v1/apikey
		 */
		headscaleServiceListApiKeys: (params: RequestParams = {}) =>
			this.request<V1ListApiKeysResponse, RpcStatus>({
				path: `/api/v1/apikey`,
				method: 'GET',
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags HeadscaleService
		 * @name HeadscaleServiceCreateApiKey
		 * @summary --- ApiKeys start ---
		 * @request POST:/api/v1/apikey
		 */
		headscaleServiceCreateApiKey: (body: V1CreateApiKeyRequest, params: RequestParams = {}) =>
			this.request<V1CreateApiKeyResponse, RpcStatus>({
				path: `/api/v1/apikey`,
				method: 'POST',
				body: body,
				type: ContentType.Json,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags HeadscaleService
		 * @name HeadscaleServiceExpireApiKey
		 * @request POST:/api/v1/apikey/expire
		 */
		headscaleServiceExpireApiKey: (body: V1ExpireApiKeyRequest, params: RequestParams = {}) =>
			this.request<V1ExpireApiKeyResponse, RpcStatus>({
				path: `/api/v1/apikey/expire`,
				method: 'POST',
				body: body,
				type: ContentType.Json,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags HeadscaleService
		 * @name HeadscaleServiceDebugCreateMachine
		 * @summary --- Machine start ---
		 * @request POST:/api/v1/debug/machine
		 */
		headscaleServiceDebugCreateMachine: (
			body: V1DebugCreateMachineRequest,
			params: RequestParams = {}
		) =>
			this.request<V1DebugCreateMachineResponse, RpcStatus>({
				path: `/api/v1/debug/machine`,
				method: 'POST',
				body: body,
				type: ContentType.Json,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags HeadscaleService
		 * @name HeadscaleServiceListMachines
		 * @request GET:/api/v1/machine
		 */
		headscaleServiceListMachines: (
			query?: {
				user?: string;
			},
			params: RequestParams = {}
		) =>
			this.request<V1ListMachinesResponse, RpcStatus>({
				path: `/api/v1/machine`,
				method: 'GET',
				query: query,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags HeadscaleService
		 * @name HeadscaleServiceRegisterMachine
		 * @request POST:/api/v1/machine/register
		 */
		headscaleServiceRegisterMachine: (
			query?: {
				user?: string;
				key?: string;
			},
			params: RequestParams = {}
		) =>
			this.request<V1RegisterMachineResponse, RpcStatus>({
				path: `/api/v1/machine/register`,
				method: 'POST',
				query: query,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags HeadscaleService
		 * @name HeadscaleServiceGetMachine
		 * @request GET:/api/v1/machine/{machineId}
		 */
		headscaleServiceGetMachine: (machineId: string, params: RequestParams = {}) =>
			this.request<V1GetMachineResponse, RpcStatus>({
				path: `/api/v1/machine/${machineId}`,
				method: 'GET',
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags HeadscaleService
		 * @name HeadscaleServiceDeleteMachine
		 * @request DELETE:/api/v1/machine/{machineId}
		 */
		headscaleServiceDeleteMachine: (machineId: string, params: RequestParams = {}) =>
			this.request<V1DeleteMachineResponse, RpcStatus>({
				path: `/api/v1/machine/${machineId}`,
				method: 'DELETE',
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags HeadscaleService
		 * @name HeadscaleServiceExpireMachine
		 * @request POST:/api/v1/machine/{machineId}/expire
		 */
		headscaleServiceExpireMachine: (machineId: string, params: RequestParams = {}) =>
			this.request<V1ExpireMachineResponse, RpcStatus>({
				path: `/api/v1/machine/${machineId}/expire`,
				method: 'POST',
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags HeadscaleService
		 * @name HeadscaleServiceRenameMachine
		 * @request POST:/api/v1/machine/{machineId}/rename/{newName}
		 */
		headscaleServiceRenameMachine: (
			machineId: string,
			newName: string,
			params: RequestParams = {}
		) =>
			this.request<V1RenameMachineResponse, RpcStatus>({
				path: `/api/v1/machine/${machineId}/rename/${newName}`,
				method: 'POST',
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags HeadscaleService
		 * @name HeadscaleServiceGetMachineRoutes
		 * @request GET:/api/v1/machine/{machineId}/routes
		 */
		headscaleServiceGetMachineRoutes: (machineId: string, params: RequestParams = {}) =>
			this.request<V1GetMachineRoutesResponse, RpcStatus>({
				path: `/api/v1/machine/${machineId}/routes`,
				method: 'GET',
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags HeadscaleService
		 * @name HeadscaleServiceSetTags
		 * @request POST:/api/v1/machine/{machineId}/tags
		 */
		headscaleServiceSetTags: (
			machineId: string,
			body: {
				tags?: string[];
			},
			params: RequestParams = {}
		) =>
			this.request<V1SetTagsResponse, RpcStatus>({
				path: `/api/v1/machine/${machineId}/tags`,
				method: 'POST',
				body: body,
				type: ContentType.Json,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags HeadscaleService
		 * @name HeadscaleServiceMoveMachine
		 * @request POST:/api/v1/machine/{machineId}/user
		 */
		headscaleServiceMoveMachine: (
			machineId: string,
			query?: {
				user?: string;
			},
			params: RequestParams = {}
		) =>
			this.request<V1MoveMachineResponse, RpcStatus>({
				path: `/api/v1/machine/${machineId}/user`,
				method: 'POST',
				query: query,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags HeadscaleService
		 * @name HeadscaleServiceListPreAuthKeys
		 * @request GET:/api/v1/preauthkey
		 */
		headscaleServiceListPreAuthKeys: (
			query?: {
				user?: string;
			},
			params: RequestParams = {}
		) =>
			this.request<V1ListPreAuthKeysResponse, RpcStatus>({
				path: `/api/v1/preauthkey`,
				method: 'GET',
				query: query,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags HeadscaleService
		 * @name HeadscaleServiceCreatePreAuthKey
		 * @summary --- PreAuthKeys start ---
		 * @request POST:/api/v1/preauthkey
		 */
		headscaleServiceCreatePreAuthKey: (
			body: V1CreatePreAuthKeyRequest,
			params: RequestParams = {}
		) =>
			this.request<V1CreatePreAuthKeyResponse, RpcStatus>({
				path: `/api/v1/preauthkey`,
				method: 'POST',
				body: body,
				type: ContentType.Json,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags HeadscaleService
		 * @name HeadscaleServiceExpirePreAuthKey
		 * @request POST:/api/v1/preauthkey/expire
		 */
		headscaleServiceExpirePreAuthKey: (
			body: V1ExpirePreAuthKeyRequest,
			params: RequestParams = {}
		) =>
			this.request<V1ExpirePreAuthKeyResponse, RpcStatus>({
				path: `/api/v1/preauthkey/expire`,
				method: 'POST',
				body: body,
				type: ContentType.Json,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags HeadscaleService
		 * @name HeadscaleServiceGetRoutes
		 * @summary --- Route start ---
		 * @request GET:/api/v1/routes
		 */
		headscaleServiceGetRoutes: (params: RequestParams = {}) =>
			this.request<V1GetRoutesResponse, RpcStatus>({
				path: `/api/v1/routes`,
				method: 'GET',
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags HeadscaleService
		 * @name HeadscaleServiceDeleteRoute
		 * @request DELETE:/api/v1/routes/{routeId}
		 */
		headscaleServiceDeleteRoute: (routeId: string, params: RequestParams = {}) =>
			this.request<V1DeleteRouteResponse, RpcStatus>({
				path: `/api/v1/routes/${routeId}`,
				method: 'DELETE',
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags HeadscaleService
		 * @name HeadscaleServiceDisableRoute
		 * @request POST:/api/v1/routes/{routeId}/disable
		 */
		headscaleServiceDisableRoute: (routeId: string, params: RequestParams = {}) =>
			this.request<V1DisableRouteResponse, RpcStatus>({
				path: `/api/v1/routes/${routeId}/disable`,
				method: 'POST',
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags HeadscaleService
		 * @name HeadscaleServiceEnableRoute
		 * @request POST:/api/v1/routes/{routeId}/enable
		 */
		headscaleServiceEnableRoute: (routeId: string, params: RequestParams = {}) =>
			this.request<V1EnableRouteResponse, RpcStatus>({
				path: `/api/v1/routes/${routeId}/enable`,
				method: 'POST',
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags HeadscaleService
		 * @name HeadscaleServiceListUsers
		 * @request GET:/api/v1/user
		 */
		headscaleServiceListUsers: (params: RequestParams = {}) =>
			this.request<V1ListUsersResponse, RpcStatus>({
				path: `/api/v1/user`,
				method: 'GET',
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags HeadscaleService
		 * @name HeadscaleServiceCreateUser
		 * @request POST:/api/v1/user
		 */
		headscaleServiceCreateUser: (body: V1CreateUserRequest, params: RequestParams = {}) =>
			this.request<V1CreateUserResponse, RpcStatus>({
				path: `/api/v1/user`,
				method: 'POST',
				body: body,
				type: ContentType.Json,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags HeadscaleService
		 * @name HeadscaleServiceGetUser
		 * @summary --- User start ---
		 * @request GET:/api/v1/user/{name}
		 */
		headscaleServiceGetUser: (name: string, params: RequestParams = {}) =>
			this.request<V1GetUserResponse, RpcStatus>({
				path: `/api/v1/user/${name}`,
				method: 'GET',
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags HeadscaleService
		 * @name HeadscaleServiceDeleteUser
		 * @request DELETE:/api/v1/user/{name}
		 */
		headscaleServiceDeleteUser: (name: string, params: RequestParams = {}) =>
			this.request<V1DeleteUserResponse, RpcStatus>({
				path: `/api/v1/user/${name}`,
				method: 'DELETE',
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags HeadscaleService
		 * @name HeadscaleServiceRenameUser
		 * @request POST:/api/v1/user/{oldName}/rename/{newName}
		 */
		headscaleServiceRenameUser: (oldName: string, newName: string, params: RequestParams = {}) =>
			this.request<V1RenameUserResponse, RpcStatus>({
				path: `/api/v1/user/${oldName}/rename/${newName}`,
				method: 'POST',
				format: 'json',
				...params
			})
	};
}
