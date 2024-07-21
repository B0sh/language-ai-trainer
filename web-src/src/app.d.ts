export interface Eel {
	expose(fn: Function, key: string): void;
	[key: string]: (...args: any[]) => (...args: any[]) => Promise<any>;
}

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface Window {
		eel: Eel;
	}
}

export {};
