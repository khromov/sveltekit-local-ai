<script lang="ts">
	import { Wllama } from '@wllama/wllama';
	import { onMount } from 'svelte';
	import { WLLAMA_CONFIG_PATHS, AVAILABLE_MODELS } from '$lib/wllama-config';

	let wllama: Wllama;
	let isModelLoaded = $state(false);
	let isLoading = $state(false);
	let isGenerating = $state(false);

	// Keep track of our text and step count
	let fullText = $state('Tell me a short story.');
	let stepCount = $state(0);

	// Load the model
	async function loadModel() {
		isLoading = true;

		wllama = new Wllama(WLLAMA_CONFIG_PATHS);
		await wllama.loadModelFromUrl(AVAILABLE_MODELS[1].url);
		isModelLoaded = true;

		isLoading = false;
	}

	// Generate text - always continues from previous
	async function generate() {
		if (!isModelLoaded || isGenerating) return;
		isGenerating = true;
		stepCount++;
		console.log(`\n--- STEP ${stepCount} ---`);

		try {
			// Save previous text length to track new content
			const prevLength = fullText.length;
			console.log('generating starting from ', fullText);

			let newText = '';
			// Generate completion using the full text so far
			await wllama.createCompletion(fullText, {
				nPredict: 10, // Short continuation to keep it quick
				useCache: true,
				onNewToken: (token, piece, text) => {
					newText = text;
				}
			});

			// Append the new text to the full text
			fullText = fullText + newText;
		} catch (err) {
			console.log('Error: ' + err);
		} finally {
			isGenerating = false;
		}
	}

	// Reset everything
	function reset() {
		fullText = 'Tell me a short story.';
		stepCount = 0;
	}

	onMount(() => {
		if (!isModelLoaded && !isLoading) {
			loadModel();
		}
	});
</script>

<div class="container">
	<h1>KV Cache Test</h1>

	{#if !isModelLoaded}
		<div class="loading">
			{#if isLoading}
				Loading model...
			{:else}
				<button onclick={loadModel}>Load Model</button>
			{/if}
		</div>
	{:else}
		<div class="actions">
			<button onclick={generate} disabled={isGenerating}>
				{stepCount === 0 ? 'Start Generation' : 'Continue Generation'}
			</button>
			<button onclick={reset} disabled={isGenerating}>Reset</button>
		</div>

		<!-- Simple output display -->
		<div class="output-section">
			<h3>Generated Text (Step {stepCount}):</h3>

			{#if isGenerating}
				<div class="generating">Generating...</div>
			{/if}

			<pre class="output">{fullText}</pre>
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		font-family: system-ui, sans-serif;
		padding: 20px;
	}

	h1 {
		text-align: center;
	}

	.actions {
		margin: 20px 0;
		display: flex;
		gap: 10px;
	}

	button {
		padding: 8px 16px;
		background: #0066cc;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	button:disabled {
		background: #999;
		cursor: not-allowed;
	}

	.output-section {
		margin: 20px 0;
	}

	.generating {
		padding: 8px;
		background: #fffde7;
		border: 1px solid #fff59d;
		border-radius: 4px;
		text-align: center;
		margin: 10px 0;
	}

	.output {
		padding: 10px;
		background: #f5f5f5;
		border: 1px solid #ddd;
		border-radius: 4px;
		white-space: pre-wrap;
		min-height: 100px;
		margin: 0;
	}
</style>
