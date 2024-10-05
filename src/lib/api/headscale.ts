import createClient, { type Client, type ClientOptions } from 'openapi-fetch';
import { stringify, parse } from 'json-ast-comments';

import type { components, paths } from './headscale.d';
import { stripJsonTrailingCommas } from '$lib/utils/json';
import { get } from 'svelte/store';
import { Session } from '$lib/store/session';
import { ApiError } from '.';

export const commentRegex = /^\/\/(\s+)?/;
export const groupRegex = /^group:/;
export const tagRegex = /^tag:/;

export type ApiPath = keyof paths;
export type ApiMethod = 'get' | 'post' | 'delete' | 'put';

export class Headscale {
	public readonly client: Client<paths, `${string}/${string}`>;

	public constructor(clientOptions?: ClientOptions, timeout = 5000) {
		this.client = createClient({
			signal: AbortSignal.timeout(timeout),
			baseUrl: get(Session)?.baseUrl,
			...(clientOptions || {})
		});

		this.client.use({
			async onRequest({ request }) {
				const session = get(Session);
				if (session?.token) {
					request.headers.set('Authorization', 'Bearer ' + session.token);
				}
				return request;
			}
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
	// readonly $$comments: {
	// 	readonly $acls?: { [x: number]: string[][] };
	// };
}

export interface JsonComments {
	[x: string]: string[][];
}

export class User implements V1User {
	public static async list(headscale: Headscale = new Headscale()) {
		const response = await headscale.client.GET('/api/v1/user');
		return {
			...response,
			error: response.error ? new ApiError(response.error, { method: 'GET', path: '/api/v1/user' }) : undefined,
			data: response.data?.users?.map((user) => new User(user))
		};
	}

	public static async find(name: string, headscale: Headscale = new Headscale()) {
		const response = await headscale.client.GET('/api/v1/user/{name}', { params: { path: { name } } });
		return {
			...response,
			error: response.error ? new ApiError(response.error, { method: 'GET', path: '/api/v1/user/' + name }) : undefined,
			data: response.data?.user ? new User(response.data.user) : undefined
		};
	}

	public static async create(name: string, headscale: Headscale = new Headscale()) {
		const response = await headscale.client.POST('/api/v1/user', { body: { name } });
		return {
			...response,
			error: response.error ? new ApiError(response.error, { method: 'POST', path: '/api/v1/user' }) : undefined,
			data: response.data?.user ? new User(response.data.user) : undefined
		};
	}

	public readonly name?: string | undefined;
	public readonly id?: string | undefined;
	public readonly createdAt?: string | undefined;

	public constructor(data: V1User) {
		if (!data.name) throw new Error('Name is required to create a new User!');
		Object.assign(this, data);
	}

	public async rename(newName: string, headscale: Headscale = new Headscale()) {
		if (!this.name) throw new Error("User's name is undefined");
		const response = await headscale.client.POST('/api/v1/user/{oldName}/rename/{newName}', {
			params: { path: { oldName: this.name, newName } }
		});
		return {
			...response,
			error: response.error
				? new ApiError(response.error, { method: 'POST', path: `/api/v1/user/${this.name}/rename/${newName}` })
				: undefined,
			data: response.data?.user ? new User(response.data.user) : undefined
		};
	}

	public async delete(headscale: Headscale = new Headscale()) {
		if (!this.name) throw new Error("User's name is undefined");
		const response = await headscale.client.DELETE('/api/v1/user/{name}', { params: { path: { name: this.name } } });
		return {
			...response,
			error: response.error ? new ApiError(response.error, { method: 'DELETE', path: '/api/v1/user/' + this.name }) : undefined
		};
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
		return {
			...response,
			error: response.error ? new ApiError(response.error, { method: 'GET', path: '/api/v1/preauthkey' }) : undefined,
			data: response.data?.preAuthKeys?.map((key) => new PreAuthKey(key))
		};
	}

	public static async create(body: components['schemas']['v1CreatePreAuthKeyRequest'], headscale: Headscale = new Headscale()) {
		const response = await headscale.client.POST('/api/v1/preauthkey', { body });
		return {
			...response,
			error: response.error ? new ApiError(response.error, { method: 'POST', path: '/api/v1/preauthkey' }) : undefined,
			data: response.data?.preAuthKey ? new PreAuthKey(response.data.preAuthKey) : undefined
		};
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

	public constructor(data: V1PreAuthKey) {
		Object.assign(this, data);
	}

	public async expire(headscale: Headscale = new Headscale()) {
		const response = await headscale.client.POST('/api/v1/preauthkey/expire', { body: { key: this.key, user: this.user } });
		return {
			...response,
			error: response.error ? new ApiError(response.error, { method: 'POST', path: '/api/v1/preauthkey/expire' }) : undefined
		};
	}
}

export class Route implements V1Route {
	public static async list(headscale: Headscale = new Headscale()) {
		const response = await headscale.client.GET('/api/v1/routes');
		return {
			...response,
			error: response.error ? new ApiError(response.error, { method: 'GET', path: '/api/v1/routes' }) : undefined,
			data: response.data?.routes?.map((route) => new Route(route))
		};
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

	public constructor(data: V1Route) {
		Object.assign(this, data);
	}

	public async delete(headscale: Headscale = new Headscale()) {
		if (!this.id) throw new Error('Cannot create route without id.');
		const response = await headscale.client.DELETE('/api/v1/routes/{routeId}', { params: { path: { routeId: this.id } } });
		return {
			...response,
			error: response.error ? new ApiError(response.error, { method: 'DELETE', path: '/api/v1/routes/' + this.id }) : undefined
		};
	}

	public async disable(headscale: Headscale = new Headscale()) {
		if (!this.id) throw new Error('Cannot disable route without id.');
		const response = await headscale.client.POST('/api/v1/routes/{routeId}/disable', {
			params: { path: { routeId: this.id } }
		});
		return {
			...response,
			error: response.error
				? new ApiError(response.error, { method: 'POST', path: `/api/v1/routes/${this.id}/disable` })
				: undefined
		};
	}

	public async enable(headscale: Headscale = new Headscale()) {
		if (!this.id) throw new Error('Cannot enable route without id.');
		const response = await headscale.client.POST('/api/v1/routes/{routeId}/enable', { params: { path: { routeId: this.id } } });
		return {
			...response,
			error: response.error
				? new ApiError(response.error, { method: 'POST', path: `/api/v1/routes/${this.id}/enable` })
				: undefined
		};
	}
}

export class Machine implements V1Node {
	public static async get(nodeId: string, headscale: Headscale = new Headscale()) {
		const response = await headscale.client.GET('/api/v1/node/{nodeId}', { params: { path: { nodeId } } });
		return {
			...response,
			error: response.error ? new ApiError(response.error, { method: 'GET', path: '/api/v1/node/' + nodeId }) : undefined,
			data: response.data?.node ? new Machine(response.data.node) : undefined
		};
	}

	public static async list(user?: string, headscale: Headscale = new Headscale()) {
		const response = await headscale.client.GET('/api/v1/node', { params: { query: { user } } });
		return {
			...response,
			error: response.error ? new ApiError(response.error, { method: 'GET', path: '/api/v1/node' }) : undefined,
			data: response.data?.nodes?.map((machine) => new Machine(machine))
		};
	}

	public static async register(query: { key: string; user: string }, headscale: Headscale = new Headscale()) {
		const response = await headscale.client.POST('/api/v1/node/register', { params: { query } });
		return {
			...response,
			error: response.error ? new ApiError(response.error, { method: 'POST', path: '/api/v1/node/register' }) : undefined,
			data: response.data?.node ? new Machine(response.data.node) : undefined
		};
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

	public constructor(data: V1Node) {
		Object.assign(this, data);
	}

	public async delete(headscale: Headscale = new Headscale()) {
		if (!this.id) throw new Error('Failed to get machine instance id.');
		const response = await headscale.client.DELETE('/api/v1/node/{nodeId}', { params: { path: { nodeId: this.id } } });
		return {
			...response,
			error: response.error ? new ApiError(response.error, { method: 'DELETE', path: '/api/v1/node/' + this.id }) : undefined
		};
	}

	public async expire(headscale: Headscale = new Headscale()) {
		if (!this.id) throw new Error('Failed to get machine instance id.');
		const response = await headscale.client.POST('/api/v1/node/{nodeId}/expire', { params: { path: { nodeId: this.id } } });
		return {
			...response,
			error: response.error
				? new ApiError(response.error, { method: 'POST', path: `/api/v1/node/${this.id}/expire` })
				: undefined,
			data: response.data?.node ? new Machine(response.data.node) : undefined
		};
	}

	public async reassign(user: string, headscale: Headscale = new Headscale()) {
		if (!this.id) throw new Error('Failed to get machine instance id.');
		const response = await headscale.client.POST('/api/v1/node/{nodeId}/user', {
			params: { path: { nodeId: this.id }, query: { user } }
		});
		return {
			...response,
			error: response.error
				? new ApiError(response.error, { method: 'POST', path: `/api/v1/node/${this.id}/user` })
				: undefined,
			data: response.data?.node ? new Machine(response.data.node) : undefined
		};
	}

	public async rename(newName: string, headscale: Headscale = new Headscale()) {
		if (!this.id) throw new Error('Failed to get machine instance id.');
		const response = await headscale.client.POST('/api/v1/node/{nodeId}/rename/{newName}', {
			params: { path: { nodeId: this.id, newName } }
		});
		return {
			...response,
			error: response.error
				? new ApiError(response.error, { method: 'POST', path: `/api/v1/node/${this.id}/rename/${newName}` })
				: undefined,
			data: response.data?.node ? new Machine(response.data.node) : undefined
		};
	}

	public async setTags(tags: string[], headscale: Headscale = new Headscale()) {
		if (!this.id) throw new Error('Failed to get machine instance id.');
		const response = await headscale.client.POST('/api/v1/node/{nodeId}/tags', {
			params: { path: { nodeId: this.id } },
			body: { tags: tags.map((tag) => (tagRegex.test(tag) ? tag : `tag:${tag}`)) }
		});
		return {
			...response,
			error: response.error
				? new ApiError(response.error, { method: 'POST', path: `/api/v1/node/${this.id}/tags` })
				: undefined,
			data: response.data?.node ? new Machine(response.data.node) : undefined
		};
	}

	public async getRoutes(headscale: Headscale = new Headscale()) {
		if (!this.id) throw new Error('Failed to get machine instance id.');
		const response = await headscale.client.GET('/api/v1/node/{nodeId}/routes', { params: { path: { nodeId: this.id } } });
		return {
			...response,
			error: response.error
				? new ApiError(response.error, { method: 'GET', path: `/api/v1/node/${this.id}/routes` })
				: undefined,
			data: response.data?.routes?.map((route) => new Route(route))
		};
	}
}

export class ApiKey implements V1ApiKey {
	public static async list(headscale: Headscale = new Headscale()) {
		const response = await headscale.client.GET('/api/v1/apikey');
		return {
			...response,
			error: response.error ? new ApiError(response.error, { method: 'GET', path: '/api/v1/apikey' }) : undefined,
			data: response.data?.apiKeys?.map((key) => new ApiKey(key))
		};
	}

	public static async create(key: { expiration: string | number | Date }, headscale: Headscale = new Headscale()) {
		const response = await headscale.client.POST('/api/v1/apikey', {
			body: { expiration: (key.expiration instanceof Date ? key.expiration : new Date(key.expiration)).toISOString() }
		});

		// No data parsing required as it only returns the new API key as string
		return {
			...response,
			error: response.error ? new ApiError(response.error, { method: 'POST', path: '/api/v1/apikey' }) : undefined
		};
	}

	public readonly id?: string | undefined;
	public readonly prefix?: string | undefined;
	public readonly createdAt?: string | undefined;
	public readonly expiration?: string | undefined;
	public readonly lastSeen?: string | undefined;

	public constructor(data: V1ApiKey) {
		Object.assign(this, data);
	}

	public async expire(headscale: Headscale = new Headscale()) {
		const response = await headscale.client.POST('/api/v1/apikey/expire', { body: { prefix: this.prefix } });
		return {
			...response,
			error: response.error ? new ApiError(response.error, { method: 'POST', path: '/api/v1/apikey/expire' }) : undefined
		};
	}
}

export class Acl implements V1Policy {
	public static async load(headscale: Headscale = new Headscale()) {
		const response = await headscale.client.GET('/api/v1/policy');
		return {
			...response,
			error: response.error ? new ApiError(response.error, { method: 'GET', path: '/api/v1/policy' }) : undefined,
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

	public constructor(data: string, updatedAt?: string) {
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
			error: response.error ? new ApiError(response.error, { method: 'PUT', path: '/api/v1/policy' }) : undefined,
			data: response.data?.policy ? new Acl(response.data.policy, response.data.updatedAt) : undefined
		};
	}

	public reset(): Acl {
		return new Acl(this.raw);
	}
}

export class TestAcl {
	public readonly policy?: V1Policy;

	public readonly hosts: {
		name: string;
		cidr: string;
		description?: string;
	}[];
	public readonly groups: {
		name: string;
		members: string[];
		ownedTags: string[];
		description?: string;
	}[];
	public readonly tagOwners: {
		name: string;
		members: string[];
		description?: string;
	}[];
	public readonly acls: {
		action: 'accept';
		src: string[];
		dst: string[];
		proto?: string;
		description?: string;
	}[];

	get comments() {
		type CommentObj = { $$comments: { [x: string]: string[][] } };

		return {
			acls: (this.policy as { $$comments: { $acls: { [x: number]: string[][] } } } | undefined)?.$$comments?.$acls,
			groups: (this.policy?.groups as unknown as CommentObj | undefined)?.$$comments,
			tagOwners: (this.policy?.tagOwners as unknown as CommentObj | undefined)?.$$comments,
			hosts: (this.policy?.Hosts as unknown as CommentObj | undefined)?.$$comments
		};
	}

	public constructor(policy: string) {
		this.policy = policy?.length ? parse(stripJsonTrailingCommas(policy)) : undefined;

		const comments = this.comments;

		this.hosts = Object.entries(this.policy?.Hosts || {}).map(([name, cidr]) => ({
			name,
			cidr,
			description: comments.hosts?.[name]?.[0]?.[0]
		}));

		this.groups = Object.entries(this.policy?.groups || {}).map(([name, members]) => ({
			name,
			members,
			ownedTags: Object.entries(this.policy?.tagOwners || {})
				.filter((i) => i[1].includes(name))
				.map(([k]) => k),
			description: comments.groups?.[name]?.[0]?.[0]
		}));

		this.tagOwners = Object.entries(this.policy?.tagOwners || {}).map(([name, members]) => ({
			name,
			members,
			description: comments.tagOwners?.[name]?.[0]?.[0]
		}));

		this.acls = this.policy?.acls.map((val, index) => ({ ...val, description: comments.acls?.[index]?.[0]?.[0] })) || [];
	}
}
