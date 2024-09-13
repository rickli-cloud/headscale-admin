import { writable } from 'svelte/store';

enum StorageIdentifiers {
	base = 'headscale.admin.',
	token = base + 'session.token',
	baseurl = base + 'session.baseUrl'
}

export interface SessionData {
	token: string;
	baseUrl?: string;
}

export const Session = writable<SessionData | undefined>();

export function loadSession() {
	const session: Partial<SessionData> = {
		token: sessionStorage.getItem(StorageIdentifiers.token) || undefined,
		baseUrl: sessionStorage.getItem(StorageIdentifiers.baseurl) || undefined
	};

	if (session.token) {
		Session.set(session as SessionData);
	}

	return !!session.token;
}

export function initSession(data: SessionData) {
	Session.set(data);
	sessionStorage.setItem(StorageIdentifiers.token, data.token);
	if (data.baseUrl) sessionStorage.setItem(StorageIdentifiers.baseurl, data.baseUrl);
}

export function endSession() {
	Session.set(undefined);
	sessionStorage.removeItem(StorageIdentifiers.token);
	sessionStorage.removeItem(StorageIdentifiers.baseurl);
}
