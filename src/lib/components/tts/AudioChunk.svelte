<script lang="ts">
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
		if (!audioElement || !url) return; // Ensure URL is ready
		if (!active) return;

		if (playing) {
			if (audioElement.ended) {
				audioElement.currentTime = 0;
			}

			// Add a small delay to ensure audio is ready and handle promise properly
			setTimeout(() => {
				if (audioElement && active && playing) {
					audioElement.play().catch((error) => {
						// Silently handle play interruption errors
						if (error.name !== 'AbortError') {
							console.warn('Audio play failed:', error);
						}
					});
				}
			}, 10);
		} else {
			audioElement.pause();
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
