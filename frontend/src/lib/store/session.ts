import { writable } from 'svelte/store';

const baseKey = 'headscale.admin.';
const tokenKey = baseKey + 'session.token';
const baseurlKey = baseKey + 'session.baseUrl';

export interface SessionData {
	token: string;
	baseUrl?: string;
}

export const Session = writable<SessionData | undefined>();

export function loadSession() {
	const session: Partial<SessionData> = {
		token: sessionStorage.getItem(tokenKey) || undefined,
		baseUrl: sessionStorage.getItem(baseurlKey) || undefined
	};

	if (session.token) {
		Session.set(session as SessionData);
	}

	return !!session.token;
}

export function initSession(data: SessionData) {
	Session.set(data);
	sessionStorage.setItem(tokenKey, data.token);
	if (data.baseUrl) sessionStorage.setItem(baseurlKey, data.baseUrl);
}

export function endSession() {
	Session.set(undefined);
	sessionStorage.removeItem(tokenKey);
	sessionStorage.removeItem(baseurlKey);
}
