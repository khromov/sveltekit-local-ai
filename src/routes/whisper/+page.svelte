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
			const result = await transcriber.transcribe('/jhf.mp3', { lang: 'en' });

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
				// TODO: Figure out cache,
				// model: 'https://files.khromov.se/whisper/ggml-base-q5_1.bin'
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
	<div class="card-interface">
		<div class="toolbar">
			<span class="model-info">Model: Whisper (tiny.en)</span>
		</div>

		<div class="content-area">
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
			<button onclick={transcribe} disabled={isTranscribing} class="transcribe-btn primary-button">
				{isTranscribing ? 'Transcribing...' : 'Transcribe Sample Audio'}
			</button>

			<div class="disclaimer">
				Transcription is performed locally in your browser. Results may not always be accurate.
			</div>
		</div>
	</div>
{/if}

<style>
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

	.transcribe-btn {
		margin: 0 auto;
		display: block;
		min-width: 250px;
		text-align: center;
	}

	@media (max-width: 600px) {
		.result-content {
			font-size: 1rem;
			padding: 1rem;
		}
	}
</style>
