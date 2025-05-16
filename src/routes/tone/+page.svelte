<script lang="ts">
	import { onMount } from 'svelte';
	import ModelLoader from '$lib/components/ModelLoader.svelte';
	import ToneCompass from '$lib/components//ToneCompass.svelte';
	import MessageEditor from '$lib/components//MessageEditor.svelte';
	import InstructionsPanel from '$lib/components//InstructionsPanel.svelte';
	import { Wllama } from '@wllama/wllama';
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

			const progressCallback = ({ loaded, total }) => {
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
prefixes, or anything other than the rewritten message. Keep it concise.
`;

		try {
			let generatedText = '';

			// Generate completion with limited tokens
			await wllama.createCompletion(prompt, {
				nPredict: 10, // Limiting to 10 tokens as requested
				sampling: {
					temp: 0.7
				},
				useCache: true,
				onNewToken: (token, piece, currentText) => {
					generatedText = currentText;
				}
			});

			// Clean up the response
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
		<ModelLoader {isLoading} {downloadError} {downloadProgress} {previousProgress} {loadModel} />
	{:else}
		<div class="adjuster-interface">
			<h1>✨ Message Tone Adjuster ✨</h1>

			<MessageEditor {message} {presets} {selectPreset} />

			<ToneCompass
				{message}
				{isGenerating}
				{direction}
				{originalMessage}
				{errorMessage}
				{adjustTone}
				{resetMessage}
			/>

			<InstructionsPanel />
		</div>
	{/if}
</div>

<style>
	/* Global and container styles */
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

	h1 {
		font-family: 'Nunito', 'Comic Sans MS', cursive, sans-serif;
		color: #5c8d89;
		text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.7);
		text-align: center;
		font-size: 2.2rem;
		margin-bottom: 2rem;
		font-weight: 600;
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
	}
</style>
