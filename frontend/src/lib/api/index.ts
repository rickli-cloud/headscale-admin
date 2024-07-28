import { get } from 'svelte/store';
import { stringify, parse } from 'json-ast-comments';

import { base } from '$app/paths';
import { env } from '$env/dynamic/public';
import { Session, endSession } from '$lib/store/session.js';

import { Api } from './api.js';
import type { ApiClientConstructorParameters, ApiError, RequestParams } from './client.js';
import type {
	V1RegisterMethod,
	V1ApiKey,
	V1Node,
	V1PreAuthKey,
	V1Route,
	V1User
} from './index.d.js';
import stripJsonTrailingCommas from '$lib/utils/json.js';

export type * from './index.d.js';

export class Headscale extends Api {
	constructor(opt?: ApiClientConstructorParameters) {
		const session = env.PUBLIC_DISABLE_TOKEN_AUTH === 'true' ? undefined : get(Session);
		super({
			...opt,
			baseUrl: session?.baseUrl,
			validationWorker: (res, data) => {
				if (env.PUBLIC_DISABLE_TOKEN_AUTH === 'true') return;
				if (res.status === 401 || (res.status === 500 && data === 'Unauthorized')) {
					endSession();
					window.location.href = base + '/login';
				}
			},
			securityWorker: (cfg) => {
				if (env.PUBLIC_DISABLE_TOKEN_AUTH === 'true') return {};
				return {
					headers: {
						...(cfg.headers || {}),
						Authorization: 'Bearer ' + session?.token
					}
				};
			}
		});
	}
}

export const groupRegex = /^group:/;

export const tagRegex = /^tag:/;
export type V1Tag = `tag:${string}`;

export type ApiResponse<T extends unknown, E extends unknown = ApiError | undefined> = {
	data: T;
	error: E;
};

export interface JsonComments {
	[x: string]: string[][];
}

export interface V1Policy {
	/**
	 * groups are collections of users having a common scope. A user can be in multiple groups
	 * groups cannot be composed of groups
	 */
	groups: { [x: string]: string[] };
	/**
	 * tagOwners in tailscale is an association between a TAG and the people allowed to set this TAG on a server.
	 * This is documented [here](https://tailscale.com/kb/1068/acl-tags#defining-a-tag)
	 * and explained [here](https://tailscale.com/blog/rbac-like-it-was-meant-to-be/)
	 */
	tagOwners: { [x: string]: string[] };
	/**
	 * hosts should be defined using its IP addresses and a subnet mask.
	 * to define a single host, use a /32 mask. You cannot use DNS entries here,
	 * as they're prone to be hijacked by replacing their IP addresses.
	 * see https://github.com/tailscale/tailscale/issues/3800 for more information.
	 */
	Hosts: { [x: string]: string };
	acls: {
		action: 'accept';
		proto?: string;
		src: string[];
		dst: string[];
	}[];
	$$comments: {
		$acls?: { [x: number]: string[][] };
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
	): Promise<ApiResponse<Acl | undefined>> {
		const { data, error } = await headscale.headscaleServiceGetPolicy(requestParams);
		return {
			data: data?.policy ? new Acl(data.policy, data.updatedAt) : undefined,
			error
		};
	}

