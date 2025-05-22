/**
 * Downloads a model file with progress tracking
 * @param url URL of the model to download
 * @returns A File object containing the downloaded model
 */
export async function downloadModelWithProgress(
	url: string,
	onProgress: (progress: number) => void
): Promise<File> {
	// Reset progress tracking
	onProgress(0);

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

	// Convert the downloaded data to a Blob and then to a File
	const blob = new Blob([allChunks]);
	const fileName = url.split('/').pop() || 'downloaded-model';

	// Set progress to 100% when download is complete
	onProgress(100);

	// Return the File object that can be used by Transcribe.js
	return new File([blob], fileName);
}
