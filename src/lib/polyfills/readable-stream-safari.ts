/**
 * Safari polyfill for ReadableStream async iterator support
 *
 * This polyfill addresses the issue where Safari doesn't support
 * ReadableStream[Symbol.asyncIterator], which is used by the phonemizer library.
 *
 * Only applies the polyfill when running in Safari to avoid unnecessary overhead
 * in other browsers that already support this feature.
 */

/**
 * Detects if the current browser is Safari
 */
function isSafari(): boolean {
	if (typeof navigator === 'undefined') return false;

	const userAgent = navigator.userAgent;
	const isSafariUA =
		/Safari/.test(userAgent) && !/Chrome/.test(userAgent) && !/Chromium/.test(userAgent);

	// Additional check for Safari-specific features
	const hasSafariFeatures = 'safari' in window || /^((?!chrome|android).)*safari/i.test(userAgent);

	return isSafariUA || hasSafariFeatures;
}

/**
 * Applies the ReadableStream async iterator polyfill for Safari
 */
export function applySafariReadableStreamPolyfill(): void {
	// Only apply if we're in a browser environment
	if (typeof ReadableStream === 'undefined' || typeof window === 'undefined') {
		return;
	}

	// Only apply the polyfill in Safari
	if (!isSafari()) {
		return;
	}

	// Check if the polyfill is needed
	if (ReadableStream.prototype[Symbol.asyncIterator]) {
		return;
	}

	console.log('Applying ReadableStream async iterator polyfill for Safari compatibility');

	// Apply the polyfill as suggested in the GitHub issue
	ReadableStream.prototype[Symbol.asyncIterator] = async function* () {
		const reader = this.getReader();
		try {
			while (true) {
				const { value, done } = await reader.read();
				if (done) break;
				yield value;
			}
		} finally {
			reader.releaseLock();
		}
	};
}