	public static formatComments(obj: object): JsonComments {
		if (typeof obj !== 'object' || !('$$comments' in obj)) return {};
		return (obj.$$comments as JsonComments) || {};
	}
	public static stringifyComment(comment: string): string {
		return `// ${comment}\n`;
	}
	public static parseComment(comment: string | undefined): string {
		return (
			comment
				?.trim()
				?.replace(/^\/\/\s?/, '')
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

		const parsed: V1Policy | undefined = data?.length
			? parse(stripJsonTrailingCommas(data))
			: undefined;

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
	): Promise<ApiResponse<Acl | undefined>> {
		const { data, error } = await headscale.headscaleServiceSetPolicy(
			{ policy: this.stringified },
			requestParams
		);
		return {
			data: data?.policy ? new Acl(data.policy, data.updatedAt) : undefined,
			error
		};
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
	): Promise<User[] | undefined> {
		const { data } = await headscale.headscaleServiceListUsers(requestParams);
		return data?.users?.map((user) => new User(user));
	}

	public static async find(
		name: string,
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<User | undefined> {
		const { data } = await headscale.headscaleServiceGetUser(name, requestParams);
		return data?.user ? new User(data.user) : undefined;
	}

	public static async create(
		name: string,
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<User | undefined> {
		const { data } = await headscale.headscaleServiceCreateUser({ name }, requestParams);
		return data?.user ? new User(data.user) : undefined;
	}

	/* Instance properties */
	public readonly name: string;
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
	): Promise<User | undefined> {
		const { data } = await headscale.headscaleServiceRenameUser(this.name, newName, requestParams);
		return data?.user ? new User(data.user) : undefined;
	}

	public async delete(
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<void> {
		await headscale.headscaleServiceDeleteUser(this.name, requestParams);
	}

	public async getPreAuthKeys(
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<PreAuthKey[] | undefined> {
		return await PreAuthKey.find(this.name, headscale, requestParams);
	}

	public async getMachines(
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<Machine[] | undefined> {
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
	): Promise<PreAuthKey[] | undefined> {
		const { data } = await headscale.headscaleServiceListPreAuthKeys({ user }, requestParams);
		return data?.preAuthKeys?.map((key) => new PreAuthKey(key));
	}

	public static async create(
		key: V1PreAuthKey,
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<PreAuthKey | undefined> {
		const { data } = await headscale.headscaleServiceCreatePreAuthKey(key, requestParams);
		return data?.preAuthKey ? new PreAuthKey(data.preAuthKey) : undefined;
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
	public async expire(
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<void> {
		await headscale.headscaleServiceExpirePreAuthKey(
			{ key: this.key, user: this.user },
			requestParams
		);
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
	): Promise<Route[] | undefined> {
		const { data } = await (machineId
			? headscale.headscaleServiceGetNodeRoutes(machineId, requestParams)
			: headscale.headscaleServiceGetRoutes(requestParams));
		return data?.routes?.map((route) => new Route(route));
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
	public async delete(
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<void> {
		if (!this.id) throw new Error('Internal: Cannot create route without id.');
		await headscale.headscaleServiceDeleteRoute(this.id, requestParams);
	}

	public async disable(
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<void> {
		if (!this.id) throw new Error('Internal: Cannot disable route without id.');
		await headscale.headscaleServiceDisableRoute(this.id, requestParams);
	}

	public async enable(
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<void> {
		if (!this.id) throw new Error('Internal: Cannot enable route without id.');
		await headscale.headscaleServiceEnableRoute(this.id, requestParams);
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
	) {
		const { data } = await headscale.headscaleServiceGetNode(id, requestParams);
		return data?.node ? new Machine(data.node) : undefined;
	}

	public static async list(
		user?: string,
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	) {
		const { data } = await headscale.headscaleServiceListNodes(user ? { user } : {}, requestParams);
		return data?.nodes?.map((machine) => new Machine(machine));
	}

	public static async register(
		machine: { key: string; user: string },
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<Machine | undefined> {
		const { data } = await headscale.headscaleServiceRegisterNode(machine, requestParams);
		return data?.node ? new Machine(data.node) : undefined;
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
	public async delete(
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<void> {
		if (!this.id) throw new Error('Internal: Failed to get machine instance id.');
		await headscale.headscaleServiceDeleteNode(this.id, requestParams);
	}

	public async expire(
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<Machine | undefined> {
		if (!this.id) throw new Error('Internal: Failed to get machine instance id.');
		const { data } = await headscale.headscaleServiceExpireNode(this.id, requestParams);
		return data?.node ? new Machine(data.node) : undefined;
	}

	public async reassign(
		user: string,
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<Machine | undefined> {
		if (!this.id) throw new Error('Internal: Failed to get machine instance id.');
		const { data } = await headscale.headscaleServiceMoveNode(this.id, { user }, requestParams);
		return data?.node ? new Machine(data.node) : undefined;
	}

	public async rename(
		newName: string,
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<Machine | undefined> {
		if (!this.id) throw new Error('Internal: Failed to get machine instance id.');
		const { data } = await headscale.headscaleServiceRenameNode(this.id, newName, requestParams);
		return data?.node ? new Machine(data.node) : undefined;
	}

	public async setTags(
		tags: string[],
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<Machine | undefined> {
		if (!this.id) throw new Error('Internal: Failed to get machine instance id.');
		const { data } = await headscale.headscaleServiceSetTags(
			this.id,
			{ tags: tags.map((tag) => (tagRegex.test(tag) ? tag : `tag:${tag}`)) },
			requestParams
		);
		return data?.node ? new Machine(data.node) : undefined;
	}

	public async getRoutes(
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<Route[] | undefined> {
		if (!this.id) throw new Error('Internal: Failed to get machine instance id.');
		const { data } = await headscale.headscaleServiceGetNodeRoutes(this.id, requestParams);
		return data?.routes?.map((route) => new Route(route));
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
	): Promise<ApiKey[] | undefined> {
		const { data } = await headscale.headscaleServiceListApiKeys(requestParams);
		return data?.apiKeys?.map((key) => new ApiKey(key));
	}

	/** Only returns the full new key as string. Content needs to be reloaded */
	public static async create(
		key: { expiration: string | number | Date },
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<string | undefined> {
		const { data } = await headscale.headscaleServiceCreateApiKey(
			{
				expiration: (key.expiration instanceof Date
					? key.expiration
					: new Date(key.expiration)
				).toISOString()
			},
			requestParams
		);
		return data?.apiKey;
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
	public async expire(
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<void> {
		await headscale.headscaleServiceExpireApiKey({ prefix: this.prefix }, requestParams);
	}
}
