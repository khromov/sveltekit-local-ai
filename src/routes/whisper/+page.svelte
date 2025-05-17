<script lang="ts">
	import createModule from '@transcribe/shout';
	import { FileTranscriber } from '@transcribe/transcriber';
	import { onMount } from 'svelte';

	let isReady = $state(false);
	let transcriber: FileTranscriber;
	let text = $state('');

	async function transcribe() {
		if (!transcriber?.isReady) return;

		text = 'Transcribing...';

		// transcribe the file
		// there must be at least one user interaction (e.g click) before you can call this function
		const result = await transcriber.transcribe('/voice-note.wav', { lang: 'en' });

		// do something with the result
		text = result.transcription.map((t) => t.text).join(' ');
	}

	onMount(async () => {
		// create new instance
		transcriber = new FileTranscriber({
			createModule,
			model: '/ggml-tiny-q5_1.bin'
		});

		// and initialize the transcriber
		await transcriber.init();

		isReady = true;
	});
</script>

<h1>Transcribe.js SvelteKit Example</h1>

<p>Click the button to transcribe the example wav file. (check console for detailed output)</p>

{#if isReady}
	<button onclick={transcribe}>Transcribe</button>

	{#if text}
		<p><b>Result:</b> {text}</p>
	{/if}
{/if}
