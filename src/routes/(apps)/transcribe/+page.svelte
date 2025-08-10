<script lang="ts">
	import createModule from '@transcribe/shout';
	import { FileTranscriber } from '@transcribe/transcriber';
	import { downloadModelWithProgress, isModelCached, isOPFSSupported } from '$lib/download-utils';
	import { onMount, onDestroy } from 'svelte';
	import { whisperModel } from '$lib/stores';
	import { useWakeLock } from '$lib/wakeLock.svelte';

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

	const DEFAULT_MODEL = 'https://files.khromov.se/whisper/ggml-tiny-q5_1.bin';

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

<div class="card-interface" style="animation: fadeIn 0.6s ease-out;">
	<div class="toolbar">
		<span class="model-info">
			<svg viewBox="0 0 16 16" width="16" height="16" class="model-icon">
				<path
					d="M8,2 L14,6 L8,10 L2,6 Z"
					fill="var(--cream)"
					stroke="var(--earth-dark)"
					stroke-width="1"
					opacity="0.8"
				/>
				<ellipse cx="8" cy="10" rx="6" ry="2" fill="var(--earth-dark)" opacity="0.4" />
			</svg>
			Audio Transcription
		</span>
		<div class="toolbar-decoration">
			<svg viewBox="0 0 40 6" width="40" height="6">
				<path
					d="M0,3 Q10,1 20,3 T40,3"
					stroke="var(--cream)"
					stroke-width="1"
					fill="none"
					opacity="0.6"
				/>
			</svg>
		</div>
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
				<svg viewBox="0 0 20 20" width="20" height="20" class="loading-spinner">
					<circle
						cx="10"
						cy="10"
						r="6"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						opacity="0.3"
					/>
					<path d="M10 4 A 6 6 0 0 1 16 10" stroke="currentColor" stroke-width="2" fill="none">
						<animateTransform
							attributeName="transform"
							type="rotate"
							values="0 10 10;360 10 10"
							dur="1s"
							repeatCount="indefinite"
						/>
					</path>
				</svg>
				Transcribing...
			{:else}
				<svg viewBox="0 0 20 20" width="20" height="20" class="button-icon">
					<polygon points="8,5 8,15 15,10" fill="currentColor" />
				</svg>
				Begin Transcription
			{/if}
		</button>

		<div class="disclaimer">
			<svg viewBox="0 0 12 12" width="12" height="12" class="disclaimer-icon">
				<circle
					cx="6"
					cy="6"
					r="4"
					fill="none"
					stroke="var(--earth-dark)"
					stroke-width="1"
					opacity="0.6"
				/>
				<path d="M4,6 L8,6 M6,4 L6,8" stroke="var(--earth-dark)" stroke-width="1" opacity="0.6" />
			</svg>
			Transcription happens locally in your browser. Audio never leaves your device.
		</div>
	</div>
</div>

<style>
	.model-icon {
		margin-right: 0.5rem;
		filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
	}

	.toolbar-decoration {
		position: absolute;
		bottom: -3px;
		right: 1rem;
		opacity: 0.8;
	}

	.main-content {
		transition: all 0.4s ease;
	}

	.main-content.disabled,
	.input-area.disabled {
		opacity: 0.4;
		pointer-events: none;
		filter: grayscale(30%);
	}

	.transcribe-btn {
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		min-width: 240px;
		text-align: center;
		position: relative;
		overflow: hidden;
		font-size: 1.1rem;
		padding: 1.25rem 2rem;
	}

	.transcribe-btn::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
		transition: left 0.6s ease;
	}

	.transcribe-btn:hover:not(:disabled)::before {
		left: 100%;
	}

	.transcribe-btn:disabled {
		background: var(--stone);
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
		opacity: 0.6;
	}

	.button-icon,
	.loading-spinner {
		filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
	}

	.disclaimer {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		margin-top: 1rem;
		font-size: 0.85rem;
		font-weight: 400;
		color: var(--text-light);
		text-align: center;
		font-style: italic;
		line-height: 1.4;
		letter-spacing: 0.01em;
	}

	.disclaimer-icon {
		flex-shrink: 0;
		opacity: 0.7;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 600px) {
		.main-content.disabled,
		.input-area.disabled {
			opacity: 0.4;
			pointer-events: none;
		}

		.transcribe-btn {
			min-width: auto;
			width: 100%;
			font-size: 1rem;
			padding: 1rem 1.75rem;
		}

		.disclaimer {
			font-size: 0.8rem;
		}
	}
</style>
