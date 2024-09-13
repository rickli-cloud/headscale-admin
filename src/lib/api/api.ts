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

import type {
	RpcStatus,
	V1BackfillNodeIPsResponse,
	V1CreateApiKeyRequest,
	V1CreateApiKeyResponse,
	V1CreatePreAuthKeyRequest,
	V1CreatePreAuthKeyResponse,
	V1CreateUserRequest,
	V1CreateUserResponse,
	V1DebugCreateNodeRequest,
	V1DebugCreateNodeResponse,
	V1DeleteApiKeyResponse,
	V1DeleteNodeResponse,
	V1DeleteRouteResponse,
	V1DeleteUserResponse,
	V1DisableRouteResponse,
	V1EnableRouteResponse,
	V1ExpireApiKeyRequest,
	V1ExpireApiKeyResponse,
	V1ExpireNodeResponse,
	V1ExpirePreAuthKeyRequest,
	V1ExpirePreAuthKeyResponse,
	V1GetNodeResponse,
	V1GetNodeRoutesResponse,
	V1GetPolicyResponse,
	V1GetRoutesResponse,
	V1GetUserResponse,
	V1ListApiKeysResponse,
	V1ListNodesResponse,
	V1ListPreAuthKeysResponse,
	V1ListUsersResponse,
	V1MoveNodeResponse,
	V1RegisterNodeResponse,
	V1RenameNodeResponse,
	V1RenameUserResponse,
	V1SetPolicyRequest,
	V1SetPolicyResponse,
	V1SetTagsResponse
} from './index.d';

import { ApiClient, ContentType, type RequestParams } from './client';

