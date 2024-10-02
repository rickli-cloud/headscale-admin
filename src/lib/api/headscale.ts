import createClient, { type Client, type ClientOptions } from 'openapi-fetch';
import { stringify, parse } from 'json-ast-comments';

import type { components, paths } from './headscale.d';
import { stripJsonTrailingCommas } from '$lib/utils/json';
import { get } from 'svelte/store';
import { Session } from '$lib/store/session';

export const commentRegex = /^\/\/(\s+)?/;
export const groupRegex = /^group:/;
export const tagRegex = /^tag:/;

export function headscaleClient<Paths extends object = paths, Media extends `${string}/${string}` = `${string}/${string}`>(
	clientOptions?: ClientOptions
): Client<Paths, Media> {
	return createClient<Paths, Media>({
		...clientOptions
	});
}

export class Headscale {
	public readonly client: Client<paths, `${string}/${string}`>;

	constructor(clientOptions?: ClientOptions) {
		const session = get(Session);

		const headers = new Headers();
		headers.set('Authorization', 'Bearer ' + session?.token);

		this.client = createClient({
			baseUrl: session?.baseUrl,
			headers,
			...(clientOptions || {})
		});
	}
}

export type V1User = components['schemas']['v1User'];
export type V1PreAuthKey = components['schemas']['v1PreAuthKey'];
export type V1Route = components['schemas']['v1Route'];
export type V1Node = components['schemas']['v1Node'];
export type V1ApiKey = components['schemas']['v1ApiKey'];

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

export interface JsonComments {
	[x: string]: string[][];
}

export class User implements V1User {
	public static async list(headscale: Headscale = new Headscale()) {
		const response = await headscale.client.GET('/api/v1/user');
		return { ...response, data: response.data?.users?.map((user) => new User(user)) };
	}

	public static async find(name: string, headscale: Headscale = new Headscale()) {
		const response = await headscale.client.GET('/api/v1/user/{name}', { params: { path: { name } } });
		return { ...response, data: response.data?.user ? new User(response.data.user) : undefined };
	}

	public static async create(name: string, headscale: Headscale = new Headscale()) {
		const response = await headscale.client.POST('/api/v1/user', { body: { name } });
		return { ...response, data: response.data?.user ? new User(response.data.user) : undefined };
	}

	public readonly name?: string | undefined;
	public readonly id?: string | undefined;
	public readonly createdAt?: string | undefined;

	constructor(data: V1User) {
		if (!data.name) throw new Error('Name is required to create a new User!');
		Object.assign(this, data);
	}

	public async rename(newName: string, headscale: Headscale = new Headscale()) {
		if (!this.name) throw new Error("User's name is undefined");
		const response = await headscale.client.POST('/api/v1/user/{oldName}/rename/{newName}', {
			params: { path: { oldName: this.name, newName } }
		});
		return { ...response, data: response.data?.user ? new User(response.data.user) : undefined };
	}

	public async delete(headscale: Headscale = new Headscale()) {
		if (!this.name) throw new Error("User's name is undefined");
		return await headscale.client.DELETE('/api/v1/user/{name}', { params: { path: { name: this.name } } });
	}

	public async getPreAuthKeys(headscale: Headscale = new Headscale()) {
		if (!this.name) throw new Error("User's name is undefined");
		return await PreAuthKey.find(this.name, headscale);
	}

	public async getMachines(headscale: Headscale = new Headscale()) {
		return await Machine.list(this.name, headscale);
	}
}

export class PreAuthKey implements V1PreAuthKey {
	public static async find(user?: string, headscale: Headscale = new Headscale()) {
		const response = await headscale.client.GET('/api/v1/preauthkey', { params: { query: { user } } });
		return { ...response, data: response.data?.preAuthKeys?.map((key) => new PreAuthKey(key)) };
	}

	public static async create(body: components['schemas']['v1CreatePreAuthKeyRequest'], headscale: Headscale = new Headscale()) {
		const response = await headscale.client.POST('/api/v1/preauthkey', { body });
		return { ...response, data: response.data?.preAuthKey ? new PreAuthKey(response.data.preAuthKey) : undefined };
	}

