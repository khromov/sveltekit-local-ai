<script lang="ts">
	import createModule from '@transcribe/shout';
	import { FileTranscriber } from '@transcribe/transcriber';
	import { downloadModelWithProgress, isModelCached, isOPFSSupported } from '$lib/download-utils';
	import { onMount, onDestroy } from 'svelte';
	import { whisperModel } from '$lib/stores';
	import { useWakeLock } from '$lib/wakeLock.svelte';
	import { BASE_MODEL_URL } from '$lib/config';

	import WhisperModelSelector from '$lib/components/whisper/WhisperModelSelector.svelte';
	import TranscribeOptions from '$lib/components/whisper/TranscribeOptions.svelte';
	import TranscriptionProgress from '$lib/components/whisper/TranscriptionProgress.svelte';
	import TranscriptionResult from '$lib/components/whisper/TranscriptionResult.svelte';

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

	let transcriptionData = $state<
		| {
				transcription: Array<{
					text: string;
					timestamps: {
						from: string;
						to: string;
					};
				}>;
		  }
		| undefined
	>(undefined);

	const { requestWakeLock, releaseWakeLock, setupWakeLock } = useWakeLock();

	onMount(() => {
		return setupWakeLock(() => isTranscribing);
	});

	let selectedFile: File | null = $state(null);
	let transcribeMode = $state<'demo' | 'upload' | 'record'>('upload');

	let lastSegmentTime = $state(0);
	let stuckCheckInterval: number | null = null;
	let isStuck = $state(false);

	const DEFAULT_MODEL = `${BASE_MODEL_URL}/whisper/ggml-tiny-q5_1.bin`;

	let selectedModel = $state($whisperModel || DEFAULT_MODEL);
	const availableModels = [
		{ path: DEFAULT_MODEL, name: 'Whisper Tiny (q5_1)' },
		{
			path: `${BASE_MODEL_URL}/whisper/ggml-tiny.en-q5_1.bin`,
			name: 'Whisper Tiny English (q5_1)'
		},
		{ path: `${BASE_MODEL_URL}/whisper/ggml-small-q5_1.bin`, name: 'Whisper Small (q5_1)' },
		{
			path: `${BASE_MODEL_URL}/whisper/ggml-small.en-q5_1.bin`,
			name: 'Whisper Small English (q5_1)'
		},
		{
			path: `${BASE_MODEL_URL}/whisper/ggml-medium-q5_0.bin`,
			name: 'Whisper Medium (q5_0)'
		},
		{
			path: `${BASE_MODEL_URL}/whisper/ggml-medium.en-q5_0.bin`,
			name: 'Whisper Medium English (q5_0)'
		},
		{
			path: `${BASE_MODEL_URL}/whisper/ggml-large-v2-q5_0.bin`,
			name: 'Whisper Large (q5_0)'
		}
	];

	async function transcribe() {
		if (!transcriber?.isReady) return;
		if ((transcribeMode === 'upload' || transcribeMode === 'record') && !selectedFile) return;

		text = '';
		currentSegment = '';
		isTranscribing = true;
		transcribeProgress = 0;
		previousProgress = 0;
		isStuck = false;
		lastSegmentTime = Date.now();
		transcriptionData = undefined;

		startStuckCheck();

		await requestWakeLock();

		try {
			let result;
			if (transcribeMode === 'demo') {
				result = await transcriber.transcribe('/rich.mp3', { lang: 'en' });
			} else {
				result = await transcriber.transcribe(selectedFile!, { lang: 'en' });
			}

			transcriptionData = result;

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

	function retry() {
		error = false;
		loadModel();
	}

	function handleFileSelect(file: File) {
		selectedFile = file;
		transcribeMode = 'upload';
	}

	function handleModeChange(mode: 'demo' | 'upload' | 'record') {
		transcribeMode = mode;
		if (mode === 'demo') {
			selectedFile = null;
		}
	}

	async function loadModel() {
		try {
			isLoading = true;
			error = false;

			if (transcriber) {
				transcriber.destroy();
				isReady = false;
			}

			$whisperModel = selectedModel;

			console.log(`Loading model from: ${selectedModel}`);

			usingCachedModel = false;
			downloadProgress = 0;
			hasProgressTracking = true;

			const modelFile = await downloadModelWithProgress(selectedModel, (progress, cached) => {
				previousDownloadProgress = downloadProgress;
				downloadProgress = progress;

				if (progress === -1) {
					hasProgressTracking = false;
					downloadProgress = 0;
					return;
				}

				if (cached) {
					usingCachedModel = true;
				}
			});

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
					currentSegment = segment.segment.text.trim();
					lastSegmentTime = Date.now();
					isStuck = false;
				},
				onComplete: (result) => console.log('Transcription complete:', result),
				onCanceled: () => console.log('Transcription canceled')
			});

			await transcriber.init();

			isReady = true;
		} catch (err) {
			console.error('Failed to initialize transcriber:', err);
			error = true;
		} finally {
			isLoading = false;
		}
	}

	function changeModel() {
		isReady = false;
		loadModel();
	}

	onMount(async () => {
		opfsSupported = isOPFSSupported();
		if (!opfsSupported) {
			console.log('OPFS not supported - models will not be cached');
		}

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
		<div class="toolbar-decoration"></div>
	</div>

	<div class="content-area">
		<WhisperModelSelector
			bind:selectedModel
			{availableModels}
			{isLoading}
			{isReady}
			{error}
			{downloadProgress}
			{previousDownloadProgress}
			{usingCachedModel}
			{hasProgressTracking}
			onLoadModel={loadModel}
			onChangeModel={changeModel}
			onRetry={retry}
		/>

		<div class="main-content" class:disabled={!isReady}>
			<TranscribeOptions
				bind:transcribeMode
				bind:selectedFile
				onFileSelect={handleFileSelect}
				onModeChange={handleModeChange}
				disabled={!isReady}
			/>

			{#if isTranscribing}
				<TranscriptionProgress
					progress={transcribeProgress}
					{previousProgress}
					{currentSegment}
					{isStuck}
					onReload={reloadPage}
				/>
			{:else if text}
				<TranscriptionResult {text} {transcriptionData} />
			{/if}
		</div>
	</div>

	<div class="input-area" class:disabled={!isReady}>
		<button
			onclick={transcribe}
			disabled={!isReady ||
				isTranscribing ||
				((transcribeMode === 'upload' || transcribeMode === 'record') && !selectedFile)}
			class="transcribe-btn primary-button"
		>
			{#if isTranscribing}
				<span class="loading-spinner">◐</span>
				Transcribing...
			{:else}
				<span class="button-icon">▶</span>
				Start Transcription
			{/if}
		</button>

		<div class="disclaimer">
			<span class="disclaimer-icon">🔒</span>
			Transcription is performed locally in your browser. Results may not always be accurate.
		</div>
	</div>
</div>

<style>
	.toolbar-decoration {
		position: absolute;
		bottom: -8px;
		left: 0;
		right: 0;
		height: 4px;
		background: repeating-linear-gradient(90deg, #000, #000 10px, #98fb98 10px, #98fb98 20px);
	}

	.main-content {
		transition: all 0.3s ease;
	}

	.main-content.disabled,
	.input-area.disabled {
		opacity: 0.3;
		pointer-events: none;
		filter: grayscale(50%);
	}

	.transcribe-btn {
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		min-width: 280px;
		text-align: center;
		position: relative;
		overflow: hidden;
		text-transform: uppercase;
	}

	.transcribe-btn::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
		transition: left 0.5s;
	}

	.transcribe-btn:hover:not(:disabled)::before {
		left: 100%;
	}

	.transcribe-btn:disabled {
		background: #e0e0e0;
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
		opacity: 0.7;
	}

	.button-icon {
		font-size: 1.5rem;
	}

	.loading-spinner {
		font-size: 1.5rem;
		animation: spin 1s linear infinite;
		display: inline-block;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.primary-button {
		padding: 1.25rem 2rem;
		background: #98fb98;
		color: #000;
		border: 4px solid #000;
		cursor: pointer;
		font-size: 1.5rem;
		font-weight: 700;
		transition: all 0.15s;
		box-shadow: 8px 8px 0 #000;
		text-transform: uppercase;
		letter-spacing: 2px;
		font-family: 'Space Grotesk', monospace;
	}

	.primary-button:hover:not(:disabled) {
		transform: translate(-4px, -4px);
		box-shadow: 12px 12px 0 #000;
		background: #ffd93d;
	}

	.primary-button:active:not(:disabled) {
		transform: translate(0);
		box-shadow: 4px 4px 0 #000;
	}

	.disclaimer {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		margin-top: 1rem;
		font-size: 0.9375rem;
		font-weight: 600;
		color: #000;
		text-align: center;
		background: #ff69b4;
		padding: 0.75rem 1rem;
		border: 3px solid #000;
		box-shadow: 5px 5px 0 #000;
		transform: rotate(1deg);
		width: fit-content;
		margin-left: auto;
		margin-right: auto;
	}

	.disclaimer-icon {
		font-size: 1.25rem;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px) rotate(-1deg);
		}
		to {
			opacity: 1;
			transform: translateY(0) rotate(-0.5deg);
		}
	}

	@media (max-width: 600px) {
		.main-content.disabled,
		.input-area.disabled {
			opacity: 0.3;
			pointer-events: none;
		}

		.transcribe-btn {
			min-width: auto;
			width: 100%;
			font-size: 1.25rem;
			padding: 1rem 1.5rem;
		}

		.disclaimer {
			font-size: 0.875rem;
			padding: 0.625rem 0.875rem;
		}
	}
</style>
