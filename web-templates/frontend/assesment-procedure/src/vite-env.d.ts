/// <reference types="vite/client" />

declare global {
	interface Window {
		_app?: {
			backendId?: string;
			baseServerPath?: string;
		};
	}
}

export {};
