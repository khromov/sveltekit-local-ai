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

<div class="card-interface" style="animation: fadeIn 0.5s ease-out;">
	<div class="toolbar">
		<span class="model-info">Natural Audio Transcription</span>
		<div class="toolbar-decoration">
			<svg viewBox="0 0 100 4" width="100%" height="4">
				<path d="M0,2 Q25,1 50,2 T100,2" stroke="#3a6e4a" stroke-width="1" opacity="0.5" />
				<circle cx="25" cy="1.5" r="0.8" fill="#2d5d3a" opacity="0.4" />
				<circle cx="75" cy="2.5" r="0.6" fill="#4a7c59" opacity="0.3" />
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
				<svg class="loading-spinner" viewBox="0 0 20 20" width="18" height="18">
					<circle
						cx="10"
						cy="10"
						r="8"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						opacity="0.3"
					/>
					<circle
						cx="10"
						cy="10"
						r="8"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-dasharray="16 8"
						transform="rotate(-90 10 10)"
					/>
				</svg>
				Harvesting Audio...
			{:else}
				<svg class="button-icon" viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
					<!-- Natural seed/sprout icon -->
					<path
						d="M10,16 L10,8 Q8,6 6,8 Q4,10 6,12 Q8,14 10,12"
						fill="currentColor"
						opacity="0.7"
					/>
					<path d="M10,8 Q12,6 14,8 Q16,10 14,12 Q12,14 10,12" fill="currentColor" opacity="0.5" />
					<circle cx="10" cy="16" r="2" fill="currentColor" opacity="0.8" />
				</svg>
				Begin Natural Transcription
			{/if}
		</button>

		<div class="disclaimer">
			<svg class="disclaimer-icon" viewBox="0 0 16 16" width="12" height="12">
				<path d="M8,2 L12,6 L8,10 L4,6 Z" fill="#6b4c3a" opacity="0.6" />
				<circle cx="8" cy="12" r="2" fill="#8b5a3c" opacity="0.5" />
			</svg>
			Audio processing grows naturally within your browser's garden. Quality may vary like nature itself.
		</div>
	</div>
</div>

<style>
	.toolbar-decoration {
		position: absolute;
		bottom: -3px;
		left: 0;
		right: 0;
		height: 4px;
		padding: 0 1rem;
		box-sizing: border-box;
		opacity: 0.7;
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
		animation: naturalSpin 2s linear infinite;
		display: inline-block;
	}

	@keyframes naturalSpin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	/* Primary button styles handled by global layout styles */

	.disclaimer {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		margin-top: 1.5rem;
		font-size: 0.9rem;
		font-weight: 400;
		font-family: 'Inter', sans-serif;
		color: rgba(107, 76, 58, 0.8);
		text-align: center;
		background: rgba(139, 90, 60, 0.08);
		padding: 1rem 1.5rem;
		border: 1px solid rgba(107, 76, 58, 0.2);
		border-radius: 16px;
		box-shadow:
			0 4px 12px rgba(107, 76, 58, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.6);
		backdrop-filter: blur(5px);
		width: fit-content;
		margin-left: auto;
		margin-right: auto;
		max-width: 400px;
		line-height: 1.5;
	}

	.disclaimer-icon {
		opacity: 0.7;
		flex-shrink: 0;
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
