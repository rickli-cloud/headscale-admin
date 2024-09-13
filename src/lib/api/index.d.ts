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

export {}

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

export interface V1BackfillNodeIPsResponse {
	changes?: string[];
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

export interface V1DebugCreateNodeRequest {
	user?: string;
	key?: string;
	name?: string;
	routes?: string[];
}

export interface V1DebugCreateNodeResponse {
	node?: V1Node;
}

export type V1DeleteApiKeyResponse = object;

export type V1DeleteNodeResponse = object;

export type V1DeleteRouteResponse = object;

export type V1DeleteUserResponse = object;

export type V1DisableRouteResponse = object;

export type V1EnableRouteResponse = object;

export interface V1ExpireApiKeyRequest {
	prefix?: string;
}

export type V1ExpireApiKeyResponse = object;

export interface V1ExpireNodeResponse {
	node?: V1Node;
}

export interface V1ExpirePreAuthKeyRequest {
	user?: string;
	key?: string;
}

export type V1ExpirePreAuthKeyResponse = object;

export interface V1GetNodeResponse {
	node?: V1Node;
}

export interface V1GetNodeRoutesResponse {
	routes?: V1Route[];
}

export interface V1GetPolicyResponse {
	policy?: string;
	/** @format date-time */
	updatedAt?: string;
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

export interface V1ListNodesResponse {
	nodes?: V1Node[];
}

export interface V1ListPreAuthKeysResponse {
	preAuthKeys?: V1PreAuthKey[];
}

export interface V1ListUsersResponse {
	users?: V1User[];
}

export interface V1MoveNodeResponse {
	node?: V1Node;
}

export interface V1Node {
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

/** @default "REGISTER_METHOD_UNSPECIFIED" */
export enum V1RegisterMethod {
	REGISTER_METHOD_UNSPECIFIED = 'REGISTER_METHOD_UNSPECIFIED',
	REGISTER_METHOD_AUTH_KEY = 'REGISTER_METHOD_AUTH_KEY',
	REGISTER_METHOD_CLI = 'REGISTER_METHOD_CLI',
	REGISTER_METHOD_OIDC = 'REGISTER_METHOD_OIDC'
}

export interface V1RegisterNodeResponse {
	node?: V1Node;
}

export interface V1RenameNodeResponse {
	node?: V1Node;
}

export interface V1RenameUserResponse {
	user?: V1User;
}

export interface V1Route {
	/** @format uint64 */
	id?: string;
	node?: V1Node;
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

export interface V1SetPolicyRequest {
	policy?: string;
}

export interface V1SetPolicyResponse {
	policy?: string;
	/** @format date-time */
	updatedAt?: string;
}

export interface V1SetTagsResponse {
	node?: V1Node;
}

export interface V1User {
	id?: string;
	name?: string;
	/** @format date-time */
	createdAt?: string;
}
