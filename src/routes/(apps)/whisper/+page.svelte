<script lang="ts">
	import { onMount } from 'svelte';
	import { pipeline, env } from '@xenova/transformers';

	let modelPipeline: any = $state(null); // For Transformers.js pipeline

	let isReady = $state(false);
	let isLoading = $state(false);
	let isTranscribing = $state(false);
	let text = $state('');
	let error = $state(false);
	let transcribeProgress = $state(0);
	let previousProgress = $state(0); // Keep for now, might be useful for UI
	let currentSegment = $state('');
	
	// Store full transcription data for formats
	let transcriptionData = $state<any>(null);
	let activeTab = $state<'text' | 'srt'>('text');
	let hasDownloaded = $state(false);

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

	const DEFAULT_MODEL = 'Xenova/whisper-tiny'; // Updated model name

	// Model selection state
	let selectedModel = $state(DEFAULT_MODEL);
	const availableModels = [ // Updated to Hugging Face model identifiers
		{ path: 'Xenova/whisper-tiny', name: 'Whisper Tiny' },
		{ path: 'Xenova/whisper-base', name: 'Whisper Base' },
		{ path: 'Xenova/whisper-small', name: 'Whisper Small' },
		{ path: 'Xenova/whisper-medium', name: 'Whisper Medium' },
		// { path: 'Xenova/whisper-large-v3', name: 'Whisper Large v3' }, // Usually too large for browser
	];

	async function transcribe() {
		if (!modelPipeline || !isReady) return;
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

		try {
			let audioData: AudioBufferSourceNode | ArrayBuffer | string;
			let progressHandler: ((p: any) => void) | undefined;

			if (transcribeMode === 'demo') {
				const response = await fetch('/jfk.mp3');
				audioData = await response.arrayBuffer();
				console.log('Transcribing demo file /jfk.mp3');
			} else if (selectedFile) {
				const reader = new FileReader();
				audioData = await new Promise((resolve, reject) => {
					reader.onload = (e) => resolve(e.target?.result as ArrayBuffer);
					reader.onerror = (e) => reject(e.target?.error);
					reader.readAsArrayBuffer(selectedFile);
				});
				console.log('Transcribing uploaded file:', selectedFile.name);
			} else {
				return; // Should not happen if checks are correct
			}
			
			// Define a progress handler for transcription
			progressHandler = (progress) => {
				console.log('Transcription progress:', progress);
				// Example progress: { status: "progress", chunk: ..., progress: 0-100 }
				// This progress callback in whisper is per-chunk, not overall.
				// We might need a more sophisticated way to show overall progress,
				// or just use the segment updates as an indicator.
				// For now, let's update transcribeProgress based on the last reported chunk progress
				if (progress.status === 'progress' && typeof progress.progress === 'number') {
					// Let's assume we have an estimated number of chunks or use a moving average.
					// Simplistic approach: show progress for current chunk, but this won't be overall.
					// A better approach might be to count chunks if possible, or use the callback_function's calls.
					// For now, we'll keep the main progress bar for model loading and use currentSegment for transcription feedback.
				}
			};
			
			// Define a callback function for segment updates
			const segmentCallback = (data: any) => {
				// Type: "transcribe", data: { chunks: [], text: "..." }
				// Type: "progress", data: { progress: ..., text: "..." } -> this is actually the segment
				console.log('Segment callback:', data);
				if (data.type === 'transcribe' && data.data?.text) {
					currentSegment = data.data.text.trim();
					lastSegmentTime = Date.now();
					isStuck = false;
					// Update overall text if needed, or wait for final result
					// text = data.data.text; // This would make the main text update live
				} else if (Array.isArray(data)) { // Sometimes it sends an array of chunks directly
					const latestChunk = data[data.length-1];
					if (latestChunk?.text) {
						currentSegment = latestChunk.text.trim();
						lastSegmentTime = Date.now();
						isStuck = false;
					}
				}
			};

			const result = await modelPipeline(audioData, {
				chunk_length_s: 30,
				stride_length_s: 5,
				language: 'english', // TODO: Make this configurable
				task: 'transcribe',
				progress_callback: progressHandler, // For per-chunk progress if implemented by model
				callback_function: segmentCallback // For interim results (segments)
			});

			// Store the full result for different formats
			transcriptionData = result; // result should have {text: "...", chunks: [...]}
			
			// Extract the transcription text
			text = result.text || 'No transcription result.';
			
		} catch (err) {
			console.error('Transcription error:', err);
			error = true;
			text = 'An error occurred during transcription. Please try again.';
		} finally {
			isTranscribing = false;
			transcribeProgress = 0;
			currentSegment = '';
			stopStuckCheck();
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

	// Helper function to format seconds to SRT timestamp
	function formatTimestamp(seconds: number): string {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = Math.floor(seconds % 60);
		const ms = Math.floor((seconds - Math.floor(seconds)) * 1000);
		return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
	}

	// Convert transcription data to SRT format
	function convertToSRT(): string {
		if (!transcriptionData?.chunks?.length) return '';
		
		return transcriptionData.chunks
			.map((chunk: any, index: number) => {
				const segmentIndex = index + 1;
				const startTime = formatTimestamp(chunk.timestamp[0]);
				const endTime = formatTimestamp(chunk.timestamp[1]);
				const timeRange = `${startTime} --> ${endTime}`;
				const content = chunk.text.trim();
				
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
			isReady = false;
			transcribeProgress = 0; // Reset progress for model loading

			env.allowLocalModels = false; // Use remote models

			// Destroy previous pipeline if exists
			if (modelPipeline) {
				await modelPipeline.dispose();
				modelPipeline = null;
			}
			
			modelPipeline = await pipeline('automatic-speech-recognition', selectedModel, {
				progress_callback: (progress) => {
					console.log('Model loading progress:', progress);
					// Example progress data: { status: "progress", file: "config.json", progress: 50, loaded: 500, total: 1000 }
					// Example progress data for model file: { status: "progress", file: "model.onnx", progress: percentage, loaded: bytes, total: bytes }
					// We can simplify this to overall percentage if file is model.onnx or similar
					if (progress.status === 'progress' && progress.file.includes('onnx')) {
						transcribeProgress = Math.round(progress.progress);
					} else if (progress.status === 'ready') {
						transcribeProgress = 100; // Model is ready
					} else {
						// For other files like config.json, tokenizer.json, show a small progress
						// This is a rough estimation, might need refinement
						if (progress.file === 'config.json') transcribeProgress = 10;
						else if (progress.file === 'tokenizer.json') transcribeProgress = 20;
						else if (progress.file === 'preprocessor_config.json') transcribeProgress = 30;

					}
					previousProgress = transcribeProgress -1; // to show animation
				}
			});

			isReady = true;
			console.log('Model pipeline loaded successfully');
		} catch (err) {
			console.error('Failed to initialize model pipeline:', err);
			error = true;
		} finally {
			isLoading = false;
			if (!isReady) transcribeProgress = 0; // Reset if loading failed
		}
	}
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
					{#each availableModels as model}
						<option value={model.path}>{model.name}</option>
					{/each}
				</select>

				{#if !isReady}
					<button onclick={loadModel} disabled={isLoading} class="load-model-btn primary-button">
						{isLoading ? 'Loading Model...' : 'Load Model'}
					</button>
				{:else}
					<div class="model-ready">
						<span class="checkmark">✓</span>
						Model Ready
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
							<small>Use the included JFK speech sample (<a href="/jfk.mp3" target="_blank">listen to audio</a>)</small>
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
								<svg class="upload-icon" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2">
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
							Transcription seems stuck. <button class="reload-link" onclick={reloadPage}>Reload the page</button> and try again.
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
									{#if transcriptionData?.chunks?.length}
										<div class="tab-selectors">
											<button 
												class:active={activeTab === 'text'}
												onclick={() => activeTab = 'text'}
											>
												Text
											</button>
											<button 
												class:active={activeTab === 'srt'}
												onclick={() => activeTab = 'srt'}
											>
												SRT
											</button>
										</div>
									{/if}
									
									<!-- Action buttons based on active tab -->
									{#if !transcriptionData?.chunks?.length || activeTab === 'text'}
										<button class="copy-btn" onclick={copyToClipboard} class:copied={hasCopied}>
											{#if hasCopied}
												<svg class="copy-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
													<polyline points="20,6 9,17 4,12"></polyline>
												</svg>
												Copied!
											{:else}
												<svg class="copy-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
													<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
													<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
												</svg>
												Copy
											{/if}
										</button>
									{:else if activeTab === 'srt'}
										<button class="download-btn" onclick={downloadSRT} class:downloaded={hasDownloaded}>
											{#if hasDownloaded}
												<svg class="download-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
													<polyline points="20,6 9,17 4,12"></polyline>
												</svg>
												Downloaded!
											{:else}
												<svg class="download-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
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
							{#if !transcriptionData?.chunks?.length || activeTab === 'text'}
								<p>{text}</p>
							{:else if activeTab === 'srt' && transcriptionData?.chunks?.length}
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
		margin: 0.5rem 0;
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
		
		.copy-btn, .download-btn {
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