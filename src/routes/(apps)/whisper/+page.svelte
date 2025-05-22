<script lang="ts">
	import createModule from '@transcribe/shout';
	import { FileTranscriber } from '@transcribe/transcriber';
	import { downloadModelWithProgress, isModelCached, isOPFSSupported } from '$lib/download-utils';
	import { onMount, onDestroy } from 'svelte';
	import { whisperModel } from '$lib/stores';
	import { useWakeLock } from '$lib/wakeLock.svelte';

	let isReady = $state(false);
	let isLoading = $state(false);
	let isTranscribing = $state(false);
	let transcriber: FileTranscriber;
	let text = $state('');
	let error = $state(false);
	let transcribeProgress = $state(0);
	let previousProgress = $state(0);
	let downloadProgress = $state(0);
	let previousDownloadProgress = $state(0);
	let currentSegment = $state('');
	let usingCachedModel = $state(false);
	let opfsSupported = $state(true);
	let hasProgressTracking = $state(true);

	// Store full transcription data for formats
	let transcriptionData = $state<any>(null);
	let activeTab = $state<'text' | 'srt'>('text');
	let hasDownloaded = $state(false);

	// Initialize wake lock functionality
	const { requestWakeLock, releaseWakeLock, setupWakeLock } = useWakeLock();

	// Set up event listeners
	onMount(() => {
		// Set up wake lock management
		return setupWakeLock(() => isTranscribing);
	});

	// File upload state
	let selectedFile: File | null = $state(null);
	let transcribeMode = $state<'demo' | 'upload'>('upload');
	let fileInputElement = $state<HTMLInputElement | null>(null);

	// Drag and drop state
	let isDragging = $state(false);

	// Timeout tracking for stuck transcription
	let lastSegmentTime = $state(0);
	let stuckCheckInterval: number | null = null;
	let isStuck = $state(false);

	// Copy to clipboard state
	let hasCopied = $state(false);

	const DEFAULT_MODEL = 'https://files.khromov.se/whisper/ggml-tiny-q5_1.bin';

	// Model selection state
	let selectedModel = $state($whisperModel || DEFAULT_MODEL);
	const availableModels = [
		{ path: DEFAULT_MODEL, name: 'Whisper Tiny (q5_1)' },
		{
			path: 'https://files.khromov.se/whisper/ggml-tiny.en-q5_1.bin',
			name: 'Whisper Tiny English (q5_1)'
		},
		{ path: 'https://files.khromov.se/whisper/ggml-small-q5_1.bin', name: 'Whisper Small (q5_1)' },
		{
			path: 'https://files.khromov.se/whisper/ggml-small.en-q5_1.bin',
			name: 'Whisper Small English (q5_1)'
		},
		{
			path: 'https://files.khromov.se/whisper/ggml-medium-q5_0.bin',
			name: 'Whisper Medium (q5_0)'
		},
		{
			path: 'https://files.khromov.se/whisper/ggml-medium.en-q5_0.bin',
			name: 'Whisper Medium English (q5_0)'
		},
		{
			path: 'https://files.khromov.se/whisper/ggml-large-v2-q5_0.bin',
			name: 'Whisper Large (q5_0)'
		}
	];

	async function transcribe() {
		if (!transcriber?.isReady) return;
		if (transcribeMode === 'upload' && !selectedFile) return;

		text = '';
		currentSegment = '';
		isTranscribing = true;
		transcribeProgress = 0;
		previousProgress = 0;
		isStuck = false;
		lastSegmentTime = Date.now();
		transcriptionData = null;
		hasDownloaded = false;

		// Start checking for stuck transcription
		startStuckCheck();

		// Request wake lock to keep screen on during transcription
		await requestWakeLock();

		try {
			let result;
			if (transcribeMode === 'demo') {
				// Transcribe the demo file
				result = await transcriber.transcribe('/jfk.mp3', { lang: 'en' });
			} else {
				// Transcribe the uploaded file
				result = await transcriber.transcribe(selectedFile!, { lang: 'en' });
			}

			// Store the full result for different formats
			transcriptionData = result;

			// Extract the transcription text
			text = result.transcription.map((t) => t.text).join(' ');
		} catch (err) {
			console.error('Transcription error:', err);
			error = true;
			text = 'An error occurred during transcription. Please try again.';
		} finally {
			isTranscribing = false;
			transcribeProgress = 0;
			currentSegment = '';
			stopStuckCheck();

			// Release wake lock when done
			await releaseWakeLock();
		}
	}

	function startStuckCheck() {
		stuckCheckInterval = window.setInterval(() => {
			if (isTranscribing && Date.now() - lastSegmentTime > 60000) {
				isStuck = true;
				stopStuckCheck();
			}
		}, 5000); // Check every 5 seconds
	}

	function stopStuckCheck() {
		if (stuckCheckInterval) {
			clearInterval(stuckCheckInterval);
			stuckCheckInterval = null;
		}
	}

	function reloadPage() {
		window.location.reload();
	}

	// Convert transcription data to SRT format
	function convertToSRT(): string {
		if (!transcriptionData?.transcription?.length) return '';

		return transcriptionData.transcription
			.map((segment, index) => {
				// SRT format has these components:
				// 1. Index number
				// 2. Start time --> End time (in format 00:00:00,000)
				// 3. Text content
				// 4. Blank line
				const segmentIndex = index + 1;

				// Make sure timestamps are in correct SRT format (00:00:00,000)
				// The transcribe.js library already provides timestamps in this format
				const timeRange = `${segment.timestamps.from} --> ${segment.timestamps.to}`;
				const content = segment.text.trim();

				return `${segmentIndex}\n${timeRange}\n${content}\n`;
			})
			.join('\n');
	}

	// Download SRT file
	async function downloadSRT() {
		try {
			const srtContent = convertToSRT();
			const blob = new Blob([srtContent], { type: 'text/plain' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');

			a.href = url;
			const filename = selectedFile?.name
				? `${selectedFile.name.split('.').slice(0, -1).join('.')}.srt`
				: 'transcription.srt';
			a.download = filename;

			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);

			hasDownloaded = true;
			setTimeout(() => {
				hasDownloaded = false;
			}, 2000);
		} catch (err) {
			console.error('Failed to download SRT file:', err);
		}
	}

	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(text);
			hasCopied = true;
			setTimeout(() => {
				hasCopied = false;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy text:', err);
		}
	}

	function retry() {
		error = false;
		loadModel();
	}

	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			selectedFile = target.files[0];
			transcribeMode = 'upload';
		}
	}

	function selectDemoMode() {
		transcribeMode = 'demo';
		selectedFile = null;
		if (fileInputElement) {
			fileInputElement.value = '';
		}
	}

	// Drag and drop handlers
	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		if (!isReady) return;
		isDragging = true;
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		// Only set isDragging to false if we're leaving the drop zone entirely
		const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
		const x = event.clientX;
		const y = event.clientY;

		if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
			isDragging = false;
		}
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		isDragging = false;

		if (!isReady) return;

		const files = event.dataTransfer?.files;
		if (files && files.length > 0) {
			selectedFile = files[0];
			transcribeMode = 'upload';
		}
	}

	async function loadModel() {
		try {
			isLoading = true;
			error = false;

			// If there's already a transcriber loaded, clean it up first
			if (transcriber) {
				transcriber.destroy();
				isReady = false;
			}

			// Save the selected model to the store
			$whisperModel = selectedModel;

			console.log(`Loading model from: ${selectedModel}`);

			// Reset state
			usingCachedModel = false;
			downloadProgress = 0;
			hasProgressTracking = true;

			// Download the model with real progress tracking
			const modelFile = await downloadModelWithProgress(selectedModel, (progress, cached) => {
				previousDownloadProgress = downloadProgress;
				downloadProgress = progress;
				
				// Check for no progress tracking signal
				if (progress === -1) {
					hasProgressTracking = false;
					downloadProgress = 0;
					return;
				}
				
				// Update cached state
				if (cached) {
					usingCachedModel = true;
				}
			});

			// Create new instance with progress tracking
			transcriber = new FileTranscriber({
				createModule,
				model: modelFile, // Pass the downloaded File object instead of URL
				onReady: () => console.log('Transcriber ready'),
				onProgress: (progress) => {
					previousProgress = transcribeProgress;
					transcribeProgress = Math.round(progress);
					console.log(`Transcription progress: ${transcribeProgress}%`);
				},
				onSegment: (segment) => {
					console.log('New segment:', segment);
					// Update the current segment preview and reset timer
					currentSegment = segment.segment.text.trim();
					lastSegmentTime = Date.now();
					isStuck = false;
				},
				onComplete: (result) => console.log('Transcription complete:', result),
				onCanceled: () => console.log('Transcription canceled')
			});

			// Initialize the transcriber
			await transcriber.init();

			isReady = true;
		} catch (err) {
			console.error('Failed to initialize transcriber:', err);
			error = true;
		} finally {
			isLoading = false;
		}
	}

	// Function to change the model once one is already loaded
	function changeModel() {
		// This will trigger the loadModel function with the currently selected model
		isReady = false;
		loadModel();
	}

	// Load saved model on mount
	onMount(async () => {
		// Check OPFS support
		opfsSupported = isOPFSSupported();
		if (!opfsSupported) {
			console.log('OPFS not supported - models will not be cached');
		}
		
		// If we have a saved model, only load it if it's cached (or if OPFS not supported, don't autoload)
		if ($whisperModel) {
			selectedModel = $whisperModel;
			
			if (opfsSupported) {
				// Only autoload if the model is already cached
				const cached = await isModelCached($whisperModel);
				if (cached) {
					console.log('Autoloading cached model:', $whisperModel);
					loadModel();
				} else {
					console.log('Model not cached, user must manually load:', $whisperModel);
				}
			} else {
				console.log('OPFS not supported, user must manually load model:', $whisperModel);
			}
		}
	});

	// Clean up resources when component is destroyed
	onDestroy(() => {
		if (transcriber) {
			transcriber.destroy();
		}
		stopStuckCheck();
	});
