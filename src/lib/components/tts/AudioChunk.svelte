<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		audio: Blob;
		active: boolean;
		playing: boolean;
		onStart?: () => void;
		onEnd?: () => void;
		onPause?: () => void;
	}

	let { audio, active, playing, onStart, onEnd, onPause }: Props = $props();

	let audioElement: HTMLAudioElement | undefined = $state();
	let url = $state<string>('');

	function handlePause() {
		if (audioElement?.ended) return;
		onPause?.();
	}

	// Create URL for the audio blob
	$effect(() => {
		url = URL.createObjectURL(audio);
		return () => {
			URL.revokeObjectURL(url);
		};
	});

	// Watch for changes in active/playing state
	$effect(() => {
		if (!audioElement) return;
		if (!active) return;

		if (playing) {
			if (audioElement.ended) {
				audioElement.currentTime = 0;
			}
			audioElement.play();
		} else {
			audioElement.pause();
		}
	});

	onMount(() => {
		if (!audio || !audioElement) return;

		if (active) {
			audioElement.play();
		} else {
			audioElement.pause();
			audioElement.currentTime = 0;
		}
	});
</script>

<audio
	bind:this={audioElement}
	src={url}
	controls
	onplay={onStart}
	onpause={handlePause}
	onended={onEnd}
	hidden
></audio>

<style>
	audio {
		display: none;
	}
</style>
