<script lang="ts">
	import createModule from '@transcribe/shout';
	import { FileTranscriber } from '@transcribe/transcriber';
	import { onMount } from 'svelte';

	let isReady = $state(false);
	let isLoading = $state(true);
	let isTranscribing = $state(false);
	let transcriber: FileTranscriber;
	let text = $state('');
	let error = $state(false);

	async function transcribe() {
		if (!transcriber?.isReady) return;

		text = '';
		isTranscribing = true;

		try {
			// transcribe the file
			// there must be at least one user interaction (e.g click) before you can call this function
			const result = await transcriber.transcribe('/jfk.mp3', { lang: 'en' });

			// do something with the result
			text = result.transcription.map((t) => t.text).join(' ');
		} catch (err) {
			console.error('Transcription error:', err);
			error = true;
			text = 'An error occurred during transcription. Please try again.';
		} finally {
			isTranscribing = false;
		}
	}

	function retry() {
		error = false;
		isLoading = true;
		initTranscriber();
	}

	async function initTranscriber() {
		try {
			// create new instance
			transcriber = new FileTranscriber({
				createModule,
				model: '/ggml-tiny-q5_1.bin'
			});

			// and initialize the transcriber
			await transcriber.init();
			isReady = true;
		} catch (err) {
			console.error('Failed to initialize transcriber:', err);
			error = true;
		} finally {
			isLoading = false;
		}
	}

	onMount(() => {
		initTranscriber();
	});
</script>

