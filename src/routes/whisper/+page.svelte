<script lang="ts">
	import createModule from '@transcribe/shout';
	import { FileTranscriber } from '@transcribe/transcriber';
	import { onMount } from 'svelte';

	let isReady = $state(false);
	let isLoading = $state(false);
	let isTranscribing = $state(false);
	let transcriber: FileTranscriber;
	let text = $state('');
	let error = $state(false);
	let transcribeProgress = $state(0);
	let previousProgress = $state(0);
	let currentSegment = $state('');

	// File upload state
	let selectedFile: File | null = $state(null);
	let transcribeMode = $state<'demo' | 'upload'>('demo');
	let fileInputElement = $state<HTMLInputElement | null>(null);

	const DEFAULT_MODEL = 'https://files.khromov.se/whisper/ggml-tiny-q5_1.bin';

	// Model selection state
	let selectedModel = $state(DEFAULT_MODEL);
	const availableModels = [{ path: DEFAULT_MODEL, name: 'Whisper Tiny (q5_1)' }];

	async function transcribe() {
		if (!transcriber?.isReady) return;
		if (transcribeMode === 'upload' && !selectedFile) return;

		text = '';
		currentSegment = '';
		isTranscribing = true;
		transcribeProgress = 0;
		previousProgress = 0;

		try {
			let result;
			if (transcribeMode === 'demo') {
				// Transcribe the demo file
				result = await transcriber.transcribe('/jfk.mp3', { lang: 'en' });
			} else {
				// Transcribe the uploaded file
				result = await transcriber.transcribe(selectedFile!, { lang: 'en' });
			}

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

	async function loadModel() {
		try {
			isLoading = true;
			error = false;

			// Create new instance with progress tracking
			transcriber = new FileTranscriber({
				createModule,
				model: selectedModel,
				onReady: () => console.log('Transcriber ready'),
				onProgress: (progress) => {
					previousProgress = transcribeProgress;
					transcribeProgress = Math.round(progress);
					console.log(`Transcription progress: ${transcribeProgress}%`);
				},
				onSegment: (segment) => {
					console.log('New segment:', segment);
					// Update the current segment preview
					currentSegment = segment.segment.text.trim();
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
</script>

<div class="card-interface">
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
							value="demo"
							checked={transcribeMode === 'demo'}
							onchange={selectDemoMode}
							disabled={!isReady}
						/>
						<span class="option-content">
							<strong>Demo Audio</strong>
							<small>Use the included JFK speech sample</small>
						</span>
					</label>

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
							<strong>Upload Audio</strong>
							<small>Select your own audio file (.mp3, .wav, .m4a)</small>
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
						<label for="audio-file" class="file-upload-label" class:disabled={!isReady}>
							{selectedFile ? selectedFile.name : 'Choose audio file...'}
						</label>
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

					<p class="transcribing-message">Please wait while we process your audio...</p>
				</div>
			{:else if text}
				<div class="result-wrapper">
					<div class="result">
						<div class="result-content">
							<h3>Transcription Result:</h3>
							<p>{text}</p>
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

	.file-upload {
		margin-top: 0.5rem;
	}

	.file-upload input[type='file'] {
		display: none;
	}

	.file-upload-label {
		display: block;
		padding: 0.875rem 1.25rem;
		background-color: #f8f8f8;
		border: 2px dashed #ccc;
		border-radius: 12px;
		text-align: center;
		cursor: pointer;
		transition: all 0.2s ease;
		font-size: 1rem;
		color: #555;
	}

	.file-upload-label:hover:not(.disabled) {
		border-color: #0071e3;
		background-color: #f0f4ff;
		color: #0071e3;
	}

	.file-upload-label.disabled {
		cursor: not-allowed;
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

	.result-content h3 {
		margin-top: 0;
		margin-bottom: 0.75rem;
		font-size: 1.125rem;
		font-weight: 600;
		color: #333;
	}

	.result-content p {
		margin: 0;
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

		.transcribing {
			padding: 1.5rem;
		}

		.segment-preview {
			max-width: none;
		}
	}
</style>