export class Api extends ApiClient {
	/**
	 * No description
	 *
	 * @tags HeadscaleService
	 * @name HeadscaleServiceListApiKeys
	 * @request GET:/api/v1/apikey
	 */
	headscaleServiceListApiKeys = (params: RequestParams = {}) =>
		this.request<V1ListApiKeysResponse, RpcStatus>({
			path: `/api/v1/apikey`,
			method: 'GET',
			format: ContentType.Json,
			...params
		});
	/**
	 * No description
	 *
	 * @tags HeadscaleService
	 * @name HeadscaleServiceCreateApiKey
	 * @summary --- ApiKeys start ---
	 * @request POST:/api/v1/apikey
	 */
	headscaleServiceCreateApiKey = (body: V1CreateApiKeyRequest, params: RequestParams = {}) =>
		this.request<V1CreateApiKeyResponse, RpcStatus>({
			path: `/api/v1/apikey`,
			method: 'POST',
			body: body,
			type: ContentType.Json,
			format: ContentType.Json,
			...params
		});
	/**
	 * No description
	 *
	 * @tags HeadscaleService
	 * @name HeadscaleServiceExpireApiKey
	 * @request POST:/api/v1/apikey/expire
	 */
	headscaleServiceExpireApiKey = (body: V1ExpireApiKeyRequest, params: RequestParams = {}) =>
		this.request<V1ExpireApiKeyResponse, RpcStatus>({
			path: `/api/v1/apikey/expire`,
			method: 'POST',
			body: body,
			type: ContentType.Json,
			format: ContentType.Json,
			...params
		});
	/**
	 * No description
	 *
	 * @tags HeadscaleService
	 * @name HeadscaleServiceDeleteApiKey
	 * @request DELETE:/api/v1/apikey/{prefix}
	 */
	headscaleServiceDeleteApiKey = (prefix: string, params: RequestParams = {}) =>
		this.request<V1DeleteApiKeyResponse, RpcStatus>({
			path: `/api/v1/apikey/${prefix}`,
			method: 'DELETE',
			format: ContentType.Json,
			...params
		});
	/**
	 * No description
	 *
	 * @tags HeadscaleService
	 * @name HeadscaleServiceDebugCreateNode
	 * @summary --- Node start ---
	 * @request POST:/api/v1/debug/node
	 */
	headscaleServiceDebugCreateNode = (body: V1DebugCreateNodeRequest, params: RequestParams = {}) =>
		this.request<V1DebugCreateNodeResponse, RpcStatus>({
			path: `/api/v1/debug/node`,
			method: 'POST',
			body: body,
			type: ContentType.Json,
			format: ContentType.Json,
			...params
		});
	/**
	 * No description
	 *
	 * @tags HeadscaleService
	 * @name HeadscaleServiceListNodes
	 * @request GET:/api/v1/node
	 */
	headscaleServiceListNodes = (
		query?: {
			user?: string;
		},
		params: RequestParams = {}
	) =>
		this.request<V1ListNodesResponse, RpcStatus>({
			path: `/api/v1/node`,
			method: 'GET',
			query: query,
			format: ContentType.Json,
			...params
		});
	/**
	 * No description
	 *
	 * @tags HeadscaleService
	 * @name HeadscaleServiceBackfillNodeIPs
	 * @request POST:/api/v1/node/backfillips
	 */
	headscaleServiceBackfillNodeIPs = (
		query?: {
			confirmed?: boolean;
		},
		params: RequestParams = {}
	) =>
		this.request<V1BackfillNodeIPsResponse, RpcStatus>({
			path: `/api/v1/node/backfillips`,
			method: 'POST',
			query: query,
			format: ContentType.Json,
			...params
		});
	/**
	 * No description
	 *
	 * @tags HeadscaleService
	 * @name HeadscaleServiceRegisterNode
	 * @request POST:/api/v1/node/register
	 */
	headscaleServiceRegisterNode = (
		query?: {
			user?: string;
			key?: string;
		},
		params: RequestParams = {}
	) =>
		this.request<V1RegisterNodeResponse, RpcStatus>({
			path: `/api/v1/node/register`,
			method: 'POST',
			query: query,
			format: ContentType.Json,
			...params
		});
	/**
	 * No description
	 *
	 * @tags HeadscaleService
	 * @name HeadscaleServiceGetNode
	 * @request GET:/api/v1/node/{nodeId}
	 */
	headscaleServiceGetNode = (nodeId: string, params: RequestParams = {}) =>
		this.request<V1GetNodeResponse, RpcStatus>({
			path: `/api/v1/node/${nodeId}`,
			method: 'GET',
			format: ContentType.Json,
			...params
		});
	/**
	 * No description
	 *
	 * @tags HeadscaleService
	 * @name HeadscaleServiceDeleteNode
	 * @request DELETE:/api/v1/node/{nodeId}
	 */
	headscaleServiceDeleteNode = (nodeId: string, params: RequestParams = {}) =>
		this.request<V1DeleteNodeResponse, RpcStatus>({
			path: `/api/v1/node/${nodeId}`,
			method: 'DELETE',
			format: ContentType.Json,
			...params
		});
	/**
	 * No description
	 *
	 * @tags HeadscaleService
	 * @name HeadscaleServiceExpireNode
	 * @request POST:/api/v1/node/{nodeId}/expire
	 */
	headscaleServiceExpireNode = (nodeId: string, params: RequestParams = {}) =>
		this.request<V1ExpireNodeResponse, RpcStatus>({
			path: `/api/v1/node/${nodeId}/expire`,
			method: 'POST',
			format: ContentType.Json,
			...params
		});
	/**
	 * No description
	 *
	 * @tags HeadscaleService
	 * @name HeadscaleServiceRenameNode
	 * @request POST:/api/v1/node/{nodeId}/rename/{newName}
	 */
	headscaleServiceRenameNode = (nodeId: string, newName: string, params: RequestParams = {}) =>
		this.request<V1RenameNodeResponse, RpcStatus>({
			path: `/api/v1/node/${nodeId}/rename/${newName}`,
			method: 'POST',
			format: ContentType.Json,
			...params
		});
	/**
	 * No description
	 *
	 * @tags HeadscaleService
	 * @name HeadscaleServiceGetNodeRoutes
	 * @request GET:/api/v1/node/{nodeId}/routes
	 */
	headscaleServiceGetNodeRoutes = (nodeId: string, params: RequestParams = {}) =>
		this.request<V1GetNodeRoutesResponse, RpcStatus>({
			path: `/api/v1/node/${nodeId}/routes`,
			method: 'GET',
			format: ContentType.Json,
			...params
		});
	/**
	 * No description
	 *
	 * @tags HeadscaleService
	 * @name HeadscaleServiceSetTags
	 * @request POST:/api/v1/node/{nodeId}/tags
	 */
	headscaleServiceSetTags = (
		nodeId: string,
		body: {
			tags?: string[];
		},
		params: RequestParams = {}
	) =>
		this.request<V1SetTagsResponse, RpcStatus>({
			path: `/api/v1/node/${nodeId}/tags`,
			method: 'POST',
			body: body,
			type: ContentType.Json,
			format: ContentType.Json,
			...params
		});
	/**
	 * No description
	 *
	 * @tags HeadscaleService
	 * @name HeadscaleServiceMoveNode
	 * @request POST:/api/v1/node/{nodeId}/user
	 */
	headscaleServiceMoveNode = (
		nodeId: string,
		query?: {
			user?: string;
		},
		params: RequestParams = {}
	) =>
		this.request<V1MoveNodeResponse, RpcStatus>({
			path: `/api/v1/node/${nodeId}/user`,
			method: 'POST',
			query: query,
			format: ContentType.Json,
			...params
		});
	/**
	 * No description
	 *
	 * @tags HeadscaleService
	 * @name HeadscaleServiceGetPolicy
	 * @summary --- Policy start ---
	 * @request GET:/api/v1/policy
	 */
	headscaleServiceGetPolicy = (params: RequestParams = {}) =>
		this.request<V1GetPolicyResponse, RpcStatus>({
			path: `/api/v1/policy`,
			method: 'GET',
			format: ContentType.Json,
			...params
		});
	/**
	 * No description
	 *
	 * @tags HeadscaleService
	 * @name HeadscaleServiceSetPolicy
	 * @request PUT:/api/v1/policy
	 */
	headscaleServiceSetPolicy = (body: V1SetPolicyRequest, params: RequestParams = {}) =>
		this.request<V1SetPolicyResponse, RpcStatus>({
			path: `/api/v1/policy`,
			method: 'PUT',
			body: body,
			type: ContentType.Json,
			format: ContentType.Json,
			...params
		});
	/**
	 * No description
	 *
	 * @tags HeadscaleService
	 * @name HeadscaleServiceListPreAuthKeys
	 * @request GET:/api/v1/preauthkey
	 */
	headscaleServiceListPreAuthKeys = (
		query?: {
			user?: string;
		},
		params: RequestParams = {}
	) =>
		this.request<V1ListPreAuthKeysResponse, RpcStatus>({
			path: `/api/v1/preauthkey`,
			method: 'GET',
			query: query,
			format: ContentType.Json,
			...params
		});
	/**
	 * No description
	 *
	 * @tags HeadscaleService
	 * @name HeadscaleServiceCreatePreAuthKey
	 * @summary --- PreAuthKeys start ---
	 * @request POST:/api/v1/preauthkey
	 */
	headscaleServiceCreatePreAuthKey = (body: V1CreatePreAuthKeyRequest, params: RequestParams = {}) =>
		this.request<V1CreatePreAuthKeyResponse, RpcStatus>({
			path: `/api/v1/preauthkey`,
			method: 'POST',
			body: body,
			type: ContentType.Json,
			format: ContentType.Json,
			...params
		});
	/**
	 * No description
	 *
	 * @tags HeadscaleService
	 * @name HeadscaleServiceExpirePreAuthKey
	 * @request POST:/api/v1/preauthkey/expire
	 */
	headscaleServiceExpirePreAuthKey = (body: V1ExpirePreAuthKeyRequest, params: RequestParams = {}) =>
		this.request<V1ExpirePreAuthKeyResponse, RpcStatus>({
			path: `/api/v1/preauthkey/expire`,
			method: 'POST',
			body: body,
			type: ContentType.Json,
			format: ContentType.Json,
			...params
		});
	/**
	 * No description
	 *
	 * @tags HeadscaleService
	 * @name HeadscaleServiceGetRoutes
	 * @summary --- Route start ---
	 * @request GET:/api/v1/routes
	 */
	headscaleServiceGetRoutes = (params: RequestParams = {}) =>
		this.request<V1GetRoutesResponse, RpcStatus>({
			path: `/api/v1/routes`,
			method: 'GET',
			format: ContentType.Json,
			...params
		});
	/**
	 * No description
	 *
	 * @tags HeadscaleService
	 * @name HeadscaleServiceDeleteRoute
	 * @request DELETE:/api/v1/routes/{routeId}
	 */
	headscaleServiceDeleteRoute = (routeId: string, params: RequestParams = {}) =>
		this.request<V1DeleteRouteResponse, RpcStatus>({
			path: `/api/v1/routes/${routeId}`,
			method: 'DELETE',
			format: ContentType.Json,
			...params
		});
	/**
	 * No description
	 *
	 * @tags HeadscaleService
	 * @name HeadscaleServiceDisableRoute
	 * @request POST:/api/v1/routes/{routeId}/disable
	 */
	headscaleServiceDisableRoute = (routeId: string, params: RequestParams = {}) =>
		this.request<V1DisableRouteResponse, RpcStatus>({
			path: `/api/v1/routes/${routeId}/disable`,
			method: 'POST',
			format: ContentType.Json,
			...params
		});
	/**
	 * No description
	 *
	 * @tags HeadscaleService
	 * @name HeadscaleServiceEnableRoute
	 * @request POST:/api/v1/routes/{routeId}/enable
	 */
	headscaleServiceEnableRoute = (routeId: string, params: RequestParams = {}) =>
		this.request<V1EnableRouteResponse, RpcStatus>({
			path: `/api/v1/routes/${routeId}/enable`,
			method: 'POST',
			format: ContentType.Json,
			...params
		});
	/**
	 * No description
	 *
	 * @tags HeadscaleService
	 * @name HeadscaleServiceListUsers
	 * @request GET:/api/v1/user
	 */
	headscaleServiceListUsers = (params: RequestParams = {}) =>
		this.request<V1ListUsersResponse, RpcStatus>({
			path: `/api/v1/user`,
			method: 'GET',
			format: ContentType.Json,
			...params
		});
	/**
	 * No description
	 *
	 * @tags HeadscaleService
	 * @name HeadscaleServiceCreateUser
	 * @request POST:/api/v1/user
	 */
	headscaleServiceCreateUser = (body: V1CreateUserRequest, params: RequestParams = {}) =>
		this.request<V1CreateUserResponse, RpcStatus>({
			path: `/api/v1/user`,
			method: 'POST',
			body: body,
			type: ContentType.Json,
			format: ContentType.Json,
			...params
		});
	/**
	 * No description
	 *
	 * @tags HeadscaleService
	 * @name HeadscaleServiceGetUser
	 * @summary --- User start ---
	 * @request GET:/api/v1/user/{name}
	 */
	headscaleServiceGetUser = (name: string, params: RequestParams = {}) =>
		this.request<V1GetUserResponse, RpcStatus>({
			path: `/api/v1/user/${name}`,
			method: 'GET',
			format: ContentType.Json,
			...params
		});
	/**
	 * No description
	 *
	 * @tags HeadscaleService
	 * @name HeadscaleServiceDeleteUser
	 * @request DELETE:/api/v1/user/{name}
	 */
	headscaleServiceDeleteUser = (name: string, params: RequestParams = {}) =>
		this.request<V1DeleteUserResponse, RpcStatus>({
			path: `/api/v1/user/${name}`,
			method: 'DELETE',
			format: ContentType.Json,
			...params
		});
	/**
	 * No description
	 *
	 * @tags HeadscaleService
	 * @name HeadscaleServiceRenameUser
	 * @request POST:/api/v1/user/{oldName}/rename/{newName}
	 */
	headscaleServiceRenameUser = (oldName: string, newName: string, params: RequestParams = {}) =>
		this.request<V1RenameUserResponse, RpcStatus>({
			path: `/api/v1/user/${oldName}/rename/${newName}`,
			method: 'POST',
			format: ContentType.Json,
			...params
		});
}