	public readonly id?: string | undefined;
	public readonly key?: string | undefined;
	public readonly aclTags?: string[] | undefined;
	public readonly user?: string | undefined;
	public readonly createdAt?: string | undefined;
	public readonly expiration?: string | undefined;
	public readonly used?: boolean | undefined;
	public readonly reusable?: boolean | undefined;
	public readonly ephemeral?: boolean | undefined;

	constructor(data: V1PreAuthKey) {
		Object.assign(this, data);
	}

	public async expire(headscale: Headscale = new Headscale()) {
		return await headscale.client.POST('/api/v1/preauthkey/expire', { body: { key: this.key, user: this.user } });
	}
}

export class Route implements V1Route {
	public static async list(headscale: Headscale = new Headscale()) {
		const response = await headscale.client.GET('/api/v1/routes');
		return { ...response, data: response.data?.routes?.map((route) => new Route(route)) };
	}

	public readonly id?: string | undefined;
	public readonly prefix?: string | undefined;
	public readonly advertised?: boolean | undefined;
	public readonly enabled?: boolean | undefined;
	public readonly isPrimary?: boolean | undefined;
	public readonly createdAt?: string | undefined;
	public readonly updatedAt?: string | undefined;
	public readonly deletedAt?: string | undefined;
	public readonly machine?: V1Node | undefined;

	constructor(data: V1Route) {
		Object.assign(this, data);
	}

	public async delete(headscale: Headscale = new Headscale()) {
		if (!this.id) throw new Error('Internal: Cannot create route without id.');
		return await headscale.client.DELETE('/api/v1/routes/{routeId}', { params: { path: { routeId: this.id } } });
	}

	public async disable(headscale: Headscale = new Headscale()) {
		if (!this.id) throw new Error('Internal: Cannot disable route without id.');
		return await headscale.client.POST('/api/v1/routes/{routeId}/disable', { params: { path: { routeId: this.id } } });
	}

	public async enable(headscale: Headscale = new Headscale()) {
		if (!this.id) throw new Error('Internal: Cannot enable route without id.');
		return await headscale.client.POST('/api/v1/routes/{routeId}/enable', { params: { path: { routeId: this.id } } });
	}
}

export class Machine implements V1Node {
	public static async get(nodeId: string, headscale: Headscale = new Headscale()) {
		const response = await headscale.client.GET('/api/v1/node/{nodeId}', { params: { path: { nodeId } } });
		return { ...response, data: response.data?.node ? new Machine(response.data.node) : undefined };
	}

	public static async list(user?: string, headscale: Headscale = new Headscale()) {
		const response = await headscale.client.GET('/api/v1/node', { params: { query: { user } } });
		return { ...response, data: response.data?.nodes?.map((machine) => new Machine(machine)) };
	}

	public static async register(query: { key: string; user: string }, headscale: Headscale = new Headscale()) {
		const response = await headscale.client.POST('/api/v1/node/register', { params: { query } });
		return { ...response, data: response.data?.node ? new Machine(response.data.node) : undefined };
	}

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
	public readonly registerMethod?: components['schemas']['v1RegisterMethod'] | undefined;
	public readonly online?: boolean | undefined;
	public readonly invalidTags?: string[] | undefined;
	public readonly validTags?: string[] | undefined;
	public readonly forcedTags?: string[] | undefined;

	constructor(data: V1Node) {
		Object.assign(this, data);
	}

	public async delete(headscale: Headscale = new Headscale()) {
		if (!this.id) throw new Error('Internal: Failed to get machine instance id.');
		return await headscale.client.DELETE('/api/v1/node/{nodeId}', { params: { path: { nodeId: this.id } } });
	}

	public async expire(headscale: Headscale = new Headscale()) {
		if (!this.id) throw new Error('Internal: Failed to get machine instance id.');
		const response = await headscale.client.POST('/api/v1/node/{nodeId}/expire', { params: { path: { nodeId: this.id } } });
		return { ...response, data: response.data?.node ? new Machine(response.data.node) : undefined };
	}

