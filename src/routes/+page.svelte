<script lang="ts">
	import { Wllama } from '@wllama/wllama';
	import { onMount } from 'svelte';

	import singleThreaded from '@wllama/wllama/src/single-thread/wllama.wasm?url';
	import multiThreaded from '@wllama/wllama/src/multi-thread/wllama.wasm?url';

	onMount(async () => {
		const CONFIG_PATHS = {
			'single-thread/wllama.wasm': singleThreaded,
			'multi-thread/wllama.wasm': multiThreaded
		};
		// Automatically switch between single-thread and multi-thread version based on browser support
		// If you want to enforce single-thread, add { "n_threads": 1 } to LoadModelConfig
		const wllama = new Wllama(CONFIG_PATHS);
		// Define a function for tracking the model download progress
		const progressCallback = ({ loaded, total }) => {
			// Calculate the progress as a percentage
			const progressPercentage = Math.round((loaded / total) * 100);
			// Log the progress in a user-friendly format
			console.log(`Downloading... ${progressPercentage}%`);
		};
		// Load GGUF from Hugging Face hub
		// (alternatively, you can use loadModelFromUrl if the model is not from HF hub)
		await wllama.loadModelFromHF('ggml-org/models', 'tinyllamas/stories260K.gguf', {
			progressCallback
		});
		const outputText = await wllama.createCompletion('The ball was', {
			nPredict: 50,
			sampling: {
				temp: 0.5,
				top_k: 40,
				top_p: 0.9
			}
		});
		console.log(outputText);
	});
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
