<script lang="ts">
	import createModule from '@transcribe/shout';
	import { FileTranscriber } from '@transcribe/transcriber';
	import { downloadModelWithProgress, isModelCached, isOPFSSupported } from '$lib/download-utils';
	import { PUBLIC_DISABLE_OPFS } from '$env/static/public';
	import { onMount, onDestroy } from 'svelte';
	import { whisperModel } from '$lib/stores';
	import { useWakeLock } from '$lib/wakeLock.svelte';
	import { BASE_MODEL_URL } from '$lib/config';
	import LockIcon from 'virtual:icons/lucide/lock';
	import PlayIcon from 'virtual:icons/lucide/play';
	import SquareSpinner from '$lib/components/common/SquareSpinner.svelte';

	import WhisperModelSelector from '$lib/components/whisper/WhisperModelSelector.svelte';
	import TranscribeOptions from '$lib/components/whisper/TranscribeOptions.svelte';
	import TranscriptionProgress from '$lib/components/whisper/TranscriptionProgress.svelte';
	import TranscriptionResult from '$lib/components/whisper/TranscriptionResult.svelte';
	import CardInterface from '$lib/components/common/CardInterface.svelte';
	import Toolbar from '$lib/components/common/Toolbar.svelte';
	import ContentArea from '$lib/components/common/ContentArea.svelte';
	import InputArea from '$lib/components/common/InputArea.svelte';
	import PrimaryButton from '$lib/components/common/PrimaryButton.svelte';

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

	let selectedModel = $state(DEFAULT_MODEL);
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

			// Save the model name instead of the path
			const selectedModelObj = availableModels.find((m) => m.path === selectedModel);
			$whisperModel = selectedModelObj?.name || '';

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
		opfsSupported = isOPFSSupported(PUBLIC_DISABLE_OPFS === 'true');
		if (!opfsSupported) {
			console.log('OPFS not supported - models will not be cached');
		}

		if ($whisperModel) {
			// Find the stored model by name and set selectedModel to its path
			const storedModel =
				availableModels.find((m) => m.name === $whisperModel) ||
				availableModels.find((m) => m.path === $whisperModel); // Backward compatibility

			if (storedModel) {
				selectedModel = storedModel.path;

				// Migrate old format if needed
				if ($whisperModel !== storedModel.name) {
					$whisperModel = storedModel.name;
				}

				if (opfsSupported) {
					// Only autoload if the model is already cached
					const cached = await isModelCached(storedModel.path);
					if (cached) {
						console.log('Autoloading cached model:', storedModel.name);
						loadModel();
					} else {
						console.log('Model not cached, user must manually load:', storedModel.name);
					}
				} else {
					console.log('OPFS not supported, user must manually load model:', storedModel.name);
				}
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

<CardInterface>
	<Toolbar modelInfo="Whisper Audio Transcription" />

	<ContentArea>
		<WhisperModelSelector
			bind:selectedModel
			{availableModels}
			{isLoading}
			{isReady}
			loadedModel={$whisperModel}
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
	</ContentArea>

	<InputArea disabled={!isReady}>
		<PrimaryButton
			onClick={transcribe}
			disabled={!isReady ||
				isTranscribing ||
				((transcribeMode === 'upload' || transcribeMode === 'record') && !selectedFile)}
			loading={isTranscribing}
			variant="success"
			size="large"
			fullWidth
		>
			{#if isTranscribing}
				<SquareSpinner class="loading-spinner" />
				Transcribing...
			{:else}
				<span class="button-icon"><PlayIcon /></span>
				Start Transcription
			{/if}
		</PrimaryButton>

		<div class="disclaimer">
			<span class="disclaimer-icon"><LockIcon /></span>
			Transcription is performed locally in your browser. Results may not always be accurate.
		</div>
	</InputArea>
</CardInterface>

<style>
	.main-content {
		transition: all 0.3s ease;
	}

	.main-content.disabled {
		opacity: 0.3;
		pointer-events: none;
		filter: grayscale(50%);
	}

	.button-icon {
		font-size: 1.5rem;
		display: flex;
		align-items: center;
		color: #000;
	}

	.button-icon :global(svg) {
		width: 1.5rem;
		height: 1.5rem;
	}

	:global(.loading-spinner) {
		color: #000;
		margin-right: 0.5rem;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
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
		display: flex;
		align-items: center;
		color: #000;
	}

	.disclaimer-icon :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}

	@media (max-width: 600px) {
		.main-content.disabled {
			opacity: 0.3;
			pointer-events: none;
		}

		.disclaimer {
			font-size: 0.875rem;
			padding: 0.625rem 0.875rem;
		}
	}
</style>
