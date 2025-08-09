/**
 * Wake Lock state and functionality for keeping the screen on during active processes
 */
export function useWakeLock() {
	let wakeLock: WakeLockSentinel | null = $state(null);

	async function requestWakeLock(): Promise<void> {
		try {
			if ('wakeLock' in navigator && navigator.wakeLock) {
				if (wakeLock) {
					await wakeLock.release();
					wakeLock = null;
				}

				wakeLock = await navigator.wakeLock.request('screen');

				wakeLock.addEventListener('release', () => {
					wakeLock = null;
				});
			}
		} catch (err) {
			console.error('Could not acquire wake lock:', err);
			wakeLock = null;
		}
	}

	async function releaseWakeLock(): Promise<void> {
		if (wakeLock) {
			try {
				await wakeLock.release();
				wakeLock = null;
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

		document.addEventListener('visibilitychange', handleVisibilityChange);

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
