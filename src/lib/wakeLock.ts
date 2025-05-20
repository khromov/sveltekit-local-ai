import { onMount } from 'svelte';

/**
 * Wake Lock state and functionality for keeping the screen on during active processes
 */
export function useWakeLock() {
	// Wake lock state
	let wakeLock: WakeLockSentinel | null = $state(null);

	/**
	 * Request a screen wake lock to keep screen on
	 */
	async function requestWakeLock(): Promise<void> {
		try {
			if ('wakeLock' in navigator && navigator.wakeLock) {
				// Release any existing wake lock
				if (wakeLock) {
					await wakeLock.release();
					wakeLock = null;
				}

				// Request a new wake lock
				wakeLock = await navigator.wakeLock.request('screen');
				console.log('Wake lock acquired');

				// Add event listener for when wake lock is released
				wakeLock.addEventListener('release', () => {
					console.log('Wake lock released');
					wakeLock = null;
				});
			}
		} catch (err) {
			console.error('Could not acquire wake lock:', err);
			wakeLock = null;
		}
	}

	/**
	 * Release any active wake lock
	 */
	async function releaseWakeLock(): Promise<void> {
		if (wakeLock) {
			try {
				await wakeLock.release();
				wakeLock = null;
				console.log('Wake lock released');
			} catch (err) {
				console.error('Error releasing wake lock:', err);
			}
		}
	}

	/**
	 * Set up wake lock management in component
	 * @param isActiveGetter Function that returns whether the process is active (e.g., isTranscribing or isGenerating)
	 * @returns Cleanup function for onMount
	 */
	function setupWakeLock(isActiveGetter: () => boolean): () => void {
		// Handle visibility change events to reacquire wake lock if needed
		function handleVisibilityChange() {
			if (document.visibilityState === 'visible' && isActiveGetter() && !wakeLock) {
				requestWakeLock();
			}
		}

		// Set up visibility change listener
		document.addEventListener('visibilitychange', handleVisibilityChange);

		// Return cleanup function
		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
			releaseWakeLock();
		};
	}

	return {
		requestWakeLock,
		releaseWakeLock,
		setupWakeLock
	};
}