</script>

<div class="card-interface" style="animation: fadeIn 0.5s ease-out;">
	<div class="toolbar">
		<span class="model-info">Whisper Audio Transcription</span>
	</div>

	<div class="content-area">
		<!-- Model Selection Section -->
		<div class="model-selection">
			<h3>Select Model</h3>
			<div class="model-controls">
				<select bind:value={selectedModel} disabled={isLoading}>
					{#each availableModels as model (model.path)}
						<option value={model.path}>{model.name}</option>
					{/each}
				</select>

				{#if !isReady}
					<button onclick={loadModel} disabled={isLoading} class="load-model-btn primary-button">
						{isLoading ? 'Loading Model...' : 'Load Model'}
					</button>
				{:else}
					<div class="model-controls-loaded">
						<div class="model-ready">
							<span class="checkmark">✓</span>
							Model Ready
						</div>
						{#if selectedModel !== $whisperModel}
							<button onclick={changeModel} disabled={isLoading} class="change-model-btn">
								{isLoading ? 'Changing...' : 'Change Model'}
							</button>
						{/if}
					</div>
				{/if}
			</div>

			{#if error}
				<div class="inline-error">
					<p>Failed to load transcription model. Please try again.</p>
					<button onclick={retry} disabled={isLoading} class="retry-btn">
						{isLoading ? 'Reloading...' : 'Retry'}
					</button>
				</div>
			{:else if isLoading}
				<div class="loading-progress">
					<h3>
						{usingCachedModel 
							? 'Loading Cached Model' 
							: opfsSupported 
								? 'Downloading Model' 
								: 'Loading Model'}
					</h3>
					{#if hasProgressTracking}
						<p class="download-percentage">{downloadProgress}% Complete</p>
					{:else}
						<p class="download-percentage">Loading...</p>
					{/if}
					<div class="progress-container">
						<div class="progress-bar">
							<div
								class="progress-bar-fill"
								style="width: {hasProgressTracking ? downloadProgress : 100}%; transition: width {downloadProgress >
								previousDownloadProgress
									? '0.3s'
									: '0s'} ease"
							></div>
						</div>
					</div>
					<p class="loading-message">
						{usingCachedModel 
							? 'Loading model from local cache...' 
							: opfsSupported
								? 'The transcription model is being downloaded to your browser.'
								: 'Loading model... Progress tracking not available in this browser.'}
					</p>
				</div>
			{/if}
		</div>

		<!-- Main Content (grayed out when model not ready) -->
		<div class="main-content" class:disabled={!isReady}>
			<div class="transcribe-options">
				<h3>Choose Audio Source</h3>

				<div class="option-group">
					<label class="option-label">
						<input
							type="radio"
							name="transcribeMode"
							value="upload"
							checked={transcribeMode === 'upload'}
							onchange={() => (transcribeMode = 'upload')}
							disabled={!isReady}
						/>
						<span class="option-content">
							<strong>Local File</strong>
							<small>Select an audio file from your device (.mp3, .wav, .m4a)</small>
						</span>
					</label>

					<label class="option-label">
						<input
							type="radio"
							name="transcribeMode"
							value="demo"
							checked={transcribeMode === 'demo'}
							onchange={selectDemoMode}
							disabled={!isReady}
						/>
						<span class="option-content">
							<strong>Demo Audio</strong>
							<small
								>Use the included JFK speech sample (<a href="/jfk.mp3" target="_blank"
									>listen to audio</a
								>)</small
							>
						</span>
					</label>
				</div>

				{#if transcribeMode === 'upload'}
					<div class="file-upload">
						<input
							bind:this={fileInputElement}
							type="file"
							accept="audio/*"
							onchange={handleFileSelect}
							id="audio-file"
							disabled={!isReady}
						/>
						<div
							class="file-upload-label"
							class:disabled={!isReady}
							class:dragging={isDragging}
							ondragover={handleDragOver}
							ondragleave={handleDragLeave}
							ondrop={handleDrop}
							onclick={() => fileInputElement?.click()}
						>
							<div class="upload-content">
								<svg
									class="upload-icon"
									viewBox="0 0 24 24"
									width="32"
									height="32"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
									<polyline points="7,10 12,15 17,10"></polyline>
									<line x1="12" y1="15" x2="12" y2="3"></line>
								</svg>
								<p class="upload-text">
									{selectedFile ? selectedFile.name : 'Choose audio file or drag and drop here'}
								</p>
								<p class="upload-hint">Supports MP3, WAV, M4A and other audio formats</p>
							</div>
						</div>
					</div>
				{/if}
			</div>

			{#if isTranscribing}
				<div class="transcribing">
					<h3>Transcribing Audio</h3>
					<p class="progress-percentage">{transcribeProgress}% Complete</p>
					<div class="progress-container">
						<div class="progress-bar">
							<div
								class="progress-bar-fill"
								style="width: {transcribeProgress}%; transition: width {transcribeProgress >
								previousProgress
									? '0.3s'
									: '0s'} ease"
							></div>
						</div>
					</div>

					{#if currentSegment}
						<div class="segment-preview">
							<h4>Current Segment</h4>
							<p>"{currentSegment}"</p>
						</div>
					{/if}

					{#if isStuck}
						<p class="stuck-message">
							Transcription seems stuck. <button class="reload-link" onclick={reloadPage}
								>Reload the page</button
							> and try again.
						</p>
					{:else}
						<p class="transcribing-message">
							⚠️ Keep this tab active during transcription to avoid issues.
						</p>
					{/if}
				</div>
			{:else if text}
				<div class="result-wrapper">
					<div class="result">
						<div class="result-content">
							<div class="result-header">
								<h3>Transcription Result:</h3>
								<div class="result-actions">
									<!-- Tab selectors only shown when there is transcription data -->
									{#if transcriptionData?.transcription?.length}
										<div class="tab-selectors">
											<button
												class:active={activeTab === 'text'}
												onclick={() => (activeTab = 'text')}
											>
												Text
											</button>
											<button
												class:active={activeTab === 'srt'}
												onclick={() => (activeTab = 'srt')}
											>
												SRT
											</button>
										</div>
									{/if}

									<!-- Action buttons based on active tab -->
									{#if !transcriptionData?.transcription?.length || activeTab === 'text'}
										<button class="copy-btn" onclick={copyToClipboard} class:copied={hasCopied}>
											{#if hasCopied}
												<svg
													class="copy-icon"
													viewBox="0 0 24 24"
													width="16"
													height="16"
													fill="none"
													stroke="currentColor"
													stroke-width="2"
												>
													<polyline points="20,6 9,17 4,12"></polyline>
												</svg>
												Copied!
											{:else}
												<svg
													class="copy-icon"
													viewBox="0 0 24 24"
													width="16"
													height="16"
													fill="none"
													stroke="currentColor"
													stroke-width="2"
												>
													<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
													<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
												</svg>
												Copy
											{/if}
										</button>
									{:else if activeTab === 'srt'}
										<button
											class="download-btn"
											onclick={downloadSRT}
											class:downloaded={hasDownloaded}
										>
											{#if hasDownloaded}
												<svg
													class="download-icon"
													viewBox="0 0 24 24"
													width="16"
													height="16"
													fill="none"
													stroke="currentColor"
													stroke-width="2"
												>
													<polyline points="20,6 9,17 4,12"></polyline>
												</svg>
												Downloaded!
											{:else}
												<svg
													class="download-icon"
													viewBox="0 0 24 24"
													width="16"
													height="16"
													fill="none"
													stroke="currentColor"
													stroke-width="2"
												>
													<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
													<polyline points="7 10 12 15 17 10"></polyline>
													<line x1="12" y1="15" x2="12" y2="3"></line>
												</svg>
												Download SRT
											{/if}
										</button>
									{/if}
								</div>
							</div>
							{#if !transcriptionData?.transcription?.length || activeTab === 'text'}
								<p>{text}</p>
							{:else if activeTab === 'srt' && transcriptionData?.transcription?.length}
								<pre class="srt-preview">{convertToSRT()}</pre>
							{/if}
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<div class="input-area" class:disabled={!isReady}>
		<button
			onclick={transcribe}
			disabled={!isReady || isTranscribing || (transcribeMode === 'upload' && !selectedFile)}
			class="transcribe-btn primary-button"
		>
			{isTranscribing ? 'Transcribing...' : 'Start Transcription'}
		</button>

		<div class="disclaimer">
			Transcription is performed locally in your browser. Results may not always be accurate.
		</div>
	</div>
</div>

<style>
	.model-selection {
		background-color: white;
		border-radius: 16px;
		padding: 1.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		margin-bottom: 1rem;
	}

	.model-selection h3 {
		margin-top: 0;
		margin-bottom: 1rem;
		font-size: 1.25rem;
		font-weight: 600;
		color: #333;
		text-align: center;
	}

	.model-controls {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
	}

	.model-controls select {
		padding: 0.75rem;
		border-radius: 12px;
		border: 1px solid #e1e1e1;
		font-size: 1rem;
		background-color: #f8f8f8;
		min-width: 250px;
		text-align: center;
	}

	.model-controls select:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.load-model-btn {
		min-width: 150px;
	}

	.model-ready {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: #28a745;
		font-weight: 500;
		font-size: 1rem;
	}

	.model-controls-loaded {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		align-items: center;
	}

	.change-model-btn {
		padding: 0.5rem 1rem;
		background-color: #f8f8f8;
		color: #333;
		border: 1px solid #e1e1e1;
		border-radius: 8px;
		cursor: pointer;
		font-size: 0.875rem;
		transition: all 0.2s ease;
	}

	.change-model-btn:hover {
		background-color: #e9ecef;
		border-color: #ced4da;
	}

	.change-model-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.checkmark {
		font-size: 1.25rem;
		font-weight: bold;
	}

	.inline-error {
		margin-top: 1rem;
		padding: 1rem;
		background-color: #feeced;
		border-radius: 12px;
		text-align: center;
	}

	.inline-error p {
		color: #ff3b30;
		margin: 0 0 0.75rem 0;
		font-size: 0.875rem;
	}

	.retry-btn {
		padding: 0.5rem 1rem;
		background-color: #ff3b30;
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-size: 0.875rem;
	}

	.retry-btn:hover {
		background-color: #e0352b;
	}

	.loading-progress {
		margin: 1rem 0;
		padding: 1.5rem;
		background-color: #f8f9ff;
		border: 1px solid #e1e5ff;
		border-radius: 12px;
		text-align: center;
		max-width: 100%;
		box-sizing: border-box;
	}

	.loading-progress h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1.25rem;
		font-weight: 600;
		color: #333;
	}

	.download-percentage {
		font-size: 1.125rem;
		font-weight: 500;
		color: #0071e3;
		margin: 0 0 1rem 0;
	}

	.loading-message {
		margin: 1rem 0 0 0;
		color: #666;
		font-size: 0.875rem;
		line-height: 1.4;
	}

	.main-content.disabled,
	.input-area.disabled {
		opacity: 0.3;
		pointer-events: none;
	}

	.transcribe-options {
		background-color: white;
		border-radius: 16px;
		padding: 1.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		margin-bottom: 1rem;
	}

	.transcribe-options h3 {
		margin-top: 0;
		margin-bottom: 1rem;
		font-size: 1.25rem;
		font-weight: 600;
		color: #333;
		text-align: center;
	}

	.option-group {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.option-label {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.875rem;
		border: 2px solid #e1e1e1;
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.option-label:hover {
		border-color: #0071e3;
		background-color: #f8f9ff;
	}

	.option-label:has(input:checked) {
		border-color: #0071e3;
		background-color: #f0f4ff;
	}

	.option-label input[type='radio'] {
		margin: 0;
		accent-color: #0071e3;
	}

	.option-content {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.option-content strong {
		font-size: 1rem;
		color: #333;
	}

	.option-content small {
		font-size: 0.875rem;
		color: #666;
	}

	.option-content small a {
		color: #0071e3;
		text-decoration: none;
	}

	.option-content small a:hover {
		text-decoration: underline;
	}

	.file-upload {
		margin-top: 0.5rem;
	}

	.file-upload input[type='file'] {
		display: none;
	}

	.file-upload-label {
		display: block;
		position: relative;
		min-height: 120px;
		background-color: #f8f8f8;
		border: 2px dashed #ccc;
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.2s ease;
		overflow: hidden;
	}

	.file-upload-label:hover:not(.disabled) {
		border-color: #0071e3;
		background-color: #f0f4ff;
	}

	.file-upload-label.disabled {
		cursor: not-allowed;
	}

	.file-upload-label.dragging {
		border-color: #0071e3;
		background-color: #f0f4ff;
		border-style: solid;
	}

	.upload-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
		height: 100%;
		min-height: 120px;
	}

	.upload-icon {
		color: #0071e3;
		margin-bottom: 0.75rem;
	}

	.upload-text {
		font-size: 1rem;
		color: #333;
		margin: 0 0 0.25rem 0;
		text-align: center;
		font-weight: 500;
	}

	.upload-hint {
		font-size: 0.875rem;
		color: #666;
		margin: 0;
		text-align: center;
	}

	.transcribing {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2rem;
		background-color: white;
		border-radius: 16px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		margin: 1rem 0;
		animation: fadeIn 0.3s ease-in-out;
	}

	.transcribing h3 {
		margin-top: 0;
		margin-bottom: 0.5rem;
		font-size: 1.375rem;
		font-weight: 600;
		color: #333;
	}

	.progress-percentage {
		font-size: 1.125rem;
		font-weight: 500;
		color: #0071e3;
		margin-bottom: 1rem;
	}

	.segment-preview {
		margin: 1rem 0;
		padding: 1rem;
		background-color: #f8f9ff;
		border: 1px solid #e1e5ff;
		border-radius: 12px;
		width: 100%;
		max-width: 400px;
		animation: fadeIn 0.3s ease-in-out;
	}

	.segment-preview h4 {
		text-align: center;
		margin: 0 0 0.5rem 0;
		font-size: 0.875rem;
		font-weight: 600;
		color: #555;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.segment-preview p {
		margin: 0;
		font-size: 0.9375rem;
		line-height: 1.4;
		color: #333;
		font-style: italic;
	}

	.transcribing-message {
		margin-top: 1rem;
		color: #666;
		font-weight: 500;
		text-align: center;
		background-color: #fff3cd;
		padding: 0.75rem 1rem;
		border-radius: 8px;
		border: 1px solid #ffeaa8;
	}

	.stuck-message {
		margin-top: 1rem;
		color: #ff3b30;
		font-weight: 500;
		text-align: center;
		background-color: #feeced;
		padding: 0.75rem 1rem;
		border-radius: 8px;
		border: 1px solid #ffcccc;
	}

	.reload-link {
		background: none;
		border: none;
		color: #0071e3;
		text-decoration: underline;
		cursor: pointer;
		font-size: inherit;
		font-weight: inherit;
		padding: 0;
	}

	.reload-link:hover {
		text-decoration: none;
	}

	.result-wrapper {
		display: flex;
		margin: 1rem 0;
		width: 100%;
		animation: fadeIn 0.3s ease-in-out;
	}

	.result {
		position: relative;
		width: 100%;
		max-width: 100%;
	}

	.result-content {
		padding: 1.25rem;
		border-radius: 16px;
		font-size: 1.0625rem;
		line-height: 1.5;
		white-space: pre-wrap;
		word-break: break-word;
		background-color: #e5e5ea;
		color: #000;
		box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
	}

	.result-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.75rem;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.result-content h3 {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 600;
		color: #333;
	}

	.result-content p {
		margin: 0;
	}

	.result-actions {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	/* Tab selectors */
	.tab-selectors {
		display: flex;
		border-radius: 8px;
		overflow: hidden;
		border: 1px solid #e1e1e1;
	}

	.tab-selectors button {
		padding: 0.5rem 0.75rem;
		background-color: #f8f8f8;
		border: none;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 500;
		color: #666;
		transition: all 0.2s ease;
	}

	.tab-selectors button:not(:last-child) {
		border-right: 1px solid #e1e1e1;
	}

	.tab-selectors button:hover:not(.active) {
		background-color: #f0f0f0;
	}

	.tab-selectors button.active {
		background-color: #0071e3;
		color: white;
	}

	/* SRT Preview */
	.srt-preview {
		font-family: monospace;
		font-size: 0.9rem;
		line-height: 1.5;
		white-space: pre-wrap;
		background-color: #f8f8f8;
		padding: 1rem;
		border-radius: 8px;
		border: 1px solid #e1e1e1;
		overflow-x: auto;
		margin: 0;
	}

	.copy-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		background-color: #0071e3;
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 500;
		transition: all 0.2s ease;
	}

	.copy-btn:hover {
		background-color: #0062cc;
	}

	.copy-btn.copied {
		background-color: #28a745;
	}

	.download-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		background-color: #0071e3;
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 500;
		transition: all 0.2s ease;
	}

	.download-btn:hover {
		background-color: #0062cc;
	}

	.download-btn.downloaded {
		background-color: #28a745;
	}

	.download-icon {
		width: 16px;
		height: 16px;
	}

	.copy-icon {
		width: 16px;
		height: 16px;
	}

	.transcribe-btn {
		margin: 0 auto;
		display: block;
		min-width: 250px;
		text-align: center;
	}

	.transcribe-btn:disabled {
		background-color: #b0b0b0;
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
	}

	/* Progress bar styling */
	.progress-container {
		width: 100%;
		max-width: 300px;
		margin: 0.5rem auto;
		box-sizing: border-box;
	}

	.progress-bar {
		height: 0.6rem;
		background-color: #e1e1e1;
		border-radius: 8px;
		overflow: hidden;
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	.progress-bar-fill {
		height: 100%;
		background-color: #0071e3;
		border-radius: 8px;
		background-image: linear-gradient(
			45deg,
			rgba(255, 255, 255, 0.15) 25%,
			transparent 25%,
			transparent 50%,
			rgba(255, 255, 255, 0.15) 50%,
			rgba(255, 255, 255, 0.15) 75%,
			transparent 75%,
			transparent
		);
		background-size: 1rem 1rem;
		animation: progress-animation 1s linear infinite;
	}

	/* Fade-in animation */
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes progress-animation {
		0% {
			background-position: 0 0;
		}
		100% {
			background-position: 1rem 0;
		}
	}

	/* Responsive adjustments */
	@media (max-width: 600px) {
		.model-controls {
			align-items: stretch;
		}

		.model-controls select {
			min-width: auto;
		}

		.transcribe-options {
			padding: 1rem;
		}

		.option-group {
			gap: 0.5rem;
		}

		.option-label {
			padding: 0.75rem;
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}

		.result-content {
			font-size: 1rem;
			padding: 1rem;
		}

		.result-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.75rem;
		}

		.result-actions {
			width: 100%;
			flex-direction: column;
			align-items: flex-start;
			gap: 0.75rem;
		}

		.tab-selectors {
			width: 100%;
		}

		.tab-selectors button {
			flex: 1;
		}

		.copy-btn,
		.download-btn {
			width: 100%;
			justify-content: center;
		}

		.transcribing {
			padding: 1.5rem;
		}

		.segment-preview {
			max-width: none;
		}

		.upload-content {
			padding: 1rem;
			min-height: 100px;
		}
	}
</style>