<div class="container">
	<h1>Local Audio Transcription</h1>

	{#if isLoading || !isReady}
		<div class="loading">
			{#if error}
				<div class="error">
					<p>Failed to load transcription model. Please check your connection and try again.</p>
					<button onclick={retry} disabled={isLoading}>
						{isLoading ? 'Reloading...' : 'Reload Model'}
					</button>
				</div>
			{:else}
				<div class="loading-progress">
					<h3>Loading Transcription Model</h3>
					<div class="progress-container">
						<div class="progress-bar">
							<div class="progress-bar-fill"></div>
						</div>
					</div>
					<p class="loading-message">
						This will take a moment. The whisper model is being loaded to your browser.
					</p>
				</div>
			{/if}
		</div>
	{:else}
		<div class="transcription-interface">
			<div class="toolbar">
				<span class="model-info">Model: Whisper (tiny.en)</span>
			</div>

			<div class="transcription-content">
				<p class="instruction">
					Click the button below to transcribe the sample audio file (JFK speech).
				</p>

				{#if isTranscribing}
					<div class="transcribing">
						<div class="progress-container">
							<div class="progress-bar">
								<div class="progress-bar-fill"></div>
							</div>
						</div>
						<p>Transcribing audio... Please wait.</p>
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

			<div class="input-area">
				<button onclick={transcribe} disabled={isTranscribing} class="transcribe-btn">
					{isTranscribing ? 'Transcribing...' : 'Transcribe Sample Audio'}
				</button>

				<div class="disclaimer">
					Transcription is performed locally in your browser. Results may not always be accurate.
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	/* Base styles - matching the main app styles */
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 1rem;
	}

	h1 {
		text-align: center;
		font-size: 24px;
		margin: 0 0 16px 0;
		font-weight: 600;
		background: linear-gradient(to right, #0071e3, #42aaff);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	/* Loading and Error Styles */
	.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.75rem;
		margin: 1rem 0;
		animation: fadeIn 0.4s ease-out;
		width: 100%;
	}

	.loading-progress {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
		padding: 2.5rem;
		background-color: white;
		border-radius: 20px;
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
		width: 100%;
		max-width: 500px;
		text-align: center;
	}

	.loading-progress h3 {
		font-size: 1.5rem;
		font-weight: 600;
		margin: 0;
		color: #111;
	}

	.progress-container {
		width: 100%;
		margin: 0.5rem 0;
	}

	.progress-bar {
		height: 0.6rem;
		background-color: #e1e1e1;
		border-radius: 8px;
		overflow: hidden;
		width: 100%;
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
		width: 100%;
	}

	.loading-message {
		font-size: 0.9375rem;
		color: #666;
		margin: 0;
		max-width: 320px;
	}

	.error {
		color: #ff3b30;
		background-color: #feeced;
		padding: 1.5rem;
		border-radius: 16px;
		text-align: center;
		box-shadow: 0 2px 12px rgba(255, 59, 48, 0.15);
		width: 100%;
		max-width: 500px;
		animation: errorPulse 2s infinite alternate;
	}

	.error p {
		font-size: 1.0625rem;
		margin-bottom: 1.25rem;
		line-height: 1.5;
	}

	.error button {
		padding: 0.875rem 1.5rem;
		background-color: #ff3b30;
		color: white;
		border: none;
		border-radius: 12px;
		cursor: pointer;
		font-size: 1.0625rem;
		font-weight: 500;
		transition: all 0.2s;
		box-shadow: 0 2px 8px rgba(255, 59, 48, 0.3);
	}

	.error button:hover {
		background-color: #e0352b;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(255, 59, 48, 0.4);
	}

	.error button:active {
		transform: translateY(0);
		box-shadow: 0 1px 3px rgba(255, 59, 48, 0.3);
	}

	/* Transcription Interface */
	.transcription-interface {
		border-radius: 16px;
		overflow: hidden;
		border: none;
		background-color: white;
		box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
		width: 100%;
	}

	.toolbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.25rem;
		background-color: #f8f8f8;
		border-bottom: 1px solid #e5e5e5;
	}

	.model-info {
		font-size: 1rem;
		font-weight: 500;
		color: #666;
	}

	.transcription-content {
		padding: 1.25rem;
		background-color: #f5f5f7;
		min-height: 300px;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.instruction {
		text-align: center;
		font-size: 1.0625rem;
		color: #555;
		margin: 0.5rem 0;
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

	.transcribing p {
		margin-top: 1rem;
		color: #555;
		font-weight: 500;
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

	/* Input Area */
	.input-area {
		padding: 1rem 1.25rem;
		border-top: 1px solid #e5e5e5;
		background-color: white;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.transcribe-btn {
		padding: 0.875rem 1.5rem;
		background-color: #0071e3;
		color: white;
		border: none;
		border-radius: 14px;
		cursor: pointer;
		font-size: 1.125rem;
		font-weight: 500;
		transition: all 0.2s;
		box-shadow: 0 2px 8px rgba(0, 113, 227, 0.3);
		width: auto;
		min-width: 250px;
		text-align: center;
	}

	.transcribe-btn:hover {
		background-color: #0062cc;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(0, 113, 227, 0.4);
	}

	.transcribe-btn:active {
		transform: translateY(0);
		box-shadow: 0 1px 3px rgba(0, 113, 227, 0.3);
	}

	.transcribe-btn:disabled {
		background-color: #b0b0b0;
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
	}

	.disclaimer {
		margin-top: 1rem;
		font-size: 0.8125rem;
		color: #8e8e93;
		text-align: center;
	}

	/* Animations */
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

	@keyframes errorPulse {
		0% {
			box-shadow: 0 2px 12px rgba(255, 59, 48, 0.15);
		}
		100% {
			box-shadow: 0 2px 16px rgba(255, 59, 48, 0.3);
		}
	}

	/* Responsive adjustments */
	@media (max-width: 600px) {
		.container {
			padding: 0.75rem 1rem;
			margin: 0 auto;
		}

		.loading {
			align-items: stretch;
		}

		.loading-progress,
		.error {
			width: auto;
			max-width: none;
		}

		h1 {
			font-size: 1.5rem;
		}

		.result-content {
			font-size: 1rem;
			padding: 1rem;
		}

		.transcription-interface {
			border-radius: 12px;
		}

		.transcription-content {
			min-height: 250px;
		}

		.loading-progress {
			padding: 1.75rem;
		}
	}
</style>
