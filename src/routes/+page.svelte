<script lang="ts">
	import { Wllama } from '@wllama/wllama';
	import { onMount } from 'svelte';

	import singleThreaded from '@wllama/wllama/src/single-thread/wllama.wasm?url';
	import multiThreaded from '@wllama/wllama/src/multi-thread/wllama.wasm?url';

	// Reactive variables
	let inputText = 'The capital of France is';
	let outputText = '';
	let wllama: Wllama;
	let isLoading = false;
	let isModelLoaded = false;
	let downloadProgress = 0;
	let error = '';

	// Function to generate completion
	async function generateCompletion() {
		if (!isModelLoaded) {
			error = 'Model is not loaded yet. Please wait.';
			return;
		}

		try {
			error = '';
			isLoading = true;
			outputText = await wllama.createCompletion(inputText, {
				nPredict: 50,
				sampling: {
					temp: 0.5,
					top_k: 40,
					top_p: 0.9
				}
			});
		} catch (err) {
			error = `Error generating completion: ${err.message}`;
			console.error(err);
		} finally {
			isLoading = false;
		}
	}

	onMount(async () => {
		try {
			isLoading = true;
			const CONFIG_PATHS = {
				'single-thread/wllama.wasm': singleThreaded,
				'multi-thread/wllama.wasm': multiThreaded
			};

			// Initialize Wllama
			wllama = new Wllama(CONFIG_PATHS);

			// Define a function for tracking the model download progress
			const progressCallback = ({ loaded, total }) => {
				// Calculate the progress as a percentage
				downloadProgress = Math.round((loaded / total) * 100);
				console.log(`Downloading... ${downloadProgress}%`);
			};

			// Load GGUF from Hugging Face hub
			await wllama.loadModelFromHF(
				'HuggingFaceTB/SmolLM2-360M-Instruct-GGUF',
				'smollm2-360m-instruct-q8_0.gguf',
				{
					progressCallback
				}
			);

			isModelLoaded = true;
		} catch (err) {
			error = `Error loading model: ${err.message}`;
			console.error(err);
		} finally {
			isLoading = false;
		}
	});
</script>

<div class="container">
	<h1>SmolLM2 Text Completion</h1>

	{#if !isModelLoaded}
		<div class="loading">
			<p>Loading model: {downloadProgress}%</p>
			<progress value={downloadProgress} max="100"></progress>
		</div>
	{:else}
		<div class="input-section">
			<label for="input-text">Enter your starting text:</label>
			<textarea
				id="input-text"
				bind:value={inputText}
				rows="4"
				cols="50"
				placeholder="Enter text to complete..."
			></textarea>

			<button on:click={generateCompletion} disabled={isLoading}>
				{isLoading ? 'Generating...' : 'Generate Completion'}
			</button>
		</div>

		{#if error}
			<div class="error">
				{error}
			</div>
		{/if}

		{#if outputText}
			<div class="output-section">
				<h2>Completion:</h2>
				<div class="output">{outputText}</div>
			</div>
		{/if}
	{/if}
</div>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 1rem;
	}

	.input-section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	textarea {
		padding: 0.5rem;
		font-family: inherit;
		resize: vertical;
	}

	button {
		padding: 0.5rem 1rem;
		background-color: #4caf50;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1rem;
		max-width: 200px;
		margin-top: 0.5rem;
	}

	button:disabled {
		background-color: #cccccc;
		cursor: not-allowed;
	}

	.loading {
		text-align: center;
		margin: 2rem 0;
	}

	.error {
		color: red;
		margin: 1rem 0;
		padding: 0.5rem;
		background-color: #ffeeee;
		border-radius: 4px;
	}

	.output-section {
		margin-top: 1rem;
		padding: 1rem;
		background-color: #f5f5f5;
		border-radius: 4px;
	}

	.output {
		white-space: pre-wrap;
		font-family: 'Courier New', monospace;
		background-color: white;
		padding: 1rem;
		border-radius: 4px;
		border: 1px solid #ddd;
	}
</style>
