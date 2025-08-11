// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	// Screen Wake Lock API definitions
	interface WakeLockSentinel {
		readonly released: boolean;
		readonly type: 'screen';
		release(): Promise<void>;
		addEventListener(type: string, listener: EventListener): void;
		removeEventListener(type: string, listener: EventListener): void;
	}

	interface WakeLock {
		request(type: 'screen'): Promise<WakeLockSentinel>;
	}

	interface Navigator {
		wakeLock?: WakeLock;
	}

	// Unplugin Icons type declarations
	declare module 'virtual:icons/*' {
		import { SvelteComponent } from 'svelte';
		const component: typeof SvelteComponent;
		export default component;
	}
}

export {};
