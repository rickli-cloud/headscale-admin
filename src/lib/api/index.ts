import { get } from 'svelte/store';
import { stringify, parse } from 'json-ast-comments';

import { base } from '$app/paths';
import { Session, endSession } from '$lib/store/session';

import { Api } from './api';
import type { ApiClientConstructorParameters, HttpResponse, RequestParams } from './client.js';
import type { V1RegisterMethod, V1ApiKey, V1Node, V1PreAuthKey, V1Route, V1User, V1CreateApiKeyResponse } from './index.d.js';
import { stripJsonTrailingCommas } from '$lib/utils/json';

export type * from './index.d.js';

export class Headscale extends Api {
	constructor(opt?: ApiClientConstructorParameters) {
		super({
			...opt,
			baseUrl: get(Session)?.baseUrl,
			validationWorker: (res, data) => {
				if (res.status === 401 || (res.status === 500 && data === 'Unauthorized')) {
					endSession();
					window.location.href = base + '/auth';
				}
			},
			securityWorker: (cfg) => ({
				headers: {
					...(cfg.headers || {}),
					Authorization: 'Bearer ' + get(Session)?.token
				}
			})
		});
	}
}

export const groupRegex = /^group:/;
export const tagRegex = /^tag:/;
export const commentRegex = /^\/\/(\s+)?/;

export type V1Tag = `tag:${string}`;

export interface JsonComments {
	[x: string]: string[][];
}

export interface V1Policy {
	/**
	 * groups are collections of users having a common scope. A user can be in multiple groups
	 * groups cannot be composed of groups
	 */
	readonly groups: { [x: string]: readonly string[] };
	/**
	 * tagOwners in tailscale is an association between a TAG and the people allowed to set this TAG on a server.
	 * This is documented [here](https://tailscale.com/kb/1068/acl-tags#defining-a-tag)
	 * and explained [here](https://tailscale.com/blog/rbac-like-it-was-meant-to-be/)
	 */
	readonly tagOwners: { [x: string]: readonly string[] };
	/**
	 * hosts should be defined using its IP addresses and a subnet mask.
	 * to define a single host, use a /32 mask. You cannot use DNS entries here,
	 * as they're prone to be hijacked by replacing their IP addresses.
	 * see https://github.com/tailscale/tailscale/issues/3800 for more information.
	 */
	readonly Hosts: { [x: string]: string };
	readonly acls: {
		readonly action: 'accept';
		readonly proto?: string;
		readonly src: string[];
		readonly dst: string[];
	}[];
	readonly $$comments: {
		readonly $acls?: { [x: number]: string[][] };
	};
}

/**
 *
 * ACL Policy
 *
 */
