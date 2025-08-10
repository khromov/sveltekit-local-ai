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

<div class="card-interface transcribe-interface">
	<!-- Nature decorations -->
	<svg class="page-decoration top-left" width="100" height="100" viewBox="0 0 100 100">
		<g opacity="0.1">
			<circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="3 5"/>
			<path d="M50,20 Q40,30 40,50 Q40,70 50,80 Q60,70 60,50 Q60,30 50,20" fill="currentColor" opacity="0.3"/>
		</g>
	</svg>
	
	<svg class="page-decoration bottom-right" width="80" height="80" viewBox="0 0 80 80">
		<g opacity="0.1">
			<path d="M20,40 Q30,30 40,40 T60,40" stroke="currentColor" stroke-width="1" fill="none"/>
			<circle cx="20" cy="40" r="3" fill="currentColor" opacity="0.3"/>
			<circle cx="40" cy="40" r="3" fill="currentColor" opacity="0.3"/>
			<circle cx="60" cy="40" r="3" fill="currentColor" opacity="0.3"/>
		</g>
	</svg>

	<div class="toolbar">
		<span class="toolbar-title">
			<svg width="20" height="20" viewBox="0 0 20 20" fill="none" style="display: inline-block; vertical-align: middle; margin-right: 6px;">
				<circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity="0.2"/>
				<circle cx="10" cy="10" r="3" fill="currentColor"/>
				<path d="M10 2V5M10 15V18M2 10H5M15 10H18" stroke="currentColor" stroke-width="1" opacity="0.5"/>
			</svg>
			Audio Transcription
		</span>
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
				<svg class="loading-spinner" width="24" height="24" viewBox="0 0 24 24" fill="none">
					<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" opacity="0.3"/>
					<path d="M12 2C17.5 2 22 6.5 22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
				</svg>
				Transcribing Audio...
			{:else}
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
					<polygon points="5,3 19,12 5,21" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
				</svg>
				Start Transcription
			{/if}
		</button>

		<div class="feature-badges">
			<span class="badge">
				<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
					<circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/>
					<path d="M5 7L6.5 8.5L9 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
				100% Local Processing
			</span>
			<span class="badge">
				<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
					<path d="M7 2L8.5 5.5L12 6L9.5 8.5L10 12L7 10L4 12L4.5 8.5L2 6L5.5 5.5L7 2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
				</svg>
				Privacy First
			</span>
		</div>
	</div>
</div>

<style>
	.transcribe-interface {
		position: relative;
		animation: fadeIn 0.5s ease-out;
		overflow: visible;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(15px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.page-decoration {
		position: absolute;
		color: var(--forest-primary);
		pointer-events: none;
		z-index: 0;
	}

	.page-decoration.top-left {
		top: -30px;
		left: -30px;
		animation: gentle-rotate 15s linear infinite;
	}

	.page-decoration.bottom-right {
		bottom: -20px;
		right: -20px;
		animation: gentle-rotate 20s linear infinite reverse;
	}

	@keyframes gentle-rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.toolbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.25rem 1.5rem;
		background: linear-gradient(135deg, var(--forest-light) 0%, var(--forest-primary) 100%);
		border-bottom: 1px solid rgba(255, 255, 255, 0.2);
		position: relative;
		overflow: hidden;
	}

	.toolbar::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: repeating-linear-gradient(
			90deg,
			transparent,
			transparent 100px,
			rgba(255, 255, 255, 0.05) 100px,
			rgba(255, 255, 255, 0.05) 200px
		);
		pointer-events: none;
	}

	.toolbar-title {
		font-size: 0.975rem;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.95);
		letter-spacing: 0.02em;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
		z-index: 1;
		position: relative;
	}

	.content-area {
		padding: 2rem;
		background: transparent;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		box-sizing: border-box;
		position: relative;
		z-index: 1;
	}

	.main-content {
		transition: all 0.3s ease;
	}

	.main-content.disabled {
		opacity: 0.3;
		pointer-events: none;
		filter: grayscale(50%);
	}

	.input-area {
		padding: 1.75rem;
		border-top: 1px solid rgba(139, 111, 71, 0.15);
		background: linear-gradient(180deg, transparent 0%, rgba(250, 248, 243, 0.5) 100%);
		box-sizing: border-box;
		position: relative;
		z-index: 1;
	}

	.input-area.disabled {
		opacity: 0.4;
		pointer-events: none;
	}

	.transcribe-btn {
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		min-width: 250px;
		text-align: center;
		position: relative;
		overflow: hidden;
		padding: 1.125rem 2rem;
		font-size: 1.0625rem;
		background: linear-gradient(135deg, var(--forest-light) 0%, var(--forest-primary) 100%);
		border-radius: 14px;
		letter-spacing: 0.02em;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.transcribe-btn::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
		transition: left 0.6s;
	}

	.transcribe-btn:hover:not(:disabled)::before {
		left: 100%;
	}

	.transcribe-btn:hover:not(:disabled) {
		transform: translateY(-3px);
		box-shadow: 
			0 8px 32px rgba(45, 90, 61, 0.25),
			inset 0 1px 0 rgba(255, 255, 255, 0.2);
		background: linear-gradient(135deg, var(--moss-green) 0%, var(--forest-light) 100%);
	}

	.transcribe-btn:active:not(:disabled) {
		transform: translateY(-1px);
		box-shadow: 
			0 4px 16px rgba(45, 90, 61, 0.2),
			inset 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.transcribe-btn:disabled {
		background: linear-gradient(135deg, var(--earth-stone) 0%, var(--text-muted) 100%);
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
		opacity: 0.6;
	}

	.loading-spinner {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.feature-badges {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		margin-top: 1.25rem;
		flex-wrap: wrap;
	}

	.badge {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.5rem 0.875rem;
		font-size: 0.8125rem;
		color: var(--forest-primary);
		background: linear-gradient(135deg, rgba(136, 179, 120, 0.1) 0%, rgba(168, 185, 159, 0.08) 100%);
		border: 1px solid rgba(46, 90, 61, 0.2);
		border-radius: 20px;
		font-weight: 500;
		letter-spacing: 0.02em;
		transition: all 0.3s ease;
	}

	.badge:hover {
		background: linear-gradient(135deg, rgba(136, 179, 120, 0.15) 0%, rgba(168, 185, 159, 0.12) 100%);
		transform: translateY(-1px);
		box-shadow: 0 2px 8px rgba(46, 90, 61, 0.1);
	}

	@media (max-width: 600px) {
		.toolbar {
			padding: 1rem 1.25rem;
		}

		.toolbar-title {
			font-size: 0.9375rem;
		}

		.content-area {
			padding: 1.25rem;
		}

		.input-area {
			padding: 1.25rem;
		}

		.transcribe-btn {
			min-width: auto;
			width: 100%;
			font-size: 1rem;
			padding: 1rem 1.5rem;
		}

		.feature-badges {
			margin-top: 1rem;
			gap: 0.75rem;
		}

		.badge {
			font-size: 0.75rem;
			padding: 0.375rem 0.625rem;
		}

		.page-decoration {
			display: none;
		}
	}
</style>