	public async reassign(user: string, headscale: Headscale = new Headscale()) {
		if (!this.id) throw new Error('Internal: Failed to get machine instance id.');
		const response = await headscale.client.POST('/api/v1/node/{nodeId}/user', {
			params: { path: { nodeId: this.id }, query: { user } }
		});
		return { ...response, data: response.data?.node ? new Machine(response.data.node) : undefined };
	}

	public async rename(newName: string, headscale: Headscale = new Headscale()) {
		if (!this.id) throw new Error('Internal: Failed to get machine instance id.');
		const response = await headscale.client.POST('/api/v1/node/{nodeId}/rename/{newName}', {
			params: { path: { nodeId: this.id, newName } }
		});
		return { ...response, data: response.data?.node ? new Machine(response.data.node) : undefined };
	}

	public async setTags(tags: string[], headscale: Headscale = new Headscale()) {
		if (!this.id) throw new Error('Internal: Failed to get machine instance id.');
		const response = await headscale.client.POST('/api/v1/node/{nodeId}/tags', {
			params: { path: { nodeId: this.id } },
			body: { tags: tags.map((tag) => (tagRegex.test(tag) ? tag : `tag:${tag}`)) }
		});
		return { ...response, data: response.data?.node ? new Machine(response.data.node) : undefined };
	}

	public async getRoutes(headscale: Headscale = new Headscale()) {
		if (!this.id) throw new Error('Internal: Failed to get machine instance id.');
		const response = await headscale.client.GET('/api/v1/node/{nodeId}/routes', { params: { path: { nodeId: this.id } } });
		return { ...response, data: response.data?.routes?.map((route) => new Route(route)) };
	}
}

export class ApiKey implements V1ApiKey {
	public static async list(headscale: Headscale = new Headscale()) {
		const response = await headscale.client.GET('/api/v1/apikey');
		return { ...response, data: response.data?.apiKeys?.map((key) => new ApiKey(key)) };
	}

	public static async create(key: { expiration: string | number | Date }, headscale: Headscale = new Headscale()) {
		return await headscale.client.POST('/api/v1/apikey', {
			body: { expiration: (key.expiration instanceof Date ? key.expiration : new Date(key.expiration)).toISOString() }
		});
	}

	public readonly id?: string | undefined;
	public readonly prefix?: string | undefined;
	public readonly createdAt?: string | undefined;
	public readonly expiration?: string | undefined;
	public readonly lastSeen?: string | undefined;

	constructor(data: V1ApiKey) {
		Object.assign(this, data);
	}

	public async expire(headscale: Headscale = new Headscale()) {
		return await headscale.client.POST('/api/v1/apikey/expire', { body: { prefix: this.prefix } });
	}
}

export class Acl implements V1Policy {
	public static async load(headscale: Headscale = new Headscale()) {
		const response = await headscale.client.GET('/api/v1/policy');
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

	public get stringified(): string | undefined {
		return stringify({
			$$comments: this.$$comments,
			tagOwners: this.tagOwners,
			groups: this.groups,
			Hosts: this.Hosts,
			acls: this.acls
		});
	}

	protected readonly raw: string;

	constructor(data: string, updatedAt?: string) {
		this.raw = data;
		this.updatedAt = updatedAt;
		this.$$comments = {};
		this.tagOwners = {};
		this.groups = {};
		this.Hosts = {};
		this.acls = [];

		const parsed: V1Policy | undefined = data?.length ? parse(stripJsonTrailingCommas(data)) : undefined;

		if (typeof parsed === 'object') Object.assign(this, parsed);
	}

	public async update(headscale: Headscale = new Headscale()) {
		const response = await headscale.client.PUT('/api/v1/policy', { body: { policy: this.stringified } });
		return {
			...response,
			data: response.data?.policy ? new Acl(response.data.policy, response.data.updatedAt) : undefined
		};
	}

	public reset(): Acl {
		return new Acl(this.raw);
	}
}
