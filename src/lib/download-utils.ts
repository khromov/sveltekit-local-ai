import { PUBLIC_DISABLE_OPFS } from '$env/static/public';

/**
 * Gets the model file name from URL
 */
function getModelFileName(url: string): string {
	return url.split('/').pop() || 'downloaded-model';
}

/**
 * Checks if OPFS is supported in the current browser
 */
export function isOPFSSupported(): boolean {
	// Check if OPFS is disabled via environment variable
	if (PUBLIC_DISABLE_OPFS === 'true') {
		console.log('OPFS disabled via PUBLIC_DISABLE_OPFS environment variable');
		return false;
	}

	return 'navigator' in globalThis && 'storage' in navigator && 'getDirectory' in navigator.storage;
}

/**
 * Gets a cached model from OPFS
 */
async function getCachedModel(fileName: string): Promise<File | null> {
	if (!isOPFSSupported()) {
		return null;
	}

	try {
		const opfsRoot = await navigator.storage.getDirectory();
		const fileHandle = await opfsRoot.getFileHandle(fileName);
		const file = await fileHandle.getFile();
		console.log(`Found cached model: ${fileName}`);
		return file;
	} catch (error) {
		// File doesn't exist in cache
		console.log(`Model not cached: ${fileName}`);
		return null;
	}
}

/**
 * Saves a model to OPFS cache
 */
async function cacheModel(fileName: string, data: Uint8Array): Promise<void> {
	if (!isOPFSSupported()) {
		return;
	}

	try {
		const opfsRoot = await navigator.storage.getDirectory();
		const fileHandle = await opfsRoot.getFileHandle(fileName, { create: true });
		const writable = await fileHandle.createWritable();
		await writable.write(new Uint8Array(data));
		await writable.close();
		console.log(`Cached model: ${fileName}`);
	} catch (error) {
		console.error('Failed to cache model:', error);
	}
}

/**
 * Downloads a model file with progress tracking and OPFS caching
 * @param url URL of the model to download
 * @param onProgress Progress callback function
 * @returns A File object containing the model and cache info
 */
export async function downloadModelWithProgress(
	url: string,
	onProgress: (progress: number, cached?: boolean) => void
): Promise<File> {
	const fileName = getModelFileName(url);

	// Check if model is already cached (only if OPFS is supported)
	const cachedModel = await getCachedModel(fileName);
	if (cachedModel) {
		onProgress(100, true);
		console.log(`Using cached model: ${fileName}`);
		return cachedModel;
	}

	// Reset progress tracking
	onProgress(0);
	console.log(`Downloading model from: ${url}`);

	// If OPFS is not supported, use simple fetch without progress tracking
	if (!isOPFSSupported()) {
		console.log('OPFS not supported, using simple fetch');
		onProgress(-1); // Signal no progress tracking available
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Failed to download model: ${response.statusText}`);
		}

		const blob = await response.blob();
		onProgress(100);
		console.log(`Downloaded model without progress tracking: ${fileName}`);
		return new File([blob], fileName);
	}

	// Fetch the model with progress tracking
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Failed to download model: ${response.statusText}`);
	}

	// Get total file size from Content-Length header
	const contentLength = response.headers.get('Content-Length');
	const total = contentLength ? parseInt(contentLength, 10) : 0;

	// Create a reader from the response body stream
	const reader = response.body?.getReader();

	if (!reader) {
		throw new Error('Failed to read response body');
	}

	// Create an array to hold the chunks
	const chunks: Uint8Array[] = [];
	let receivedLength = 0;

	// Process the data stream
	while (true) {
		const { done, value } = await reader.read();

		if (done) {
			break;
		}

		// Add the chunk to our array
		chunks.push(value);
		receivedLength += value.length;

		// Update the progress (as a percentage)
		if (total) {
			const progress = Math.round((receivedLength / total) * 100);
			onProgress(progress);
			console.log(`Model download progress: ${progress}%`);
		}
	}

	// Combine the chunks into a single Uint8Array
	const allChunks = new Uint8Array(receivedLength);
	let position = 0;

	for (const chunk of chunks) {
		allChunks.set(chunk, position);
		position += chunk.length;
	}

	// Cache the model for future use
	await cacheModel(fileName, allChunks);

	// Convert the downloaded data to a Blob and then to a File
	const blob = new Blob([allChunks]);

	// Set progress to 100% when download is complete
	onProgress(100);

	// Return the File object that can be used by Transcribe.js
	return new File([blob], fileName);
}

/**
 * Clears all cached models from OPFS
 */
export async function clearModelCache(): Promise<void> {
	if (!isOPFSSupported()) {
		console.log('OPFS not supported, cannot clear cache');
		return;
	}

	try {
		const opfsRoot = await navigator.storage.getDirectory();

		// List all files and remove model files
		for await (const [name, handle] of (opfsRoot as any).entries()) {
			if (handle.kind === 'file' && name.endsWith('.bin')) {
				await opfsRoot.removeEntry(name);
				console.log(`Removed cached model: ${name}`);
			}
		}

		console.log('Model cache cleared');
	} catch (error) {
		console.error('Failed to clear model cache:', error);
	}
}

/**
 * Checks if a model is cached locally
 */
export async function isModelCached(url: string): Promise<boolean> {
	const fileName = getModelFileName(url);
	const cachedModel = await getCachedModel(fileName);
	return cachedModel !== null;
}

/**
 * Gets information about cached models
 */
export async function getCacheInfo(): Promise<{ fileName: string; size: number }[]> {
	if (!isOPFSSupported()) {
		return [];
	}

	const cacheInfo: { fileName: string; size: number }[] = [];

	try {
		const opfsRoot = await navigator.storage.getDirectory();

		for await (const [name, handle] of (opfsRoot as any).entries()) {
			if (handle.kind === 'file' && name.endsWith('.bin')) {
				const file = await handle.getFile();
				cacheInfo.push({
					fileName: name,
					size: file.size
				});
			}
		}
	} catch (error) {
		console.error('Failed to get cache info:', error);
	}

	return cacheInfo;
}
