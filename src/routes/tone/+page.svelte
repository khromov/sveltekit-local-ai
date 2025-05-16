<script lang="ts">
	import { Wllama, type DownloadProgressCallback } from '@wllama/wllama';
	import { onMount } from 'svelte';
	import { WLLAMA_CONFIG_PATHS, AVAILABLE_MODELS } from '$lib/wllama-config';
	import { inferenceParams } from '$lib/stores';

	// State variables
	let wllama: Wllama;
	let isModelLoaded = $state(false);
	let isLoading = $state(false);
	let isGenerating = $state(false);
	let downloadProgress = $state(0);
	let previousProgress = $state(0);
	let downloadError = $state(false);
	let selectedModel = $state(AVAILABLE_MODELS[0]);

	// Tone adjuster specific state
	let message = $state('');
	let originalMessage = $state('');
	let isAdjusting = $state(false);
	let direction = $state('');
	let errorMessage = $state('');

	// Example presets
	const presets = [
		'I need this report by tomorrow.',
		"I'm not happy with your performance.",
		'We should consider a different approach.',
		"I don't agree with that decision."
	];

	// Load the model
	async function loadModel() {
		try {
			isLoading = true;
			downloadError = false;
			downloadProgress = 0;
			previousProgress = 0;
			errorMessage = '';

			wllama = new Wllama(WLLAMA_CONFIG_PATHS);

			const progressCallback: DownloadProgressCallback = ({ loaded, total }) => {
				previousProgress = downloadProgress;
				downloadProgress = Math.round((loaded / total) * 100);
			};

			await wllama.loadModelFromUrl(selectedModel.url, {
				progressCallback,
				n_threads: $inferenceParams.nThreads > 0 ? $inferenceParams.nThreads : undefined,
				n_ctx: $inferenceParams.nContext,
				n_batch: $inferenceParams.nBatch
			});

			isModelLoaded = true;
		} catch (err) {
			console.error('Model loading error:', err);
			downloadError = true;
		} finally {
			isLoading = false;
		}
	}

	// Adjust the tone based on direction
	async function adjustTone(dir: 'up' | 'down' | 'left' | 'right') {
		if (!isModelLoaded || isGenerating || !message.trim()) {
			return;
		}

		isGenerating = true;
		direction = dir;
		errorMessage = '';

		// Define what each direction means
		const directionDescriptions = {
			up: 'more formal and professional',
			down: 'more casual and friendly',
			left: 'more concise and direct',
			right: 'more elaborate and detailed'
		};

		// Construct the prompt
		const prompt = `
You are a helpful assistant that rewrites messages with different tones. 
Original message: "${message}"

Your task is to rewrite this message with a ${directionDescriptions[dir]} tone.

The ONLY thing you should output is the rewritten message. Do not include any explanations, 
prefixes, or anything other than the rewritten message.
`;

		try {
			let generatedText = '';

			// Generate completion
			await wllama.createCompletion(prompt, {
				nPredict: 1024,
				sampling: {
					temp: 0.7
				},
				useCache: true,
				onNewToken: (token, piece, currentText) => {
					console.log('Token:', currentText);
					generatedText = currentText;
				}
			});

			// Clean up the response - we only want the rewritten message
			// Removing any quotes or other formatting the model might add
			const cleanedText = generatedText.trim().replace(/^["']|["']$/g, '');

			if (!originalMessage) {
				originalMessage = message;
			}

			message = cleanedText;
		} catch (err) {
			console.error('Generation error:', err);
			errorMessage = 'Failed to adjust tone. Please try again.';
		} finally {
			isGenerating = false;
		}
	}

	// Reset to original message
	function resetMessage() {
		if (originalMessage) {
			message = originalMessage;
		}
		originalMessage = '';
	}

	// Select a preset
	function selectPreset(preset: string) {
		message = preset;
		originalMessage = '';
	}

	// Initialize on component mount
	onMount(() => {
		if (!isModelLoaded && !isLoading) {
			loadModel();
		}
	});
</script>

<svelte:head>
	<title>Tone Adjuster - Animal Crossing Style</title>
</svelte:head>

<div class="tone-adjuster-container">
	{#if !isModelLoaded}
		<div class="loading-container">
			{#if downloadError}
				<div class="error">
					<p>Failed to load model. Please check your connection and try again.</p>
					<button onclick={loadModel} disabled={isLoading}>
						{isLoading ? 'Reloading...' : 'Reload Model'}
					</button>
				</div>
			{:else if isLoading}
				<div class="loading-progress">
					<h3>Loading Model</h3>
					<p class="download-percentage">{downloadProgress}% Complete</p>
					<div class="progress-container">
						<div class="progress-bar">
							<div
								class="progress-bar-fill"
								style="width: {downloadProgress}%; transition: width {downloadProgress >
								previousProgress
									? '0.5s'
									: '0s'} ease"
							></div>
						</div>
					</div>
					<p class="loading-message">
						This will take a couple of minutes. The AI model is being downloaded to your browser.
					</p>
				</div>
			{:else}
				<div class="model-loading">
					<h2>Loading your friendly tone adjuster!</h2>
					<button onclick={loadModel}>Start Tone Adjuster</button>
				</div>
			{/if}
		</div>
	{:else}
		<div class="adjuster-interface">
			<h1>✨ Message Tone Adjuster ✨</h1>

			<div class="presets">
				<h3>Example Messages:</h3>
				<div class="preset-buttons">
					{#each presets as preset}
						<button onclick={() => selectPreset(preset)} class="preset-btn">
							{preset}
						</button>
					{/each}
				</div>
			</div>

			<div class="compass-container">
				<!-- Up Button -->
				<button
					class="compass-btn up-btn"
					onclick={() => adjustTone('up')}
					disabled={isGenerating || !message.trim()}
				>
					{#if isGenerating && direction === 'up'}
						<div class="loading-dots">
							<span></span><span></span><span></span>
						</div>
					{:else}
						<span>Formal</span>
					{/if}
				</button>

				<div class="horizontal-buttons">
					<!-- Left Button -->
					<button
						class="compass-btn left-btn"
						onclick={() => adjustTone('left')}
						disabled={isGenerating || !message.trim()}
					>
						{#if isGenerating && direction === 'left'}
							<div class="loading-dots">
								<span></span><span></span><span></span>
							</div>
						{:else}
							<span>Concise</span>
						{/if}
					</button>

					<!-- Center Message Box -->
					<div class="message-container">
						<textarea
							bind:value={message}
							placeholder="Enter your message here or select a preset above"
							disabled={isGenerating}
						></textarea>
						{#if originalMessage}
							<button onclick={resetMessage} class="reset-btn" disabled={isGenerating}>
								Reset
							</button>
						{/if}
						{#if errorMessage}
							<div class="error-message">{errorMessage}</div>
						{/if}
					</div>

					<!-- Right Button -->
					<button
						class="compass-btn right-btn"
						onclick={() => adjustTone('right')}
						disabled={isGenerating || !message.trim()}
					>
						{#if isGenerating && direction === 'right'}
							<div class="loading-dots">
								<span></span><span></span><span></span>
							</div>
						{:else}
							<span>Elaborate</span>
						{/if}
					</button>
				</div>

				<!-- Down Button -->
				<button
					class="compass-btn down-btn"
					onclick={() => adjustTone('down')}
					disabled={isGenerating || !message.trim()}
				>
					{#if isGenerating && direction === 'down'}
						<div class="loading-dots">
							<span></span><span></span><span></span>
						</div>
					{:else}
						<span>Casual</span>
					{/if}
				</button>
			</div>

			<div class="instructions">
				<p>Click a direction to adjust the tone of your message!</p>
				<ul class="direction-guide">
					<li>
						<span class="direction-label up-color">↑ Formal:</span> More professional and polite
					</li>
					<li>
						<span class="direction-label down-color">↓ Casual:</span> More friendly and relaxed
					</li>
					<li>
						<span class="direction-label left-color">← Concise:</span> More direct and to the point
					</li>
					<li>
						<span class="direction-label right-color">→ Elaborate:</span> More detailed and descriptive
					</li>
				</ul>
			</div>
		</div>
	{/if}
</div>

<style>
	/* Animal Crossing Inspired Styles */
	:global(body) {
		margin: 0;
		padding: 0;
		font-family:
			'Nunito',
			'Segoe UI',
			-apple-system,
			BlinkMacSystemFont,
			sans-serif;
		background-color: #e8f5e9;
		height: 100vh;
		width: 100vw;
		overflow-x: hidden;
	}

	.tone-adjuster-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		width: 100%;
		padding: 2rem;
		box-sizing: border-box;
		background-image:
			linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6)),
			url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm48 25a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm-43-7a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm63 31a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM34 90a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm56-76a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-22 26a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-6-11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM26 59a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm36 33a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-8 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm9-65a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-11 28a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm3-18a3 3 0 1 0 0-6 3 3 0 0 0 0 6z' fill='%23f8d488' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E"),
			linear-gradient(to bottom, #c8eedc, #e8f7dd);
		background-size:
			cover,
			300px 300px,
			100% 100%;
		background-attachment: fixed;
	}

	h1,
	h2,
	h3 {
		font-family: 'Nunito', 'Comic Sans MS', cursive, sans-serif;
		color: #5c8d89;
		text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.7);
		text-align: center;
	}

	h1 {
		font-size: 2.2rem;
		margin-bottom: 2rem;
	}

	.adjuster-interface {
		width: 100%;
		max-width: 800px;
		background-color: rgba(255, 255, 255, 0.9);
		border-radius: 20px;
		box-shadow: 0 8px 32px rgba(92, 141, 137, 0.2);
		padding: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		border: 5px solid #78c2ad;
	}

	.presets {
		width: 100%;
		margin-bottom: 1rem;
	}

	.presets h3 {
		margin-bottom: 0.75rem;
	}

	.preset-buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		justify-content: center;
	}

	.preset-btn {
		background-color: #fef0d5;
		color: #5b5b5b;
		border: 2px solid #f8d488;
		border-radius: 12px;
		padding: 0.5rem 1rem;
		font-size: 0.9rem;
		cursor: pointer;
		transition: all 0.2s;
		font-family: 'Nunito', sans-serif;
	}

	.preset-btn:hover {
		background-color: #f8d488;
		transform: translateY(-2px);
	}

	.compass-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		width: 100%;
	}

	.horizontal-buttons {
		display: flex;
		align-items: center;
		gap: 1rem;
		width: 100%;
	}

	.message-container {
		flex: 1;
		position: relative;
		width: 100%;
		max-width: 400px;
	}

	textarea {
		width: 100%;
		height: 120px;
		padding: 1rem;
		border-radius: 16px;
		border: 3px solid #78c2ad;
		background-color: #ffffff;
		font-family: 'Nunito', sans-serif;
		font-size: 1rem;
		line-height: 1.5;
		resize: none;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		transition: all 0.2s;
		color: #5b5b5b;
		box-sizing: border-box;
	}

	textarea:focus {
		outline: none;
		border-color: #5c8d89;
		box-shadow: 0 4px 12px rgba(92, 141, 137, 0.3);
	}

	.compass-btn {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		border: none;
		background-color: #78c2ad;
		color: white;
		font-family: 'Nunito', sans-serif;
		font-size: 0.9rem;
		font-weight: bold;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
		position: relative;
		overflow: hidden;
	}

	.compass-btn:hover:not(:disabled) {
		transform: scale(1.1);
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
	}

	.compass-btn:active:not(:disabled) {
		transform: scale(0.95);
	}

	.compass-btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.up-btn {
		background-color: #4e7a76;
	}

	.down-btn {
		background-color: #f8a978;
	}

	.left-btn {
		background-color: #f5c2c1;
	}

	.right-btn {
		background-color: #a0d2db;
	}

	.reset-btn {
		position: absolute;
		bottom: -15px;
		left: 50%;
		transform: translateX(-50%);
		background-color: #ffe4e1;
		color: #5b5b5b;
		border: 2px solid #f5c2c1;
		border-radius: 12px;
		padding: 0.4rem 1rem;
		font-size: 0.9rem;
		cursor: pointer;
		transition: all 0.2s;
		font-family: 'Nunito', sans-serif;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.reset-btn:hover:not(:disabled) {
		background-color: #f5c2c1;
		transform: translateX(-50%) translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	.reset-btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.instructions {
		text-align: center;
		color: #5b5b5b;
		font-size: 1rem;
		margin-top: 1rem;
	}

	.direction-guide {
		list-style-type: none;
		padding: 0;
		margin: 0.5rem 0;
		display: inline-block;
		text-align: left;
	}

	.direction-guide li {
		margin: 0.4rem 0;
		font-size: 0.9rem;
	}

	.direction-label {
		font-weight: bold;
		margin-right: 0.3rem;
	}

	.up-color {
		color: #4e7a76;
	}

	.down-color {
		color: #f8a978;
	}

	.left-color {
		color: #f5c2c1;
	}

	.right-color {
		color: #a0d2db;
	}

	.error-message {
		color: #e57373;
		font-size: 0.9rem;
		text-align: center;
		margin-top: 0.5rem;
	}

	/* Loading Animation */
	.loading-dots {
		display: flex;
		gap: 4px;
		align-items: center;
		justify-content: center;
	}

	.loading-dots span {
		width: 8px;
		height: 8px;
		background-color: white;
		border-radius: 50%;
		display: inline-block;
		animation: bounce 1.4s infinite ease-in-out both;
	}

	.loading-dots span:nth-child(1) {
		animation-delay: -0.32s;
	}

	.loading-dots span:nth-child(2) {
		animation-delay: -0.16s;
	}

	@keyframes bounce {
		0%,
		80%,
		100% {
			transform: scale(0);
		}
		40% {
			transform: scale(1);
		}
	}

	/* Loading Container Styles */
	.loading-container {
		width: 100%;
		max-width: 500px;
		background-color: rgba(255, 255, 255, 0.9);
		border-radius: 20px;
		box-shadow: 0 8px 32px rgba(92, 141, 137, 0.2);
		padding: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		border: 5px solid #78c2ad;
	}

	.loading-progress {
		width: 100%;
		text-align: center;
	}

	.download-percentage {
		font-size: 1.2rem;
		font-weight: bold;
		color: #5c8d89;
		margin: 0.5rem 0;
	}

	.progress-container {
		width: 100%;
		margin: 1rem 0;
	}

	.progress-bar {
		height: 12px;
		background-color: #e1e1e1;
		border-radius: 6px;
		overflow: hidden;
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	.progress-bar-fill {
		height: 100%;
		background-color: #78c2ad;
		border-radius: 6px;
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
		background-size: 20px 20px;
		animation: progress-animation 1s linear infinite;
	}

	@keyframes progress-animation {
		0% {
			background-position: 0 0;
		}
		100% {
			background-position: 20px 0;
		}
	}

	.loading-message {
		font-size: 0.9rem;
		color: #5b5b5b;
		text-align: center;
		margin-top: 1rem;
	}

	.model-loading {
		text-align: center;
	}

	.model-loading button {
		background-color: #78c2ad;
		color: white;
		border: none;
		border-radius: 16px;
		padding: 0.75rem 1.5rem;
		font-size: 1.1rem;
		cursor: pointer;
		transition: all 0.2s;
		font-family: 'Nunito', sans-serif;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	}

	.model-loading button:hover {
		background-color: #5c8d89;
		transform: translateY(-2px);
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
	}

	.error {
		color: #e57373;
		text-align: center;
	}

	.error button {
		background-color: #e57373;
		color: white;
		border: none;
		border-radius: 12px;
		padding: 0.6rem 1.2rem;
		font-size: 1rem;
		cursor: pointer;
		transition: all 0.2s;
		font-family: 'Nunito', sans-serif;
		margin-top: 1rem;
	}

	.error button:hover:not(:disabled) {
		background-color: #ef5350;
		transform: translateY(-2px);
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.tone-adjuster-container {
			padding: 1rem;
		}

		.adjuster-interface {
			padding: 1.5rem;
		}

		h1 {
			font-size: 1.8rem;
		}

		.horizontal-buttons {
			flex-direction: column;
		}

		.compass-btn {
			width: 70px;
			height: 70px;
			font-size: 0.8rem;
		}

		.message-container {
			order: -1;
			margin-bottom: 1rem;
		}

		textarea {
			height: 100px;
		}
	}
</style>
