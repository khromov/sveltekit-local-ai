<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import MicIcon from 'virtual:icons/lucide/mic';
	import PlayIcon from 'virtual:icons/lucide/play';
	import PauseIcon from 'virtual:icons/lucide/pause';
	import DownloadIcon from 'virtual:icons/lucide/download';
	import CopyIcon from 'virtual:icons/lucide/copy';
	import CheckIcon from 'virtual:icons/lucide/check';
	import SparklesIcon from 'virtual:icons/lucide/sparkles';

	import CardInterface from '$lib/components/common/CardInterface.svelte';
	import Toolbar from '$lib/components/common/Toolbar.svelte';
	import ContentArea from '$lib/components/common/ContentArea.svelte';
	import LoadingProgress from '$lib/components/common/LoadingProgress.svelte';
	import ErrorDisplay from '$lib/components/common/ErrorDisplay.svelte';

	import AudioChunk from '$lib/components/tts/AudioChunk.svelte';
	import ModelSwitcher from '$lib/components/tts/ModelSwitcher.svelte';
	import SampleRateSelector from '$lib/components/tts/SampleRateSelector.svelte';
	import SpeedControl from '$lib/components/tts/SpeedControl.svelte';
	import TextStatistics from '$lib/components/tts/TextStatistics.svelte';
	import VoiceSelector from '$lib/components/tts/VoiceSelector.svelte';
	import WebGPUToggle from '$lib/components/tts/WebGPUToggle.svelte';

	// State variables
	let text = $state(
		'Hello there! Welcome to the TTS Studio! Choose your preferred TTS model and start generating high-quality speech from text, all running locally in your browser!'
	);
	let selectedModel = $state<'kitten' | 'piper' | 'kokoro' | null>(null);
	let lastGeneration = $state<any>(null);
	let isPlaying = $state(false);
	let currentChunkIndex = $state(-1);
	let speed = $state(1);
	let copied = $state(false);
	let status = $state<'waiting' | 'loading' | 'ready' | 'generating' | 'error'>('waiting');
	let error = $state<string | null>(null);
	let worker: Worker | null = $state(null);
	let voices = $state<any[]>([]);
	let selectedVoice = $state('expr-voice-2-m');
	let selectedSampleRate = $state(24000);
	let useWebGPU = $state(false);
	let actualDevice = $state('wasm');
	let chunks = $state<any[]>([]);
	let result = $state<Blob | null>(null);

	// Computed properties
	let processed = $derived(() => {
		return (
			lastGeneration &&
			lastGeneration.text === text &&
			lastGeneration.speed === speed &&
			lastGeneration.voice === selectedVoice &&
			(selectedModel === 'kitten' ? lastGeneration.sampleRate === selectedSampleRate : true) &&
			lastGeneration.model === selectedModel
		);
	});

	// Methods
	function setSelectedVoice(voice: string) {
		selectedVoice = voice;
	}

	function setSpeed(newSpeed: number) {
		speed = newSpeed;
	}

	function setSampleRate(sampleRate: number) {
		selectedSampleRate = sampleRate;
	}

	function handleModelChange(model: 'kitten' | 'piper' | 'kokoro') {
		if (selectedModel === model) return;

		selectedModel = model;

		// Reset voice selection and sample rate based on model
		if (model === 'kitten') {
			selectedVoice = 'expr-voice-2-m';
			selectedSampleRate = 24000;
		} else if (model === 'piper') {
			selectedVoice = '0';
			selectedSampleRate = 22050;
		} else if (model === 'kokoro') {
			selectedVoice = 'af_heart';
			selectedSampleRate = 24000;
		}

		// Restart worker with new model
		restartWorker();
	}

	function handleWebGPUToggle(enabled: boolean) {
		// Only restart if the value actually changed and it's different from current device
		if (enabled !== (actualDevice === 'webgpu')) {
			restartWorker(enabled);
		}
	}

	let previewAudio: HTMLAudioElement | null = null;
	let isPreviewMode = $state(false);

	async function handleVoicePreview({
		voice,
		text: previewText,
		action
	}: {
		voice: string | number;
		text?: string;
		action: 'play' | 'stop';
	}) {
		if (action === 'stop') {
			if (previewAudio) {
				previewAudio.pause();
				previewAudio = null;
			}
			isPreviewMode = false;
			return;
		}

		if (action === 'play') {
			// Stop any existing preview
			if (previewAudio) {
				previewAudio.pause();
				previewAudio = null;
			}

			// Only preview if we have a worker and the model is ready
			if (!worker || status !== 'ready') {
				console.warn('Model not ready for preview');
				return;
			}

			try {
				// Mark as preview mode
				isPreviewMode = true;

				// Send preview request to worker
				worker.postMessage({
					type: 'tts',
					text: previewText,
					voice: selectedModel === 'piper' ? parseInt(voice as string) : voice,
					speed: speed,
					sampleRate: selectedSampleRate,
					isPreview: true
				});
			} catch (error) {
				console.error('Error starting voice preview:', error);
				isPreviewMode = false;
			}
		}
	}

	function restartWorker(webGPUPreference = false) {
		if (worker) {
			worker.terminate();
		}

		// Don't start worker if no model is selected
		if (!selectedModel) {
			status = 'waiting';
			return;
		}

		// Reset all audio and UI state
		status = 'loading';
		voices = [];
		chunks = [];
		result = null;
		lastGeneration = null;
		isPlaying = false;
		currentChunkIndex = -1;

		worker = new Worker(new URL('$lib/workers/tts-worker.js', import.meta.url), {
			type: 'module'
		});

		worker.addEventListener('message', onMessageReceived);
		worker.addEventListener('error', onErrorReceived);

		// Send init message with model type and device preference
		worker.postMessage({
			type: 'init',
			model: selectedModel,
			useWebGPU: webGPUPreference
		});
	}

	function setCurrentChunkIndex(index: number) {
		currentChunkIndex = index;
	}

	function setIsPlaying(playing: boolean) {
		isPlaying = playing;
	}

	function handleChunkEnd() {
		if (status !== 'generating' && currentChunkIndex === chunks.length - 1) {
			isPlaying = false;
			currentChunkIndex = -1;
		} else {
			currentChunkIndex = currentChunkIndex + 1;
		}
	}

	function handlePlayPause() {
		if (!isPlaying && status === 'ready' && !processed()) {
			status = 'generating';
			chunks = [];
			currentChunkIndex = 0;
			const params = {
				text: text,
				voice: selectedModel === 'piper' ? parseInt(selectedVoice) : selectedVoice,
				speed: speed,
				model: selectedModel,
				sampleRate: selectedSampleRate
			};

			lastGeneration = params;
			worker?.postMessage({
				type: 'tts',
				...params
			});
		}
		if (currentChunkIndex === -1) {
			currentChunkIndex = 0;
		}
		isPlaying = !isPlaying;
	}

	function downloadAudio() {
		if (!result) return;
		const url = URL.createObjectURL(result);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'audio.wav';
		link.click();
		URL.revokeObjectURL(url);
	}

	async function handleCopy() {
		await navigator.clipboard.writeText(text);
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 2000);
	}

	// Worker message handlers
	function onMessageReceived(event: MessageEvent) {
		const { data } = event;
		switch (data.status) {
			case 'device':
				actualDevice = data.device;
				useWebGPU = data.device === 'webgpu';
				break;
			case 'ready':
				status = 'ready';
				voices = data.voices || [];
				actualDevice = data.device;
				useWebGPU = data.device === 'webgpu';
				break;
			case 'error':
				status = 'error';
				error = data.data;
				break;
			case 'stream':
				chunks = [...chunks, data.chunk];
				break;
			case 'complete':
				if (isPreviewMode) {
					// Handle preview audio
					isPreviewMode = false;
					if (data.audio) {
						try {
							const audioUrl = URL.createObjectURL(data.audio);
							previewAudio = new Audio(audioUrl);
							previewAudio.volume = 0.8;
							previewAudio.onended = () => {
								URL.revokeObjectURL(audioUrl);
								previewAudio = null;
								document.dispatchEvent(new CustomEvent('voicePreviewEnded'));
							};
							previewAudio.onerror = (e) => {
								console.error('Preview audio error:', e);
								URL.revokeObjectURL(audioUrl);
								previewAudio = null;
								document.dispatchEvent(new CustomEvent('voicePreviewEnded'));
							};

							previewAudio.play().catch((e) => {
								console.warn('Preview autoplay failed:', e);
								URL.revokeObjectURL(audioUrl);
								previewAudio = null;
								document.dispatchEvent(new CustomEvent('voicePreviewEnded'));
							});
						} catch (e) {
							console.error('Error creating preview audio:', e);
							previewAudio = null;
							document.dispatchEvent(new CustomEvent('voicePreviewEnded'));
						}
					}
				} else {
					// Handle main generation
					status = 'ready';
					result = data.audio;
				}
				break;
		}
	}

	function onErrorReceived(e: ErrorEvent) {
		console.error('Worker error:', e);
		error = e.message;
	}

	// Cleanup
	onDestroy(() => {
		if (worker) {
			worker.terminate();
		}
	});
