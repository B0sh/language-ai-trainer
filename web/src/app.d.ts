/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Eel {
	expose(fn: (...args: any) => any, key: string): void;
	[key: string]: (...args: any[]) => (...args: any[]) => Promise<any>;
}


declare global {
	namespace App {

	}

	interface Window {
		eel: Eel;
	}
}

export {};