export class Acl implements V1Policy {
	/* Static methods */
	public static async load(
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<HttpResponse<Acl | undefined>> {
		const response = await headscale.headscaleServiceGetPolicy(requestParams);
		return {
			...response,
			data: response.data?.policy ? new Acl(response.data.policy, response.data.updatedAt) : undefined
		};
	}

	public static formatComments(obj: object): JsonComments {
		if (typeof obj !== 'object' || !('$$comments' in obj)) return {};
		return (obj.$$comments as JsonComments) || {};
	}
	public static stringifyComment(comment: string): string {
		return commentRegex.test(comment) ? comment : `// ${comment}\n`;
	}
	public static parseComment(comment: string | undefined): string {
		return (
			comment
				?.trim()
				?.replace(commentRegex, '')
				?.trim()
				?.replaceAll(/(^\/\*\*)|(\*\/$)/gm, '')
				?.trim() || ''
		);
	}

	/* Instance properties */
	public readonly $$comments: { $acls?: { [x: number]: string[][] } };
	public readonly tagOwners: { [x: string]: string[] };
	public readonly groups: { [x: string]: string[] };
	public readonly Hosts: { [x: string]: string };
	public readonly acls: {
		action: 'accept';
		proto?: string;
		src: string[];
		dst: string[];
	}[];
	public readonly updatedAt?: string;

	/* Instance getters */
	public get stringified(): string | undefined {
		return stringify({
			$$comments: this.$$comments,
			tagOwners: this.tagOwners,
			groups: this.groups,
			Hosts: this.Hosts,
			acls: this.acls
		});
	}

	/* Protected properties */
	protected readonly raw: string;

	/* Constructor */
	constructor(data: string, updatedAt?: string) {
		this.raw = data;
		this.updatedAt = updatedAt;

		const parsed: V1Policy | undefined = data?.length ? parse(stripJsonTrailingCommas(data)) : undefined;

		// Initialize items if unset
		this.$$comments = {};
		this.tagOwners = {};
		this.groups = {};
		this.Hosts = {};
		this.acls = [];

		if (!parsed) return;
		for (const [key, value] of Object.entries(parsed)) {
			this[key as keyof this] = value;
		}
	}

	/* Instance methods */
	public async update(
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<HttpResponse<Acl | undefined>> {
		const response = await headscale.headscaleServiceSetPolicy({ policy: this.stringified }, requestParams);
		return {
			...response,
			data: response.data?.policy ? new Acl(response.data.policy, response.data.updatedAt) : undefined
		};
	}

	public reset(): Acl {
		return new Acl(this.raw);
	}
}

/**
 *
 * User
 *
 */
export class User implements V1User {
	/* Static methods */
	public static async list(
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<HttpResponse<User[] | undefined>> {
		const response = await headscale.headscaleServiceListUsers(requestParams);
		return { ...response, data: response.data?.users?.map((user) => new User(user)) };
	}

	public static async find(
		name: string,
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<HttpResponse<User | undefined>> {
		const response = await headscale.headscaleServiceGetUser(name, requestParams);
		return { ...response, data: response.data?.user ? new User(response.data.user) : undefined };
	}

	public static async create(
		name: string,
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<HttpResponse<User | undefined>> {
		const response = await headscale.headscaleServiceCreateUser({ name }, requestParams);
		return { ...response, data: response.data?.user ? new User(response.data.user) : undefined };
	}

	/* Instance properties */
	public readonly name?: string | undefined;
	public readonly id?: string | undefined;
	public readonly createdAt?: string | undefined;

	/* Constructor */
	constructor(data: V1User) {
		if (!data.name) throw new Error('Name is required to create a new User!');
		for (const [key, value] of Object.entries(data)) {
			this[key as keyof this] = value;
		}
	}

	/* Instance methods */
	public async rename(
		newName: string,
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<HttpResponse<User | undefined>> {
		if (!this.name) throw new Error("User's name is undefined");
		const response = await headscale.headscaleServiceRenameUser(this.name, newName, requestParams);
		return { ...response, data: response.data?.user ? new User(response.data.user) : undefined };
	}

	public async delete(headscale: Headscale = new Headscale(), requestParams?: RequestParams): Promise<HttpResponse<object>> {
		if (!this.name) throw new Error("User's name is undefined");
		return await headscale.headscaleServiceDeleteUser(this.name, requestParams);
	}

	public async getPreAuthKeys(
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<ReturnType<(typeof PreAuthKey)['find']>> {
		if (!this.name) throw new Error("User's name is undefined");
		return await PreAuthKey.find(this.name, headscale, requestParams);
	}

	public async getMachines(
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<ReturnType<(typeof Machine)['list']>> {
		return await Machine.list(this.name, headscale, requestParams);
	}
}

/**
 *
 * PreAuthKey
 *
 */
export class PreAuthKey implements V1PreAuthKey {
	/* Static methods */
	public static async find(
		user: string,
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<HttpResponse<PreAuthKey[] | undefined>> {
		const response = await headscale.headscaleServiceListPreAuthKeys({ user }, requestParams);
		return { ...response, data: response.data?.preAuthKeys?.map((key) => new PreAuthKey(key)) };
	}

	public static async create(
		key: V1PreAuthKey,
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<HttpResponse<PreAuthKey | undefined>> {
		const response = await headscale.headscaleServiceCreatePreAuthKey(key, requestParams);
		return { ...response, data: response.data?.preAuthKey ? new PreAuthKey(response.data.preAuthKey) : undefined };
	}

	/* Instance properties */
	public readonly id?: string | undefined;
	public readonly key?: string | undefined;
	public readonly aclTags?: string[] | undefined;
	public readonly user?: string | undefined;
	public readonly createdAt?: string | undefined;
	public readonly expiration?: string | undefined;
	public readonly used?: boolean | undefined;
	public readonly reusable?: boolean | undefined;
	public readonly ephemeral?: boolean | undefined;

	/* Constructor */
	constructor(data: V1PreAuthKey) {
		for (const [key, value] of Object.entries(data)) {
			this[key as keyof this] = value;
		}
	}

	/* Instance methods */
	public async expire(headscale: Headscale = new Headscale(), requestParams?: RequestParams): Promise<HttpResponse<object>> {
		return await headscale.headscaleServiceExpirePreAuthKey({ key: this.key, user: this.user }, requestParams);
	}
}

/**
 *
 * Route
 *
 */
export class Route implements V1Route {
	/* Static methods */
	public static async list(
		machineId?: string | undefined,
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<HttpResponse<Route[] | undefined>> {
		const response = await (machineId
			? headscale.headscaleServiceGetNodeRoutes(machineId, requestParams)
			: headscale.headscaleServiceGetRoutes(requestParams));
		return { ...response, data: response.data?.routes?.map((route) => new Route(route)) };
	}

	/* Instance properties */
	public readonly id?: string | undefined;
	public readonly prefix?: string | undefined;
	public readonly advertised?: boolean | undefined;
	public readonly enabled?: boolean | undefined;
	public readonly isPrimary?: boolean | undefined;
	public readonly createdAt?: string | undefined;
	public readonly updatedAt?: string | undefined;
	public readonly deletedAt?: string | undefined;
	public readonly machine?: V1Node | undefined;

	/* Constructor */
	constructor(data: V1Route) {
		for (const [key, value] of Object.entries(data)) {
			this[key as keyof this] = value;
		}
	}

	/* Instance methods */
	public async delete(headscale: Headscale = new Headscale(), requestParams?: RequestParams): Promise<HttpResponse<object>> {
		if (!this.id) throw new Error('Internal: Cannot create route without id.');
		return await headscale.headscaleServiceDeleteRoute(this.id, requestParams);
	}

	public async disable(headscale: Headscale = new Headscale(), requestParams?: RequestParams): Promise<HttpResponse<object>> {
		if (!this.id) throw new Error('Internal: Cannot disable route without id.');
		return await headscale.headscaleServiceDisableRoute(this.id, requestParams);
	}

	public async enable(headscale: Headscale = new Headscale(), requestParams?: RequestParams): Promise<HttpResponse<object>> {
		if (!this.id) throw new Error('Internal: Cannot enable route without id.');
		return await headscale.headscaleServiceEnableRoute(this.id, requestParams);
	}
}

/**
 *
 * Machine
 *
 */
export class Machine implements V1Node {
	/* Static methods */
	public static async get(
		id: string,
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<HttpResponse<Machine | undefined>> {
		const response = await headscale.headscaleServiceGetNode(id, requestParams);
		return { ...response, data: response.data?.node ? new Machine(response.data.node) : undefined };
	}

	public static async list(
		user?: string,
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<HttpResponse<Machine[] | undefined>> {
		const response = await headscale.headscaleServiceListNodes(user ? { user } : {}, requestParams);
		return { ...response, data: response.data?.nodes?.map((machine) => new Machine(machine)) };
	}

	public static async register(
		machine: { key: string; user: string },
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<HttpResponse<Machine | undefined>> {
		const response = await headscale.headscaleServiceRegisterNode(machine, requestParams);
		return { ...response, data: response.data?.node ? new Machine(response.data.node) : undefined };
	}

	/* Instance properties */
	public readonly id?: string | undefined;
	public readonly name?: string | undefined;
	public readonly givenName?: string | undefined;
	public readonly discoKey?: string | undefined;
	public readonly nodeKey?: string | undefined;
	public readonly preAuthKey?: V1PreAuthKey | undefined;
	public readonly machineKey?: string | undefined;
	public readonly user?: V1User | undefined;
	public readonly createdAt?: string | undefined;
	public readonly lastSuccessfulUpdate?: string | undefined;
	public readonly lastSeen?: string | undefined;
	public readonly expiry?: string | undefined;
	public readonly ipAddresses?: string[] | undefined;
	public readonly registerMethod?: V1RegisterMethod | undefined;
	public readonly online?: boolean | undefined;
	public readonly invalidTags?: string[] | undefined;
	public readonly validTags?: string[] | undefined;
	public readonly forcedTags?: string[] | undefined;

	/* Constructor */
	constructor(data: V1Node) {
		for (const [key, value] of Object.entries(data)) {
			this[key as keyof this] = value;
		}
	}

	/* Instance methods */
	public async delete(headscale: Headscale = new Headscale(), requestParams?: RequestParams): Promise<HttpResponse<object>> {
		if (!this.id) throw new Error('Internal: Failed to get machine instance id.');
		return await headscale.headscaleServiceDeleteNode(this.id, requestParams);
	}

	public async expire(
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<HttpResponse<Machine | undefined>> {
		if (!this.id) throw new Error('Internal: Failed to get machine instance id.');
		const response = await headscale.headscaleServiceExpireNode(this.id, requestParams);
		return { ...response, data: response.data?.node ? new Machine(response.data.node) : undefined };
	}

	public async reassign(
		user: string,
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<HttpResponse<Machine | undefined>> {
		if (!this.id) throw new Error('Internal: Failed to get machine instance id.');
		const response = await headscale.headscaleServiceMoveNode(this.id, { user }, requestParams);
		return { ...response, data: response.data?.node ? new Machine(response.data.node) : undefined };
	}

	public async rename(
		newName: string,
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<HttpResponse<Machine | undefined>> {
		if (!this.id) throw new Error('Internal: Failed to get machine instance id.');
		const response = await headscale.headscaleServiceRenameNode(this.id, newName, requestParams);
		return { ...response, data: response.data?.node ? new Machine(response.data.node) : undefined };
	}

	public async setTags(
		tags: string[],
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<HttpResponse<Machine | undefined>> {
		if (!this.id) throw new Error('Internal: Failed to get machine instance id.');
		const response = await headscale.headscaleServiceSetTags(
			this.id,
			{ tags: tags.map((tag) => (tagRegex.test(tag) ? tag : `tag:${tag}`)) },
			requestParams
		);
		return { ...response, data: response.data?.node ? new Machine(response.data.node) : undefined };
	}

	public async getRoutes(
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<HttpResponse<Route[] | undefined>> {
		if (!this.id) throw new Error('Internal: Failed to get machine instance id.');
		const response = await headscale.headscaleServiceGetNodeRoutes(this.id, requestParams);
		return { ...response, data: response.data?.routes?.map((route) => new Route(route)) };
	}
}

/**
 *
 * ApiKey
 *
 */
export class ApiKey implements V1ApiKey {
	/* Static methods */
	public static async list(
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<HttpResponse<ApiKey[] | undefined>> {
		const response = await headscale.headscaleServiceListApiKeys(requestParams);
		return { ...response, data: response.data?.apiKeys?.map((key) => new ApiKey(key)) };
	}

	public static async create(
		key: { expiration: string | number | Date },
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<HttpResponse<V1CreateApiKeyResponse | undefined>> {
		return await headscale.headscaleServiceCreateApiKey(
			{ expiration: (key.expiration instanceof Date ? key.expiration : new Date(key.expiration)).toISOString() },
			requestParams
		);
	}

	/* Instance properties */
	public readonly id?: string | undefined;
	public readonly prefix?: string | undefined;
	public readonly createdAt?: string | undefined;
	public readonly expiration?: string | undefined;
	public readonly lastSeen?: string | undefined;

	/* Constructor */
	constructor(data: V1ApiKey) {
		for (const [key, value] of Object.entries(data)) {
			this[key as keyof this] = value;
		}
	}

	/* Instance methods */
	public async expire(headscale: Headscale = new Headscale(), requestParams?: RequestParams): Promise<HttpResponse<object>> {
		return await headscale.headscaleServiceExpireApiKey({ prefix: this.prefix }, requestParams);
	}
}
