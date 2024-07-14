import { get } from 'svelte/store';
import { base } from '$app/paths';

import {
	Api,
	V1RegisterMethod,
	type RequestParams,
	type V1ApiKey,
	type V1Machine,
	type V1PreAuthKey,
	type V1Route,
	type V1User
} from './api.js';

export class Headscale extends Api<unknown> {
	constructor(customFetch: typeof fetch = fetch) {
		super({
			httpAgent: customFetch,
			httpsAgent: customFetch,
			validateStatus() {
				// Handled using response interceptor
				return true;
			}
		});

		this.instance.interceptors.response.use(
			(res) => {
				if (res.status > 300) {
					if ((res.status === 500 && res.data === 'Unauthorized') || res.status === 401) {
						console.error('Unauthorized');
					}

					return { ...res, data: {} };
				}

				return res;
			},
			(err) => {
				throw err;
			}
		);
	}
}

export type V1Tag = `tag:${string}`;
export const tagRegex = /^tag:/;

export class User implements V1User {
	/* Static methods */
	public static async list(
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<User[] | undefined> {
		const { data } = await headscale.api.headscaleServiceListUsers(requestParams);
		return data.users?.map((user) => new User(user));
	}

	public static async find(
		name: string,
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<User | undefined> {
		const { data } = await headscale.api.headscaleServiceGetUser(name, requestParams);
		return data.user ? new User(data.user) : undefined;
	}

	public static async create(
		name: string,
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<User | undefined> {
		const { data } = await headscale.api.headscaleServiceCreateUser({ name }, requestParams);
		return data.user ? new User(data.user) : undefined;
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
		const { data } = await headscale.api.headscaleServiceRenameUser(
			this.name,
			newName,
			requestParams
		);
		return data.user ? new User(data.user) : undefined;
	}

	public async delete(
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<void> {
		await headscale.api.headscaleServiceDeleteUser(this.name, requestParams);
	}

	public async getPreAuthKeys(
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<PreAuthKey[] | undefined> {
		const { data } = await headscale.api.headscaleServiceListPreAuthKeys(
			{ user: this.name },
			requestParams
		);
		return data.preAuthKeys?.map((key) => new PreAuthKey(key));
	}

	public async getMachines(
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<Machine[] | undefined> {
		const { data } = await headscale.api.headscaleServiceListMachines(
			{ user: this.name },
			requestParams
		);
		return data.machines?.map((machine) => new Machine(machine));
	}
}

export class PreAuthKey implements V1PreAuthKey {
	/* Static methods */
	public static async find(
		user?: string | undefined,
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<PreAuthKey[] | undefined> {
		const { data } = await headscale.api.headscaleServiceListPreAuthKeys({ user }, requestParams);
		return data.preAuthKeys?.map((key) => new PreAuthKey(key));
	}

	public static async create(
		key: V1PreAuthKey,
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<PreAuthKey | undefined> {
		const { data } = await headscale.api.headscaleServiceCreatePreAuthKey(key, requestParams);
		return data.preAuthKey ? new PreAuthKey(data.preAuthKey) : undefined;
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
		await headscale.api.headscaleServiceExpirePreAuthKey(
			{ key: this.key, user: this.user },
			requestParams
		);
	}
}

export class Route implements V1Route {
	/* Static methods */
	public static async list(
		machineId?: string | undefined,
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<Route[] | undefined> {
		const { data } = await (machineId
			? headscale.api.headscaleServiceGetMachineRoutes(machineId, requestParams)
			: headscale.api.headscaleServiceGetRoutes(requestParams));
		return data.routes?.map((route) => new Route(route));
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
	public readonly machine?: V1Machine | undefined;

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
		await headscale.api.headscaleServiceDeleteRoute(this.id, requestParams);
	}

	public async disable(
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<void> {
		if (!this.id) throw new Error('Internal: Cannot disable route without id.');
		await headscale.api.headscaleServiceDisableRoute(this.id, requestParams);
	}

	public async enable(
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<void> {
		if (!this.id) throw new Error('Internal: Cannot enable route without id.');
		await headscale.api.headscaleServiceEnableRoute(this.id, requestParams);
	}
}

export class Machine implements V1Machine {
	/* Static methods */
	public static async get(
		id: string,
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	) {
		const { data } = await headscale.api.headscaleServiceGetMachine(id, requestParams);
		return data.machine ? new Machine(data.machine) : undefined;
	}

	public static async list(
		user?: string,
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	) {
		const { data } = await headscale.api.headscaleServiceListMachines({ user }, requestParams);
		return data.machines?.map((machine) => new Machine(machine));
	}

	public static async register(
		machine: { key: string; user: string },
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<Machine | undefined> {
		const { data } = await headscale.api.headscaleServiceRegisterMachine(machine, requestParams);
		return data.machine ? new Machine(data.machine) : undefined;
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
	constructor(data: V1Machine) {
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
		await headscale.api.headscaleServiceDeleteMachine(this.id, requestParams);
	}

	public async expire(
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<Machine | undefined> {
		if (!this.id) throw new Error('Internal: Failed to get machine instance id.');
		const { data } = await headscale.api.headscaleServiceExpireMachine(this.id, requestParams);
		return data.machine ? new Machine(data.machine) : undefined;
	}

	public async reassign(
		user: string,
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<Machine | undefined> {
		if (!this.id) throw new Error('Internal: Failed to get machine instance id.');
		const { data } = await headscale.api.headscaleServiceMoveMachine(
			this.id,
			{ user },
			requestParams
		);
		return data.machine ? new Machine(data.machine) : undefined;
	}

	public async rename(
		newName: string,
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<Machine | undefined> {
		if (!this.id) throw new Error('Internal: Failed to get machine instance id.');
		const { data } = await headscale.api.headscaleServiceRenameMachine(
			this.id,
			newName,
			requestParams
		);
		return data.machine ? new Machine(data.machine) : undefined;
	}

	public async setTags(
		tags: string[],
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<Machine | undefined> {
		if (!this.id) throw new Error('Internal: Failed to get machine instance id.');
		const { data } = await headscale.api.headscaleServiceSetTags(
			this.id,
			{ tags: tags.map((tag) => (tagRegex.test(tag) ? tag : `tag:${tag}`)) },
			requestParams
		);
		return data.machine ? new Machine(data.machine) : undefined;
	}

	public async getRoutes(
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<Route[] | undefined> {
		if (!this.id) throw new Error('Internal: Failed to get machine instance id.');
		const { data } = await headscale.api.headscaleServiceGetMachineRoutes(this.id, requestParams);
		return data.routes?.map((route) => new Route(route));
	}
}

export class ApiKey implements V1ApiKey {
	/* Static methods */
	public static async list(
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<ApiKey[] | undefined> {
		const { data } = await headscale.api.headscaleServiceListApiKeys(requestParams);
		return data.apiKeys?.map((key) => new ApiKey(key));
	}

	/** Only returns the full new key as string. Content needs to be reloaded */
	public static async create(
		key: { expiration: string | number | Date },
		headscale: Headscale = new Headscale(),
		requestParams?: RequestParams
	): Promise<string | undefined> {
		const { data } = await headscale.api.headscaleServiceCreateApiKey(
			{
				expiration: (key.expiration instanceof Date
					? key.expiration
					: new Date(key.expiration)
				).toISOString()
			},
			requestParams
		);
		return data.apiKey;
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
		await headscale.api.headscaleServiceExpireApiKey({ prefix: this.prefix }, requestParams);
	}
}