</script>

<CardInterface>
	<Toolbar modelInfo="Text to Speech Studio" ModelIcon={MicIcon} />

	<ContentArea>
		<div class="tts-container">
			{#if status === 'waiting'}
				<div class="model-selection-intro">
					<h2>
						<span class="title-icon"><SparklesIcon /></span>
						Welcome to TTS Studio
					</h2>
					<p>Generate high-quality speech from text, all running locally in your browser!</p>
				</div>
			{/if}

			<!-- Model Selection -->
			<ModelSwitcher {selectedModel} onModelChange={handleModelChange} />

			{#if status === 'loading'}
				<LoadingProgress
					title="Loading TTS Model"
					progress={0}
					message="Initializing text-to-speech model..."
					showPercentage={false}
				/>
			{:else if status === 'error'}
				<ErrorDisplay
					message={error || 'Failed to load model'}
					buttonText="Retry"
					onRetry={() => restartWorker()}
				/>
			{:else if status !== 'waiting'}
				<!-- Text Input Section -->
				<div class="text-input-section">
					<div class="section-header">
						<h3>Enter Your Text</h3>
						<TextStatistics {text} />
					</div>

					<div class="text-input-wrapper">
						<textarea
							bind:value={text}
							placeholder="Type or paste your text here..."
							class="text-input"
							disabled={status === 'generating'}
						></textarea>
						<button
							class="copy-button"
							onclick={handleCopy}
							title={copied ? 'Copied!' : 'Copy text'}
						>
							{#if copied}
								<CheckIcon />
							{:else}
								<CopyIcon />
							{/if}
						</button>
					</div>
				</div>

				<!-- Controls Section -->
				{#if voices.length > 0}
					<div class="controls-section">
						<div class="controls-grid">
							<div class="control-item">
								<label>Voice:</label>
								<VoiceSelector
									{voices}
									{selectedVoice}
									modelType={selectedModel}
									onVoiceChange={setSelectedVoice}
									onVoicePreview={handleVoicePreview}
								/>
							</div>

							<div class="control-item">
								<SpeedControl {speed} onSpeedChange={setSpeed} />
							</div>

							{#if selectedModel === 'kitten'}
								<div class="control-item">
									<SampleRateSelector onSampleRateChange={setSampleRate} />
								</div>
							{/if}
						</div>

						{#if selectedModel === 'kitten' || selectedModel === 'kokoro'}
							<WebGPUToggle modelValue={useWebGPU} onUpdate={handleWebGPUToggle} />
						{/if}
					</div>

					<!-- Action Buttons -->
					<div class="action-buttons">
						<button
							class="primary-action-btn"
							class:playing={isPlaying}
							onclick={handlePlayPause}
							disabled={(status === 'ready' && !isPlaying && !text) ||
								(status !== 'ready' && chunks.length === 0)}
						>
							{#if isPlaying}
								<PauseIcon />
								<span>Pause</span>
							{:else}
								<PlayIcon />
								<span>{processed() || status === 'generating' ? 'Play' : 'Generate'}</span>
							{/if}
						</button>

						<button
							class="secondary-action-btn"
							onclick={downloadAudio}
							disabled={!result || status !== 'ready'}
						>
							<DownloadIcon />
							<span>Download Audio</span>
						</button>
					</div>

					<!-- Hidden Audio Chunks -->
					<div class="hidden">
						{#if chunks.length > 0}
							{#each chunks as chunk, index (index)}
								<AudioChunk
									audio={chunk.audio}
									active={currentChunkIndex === index}
									playing={isPlaying}
									onStart={() => setCurrentChunkIndex(index)}
									onPause={() => {
										if (currentChunkIndex === index) setIsPlaying(false);
									}}
									onEnd={handleChunkEnd}
								/>
							{/each}
						{/if}
					</div>
				{/if}
			{/if}
		</div>
	</ContentArea>
</CardInterface>

<style>
	.tts-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.model-selection-intro {
		text-align: center;
		padding: 2rem;
		background: var(--color-background-secondary);
		border: var(--border-brutalist-thick);
		box-shadow: var(--shadow-brutalist-medium);
		margin-bottom: 1rem;
		transform: rotate(-0.5deg);
	}

	.model-selection-intro h2 {
		margin: 0 0 1rem 0;
		font-family: var(--font-family-display);
		font-size: 2rem;
		color: var(--color-text-primary);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}

	.title-icon {
		display: flex;
		align-items: center;
		color: var(--color-text-primary);
	}

	.title-icon :global(svg) {
		width: 2rem;
		height: 2rem;
	}

	.model-selection-intro p {
		margin: 0;
		font-size: 1.125rem;
		color: var(--color-text-secondary);
	}

	.text-input-section {
		background: var(--color-background-main);
		border: var(--border-brutalist-thick);
		padding: 1.5rem;
		box-shadow: var(--shadow-brutalist-large);
		transform: rotate(0.2deg);
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.section-header h3 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-text-primary);
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.text-input-wrapper {
		position: relative;
	}

	.text-input {
		width: 100%;
		min-height: 180px;
		padding: 1rem;
		padding-top: 2rem;
		border: var(--border-brutalist-thin);
		font-family: var(--font-family-primary);
		font-size: 1rem;
		resize: vertical;
		box-sizing: border-box;
		background: var(--color-background-main);
		transition: all 0.2s;
	}

	.text-input:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: var(--shadow-brutalist-small);
	}

	.text-input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.copy-button {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		width: 36px;
		height: 36px;
		background: var(--color-background-main);
		border: var(--border-brutalist-thin);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
		color: var(--color-text-primary);
	}

	.copy-button :global(svg) {
		width: 18px;
		height: 18px;
	}

	.copy-button:hover {
		background: var(--color-primary);
		transform: translate(-1px, -1px);
		box-shadow: var(--shadow-brutalist-small);
	}

	.controls-section {
		background: var(--color-background-tertiary);
		border: var(--border-brutalist-thick);
		padding: 1.5rem;
		box-shadow: var(--shadow-brutalist-medium);
		transform: rotate(-0.3deg);
	}

	.controls-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
		margin-bottom: 1rem;
	}

	.control-item {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.control-item label {
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--color-text-primary);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.action-buttons {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	.primary-action-btn,
	.secondary-action-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem 2rem;
		border: var(--border-brutalist-thick);
		cursor: pointer;
		font-size: 1.125rem;
		font-weight: 700;
		transition: all 0.2s;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-family: var(--font-family-primary);
		box-shadow: var(--shadow-brutalist-medium);
	}

	.primary-action-btn {
		background: var(--color-success);
		color: var(--color-text-primary);
	}

	.primary-action-btn.playing {
		background: var(--color-warning);
	}

	.primary-action-btn:hover:not(:disabled) {
		transform: translate(-2px, -2px);
		box-shadow: var(--shadow-brutalist-large);
	}

	.primary-action-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.secondary-action-btn {
		background: var(--color-background-main);
		color: var(--color-text-primary);
	}

	.secondary-action-btn:hover:not(:disabled) {
		background: var(--color-primary);
		transform: translate(-2px, -2px);
		box-shadow: var(--shadow-brutalist-large);
	}

	.secondary-action-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.primary-action-btn :global(svg),
	.secondary-action-btn :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}

	.hidden {
		display: none;
	}

	@media (max-width: 768px) {
		.controls-grid {
			grid-template-columns: 1fr;
		}

		.action-buttons {
			flex-direction: column;
		}

		.primary-action-btn,
		.secondary-action-btn {
			width: 100%;
			justify-content: center;
		}
	}

	@media (max-width: 600px) {
		.text-input-section {
			padding: 1rem;
		}

		.controls-section {
			padding: 1rem;
		}

		.model-selection-intro {
			padding: 1.5rem;
		}

		.model-selection-intro h2 {
			font-size: 1.5rem;
		}
	}
</style>
