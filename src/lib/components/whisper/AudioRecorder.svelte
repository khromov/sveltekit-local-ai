<script lang="ts">
	import AlertTriangleIcon from 'virtual:icons/lucide/alert-triangle';
	import MicIcon from 'virtual:icons/lucide/mic';
	import SquareIcon from 'virtual:icons/lucide/square';
	import Trash2Icon from 'virtual:icons/lucide/trash-2';

	interface Props {
		transcribeMode: 'demo' | 'upload' | 'record';
		selectedFile: File | null;
		onFileSelect: (file: File) => void;
		disabled?: boolean;
	}

	let {
		transcribeMode = $bindable(),
		selectedFile = $bindable(),
		onFileSelect,
		disabled = false
	}: Props = $props();

	let mediaRecorder: MediaRecorder | null = null;
	let audioChunks: Blob[] = [];
	let isRecording = $state(false);
	let recordingTime = $state(0);
	let recordingInterval: ReturnType<typeof setInterval> | null = null;
	let audioUrl = $state<string | null>(null);
	let recordingError = $state<string | null>(null);

	async function startRecording() {
		try {
			recordingError = null;
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

			mediaRecorder = new MediaRecorder(stream);
			audioChunks = [];

			mediaRecorder.ondataavailable = (event) => {
				audioChunks.push(event.data);
			};

			mediaRecorder.onstop = async () => {
				const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
				audioUrl = URL.createObjectURL(audioBlob);

				const fileName = `recording-${Date.now()}.webm`;
				const audioFile = new File([audioBlob], fileName, { type: 'audio/webm' });

				selectedFile = audioFile;
				onFileSelect(audioFile);

				stream.getTracks().forEach((track) => track.stop());
			};

			mediaRecorder.start();
			isRecording = true;
			recordingTime = 0;

			recordingInterval = setInterval(() => {
				recordingTime++;
			}, 1000);
		} catch (error) {
			console.error('Error accessing microphone:', error);
			recordingError = 'Unable to access microphone. Please check your permissions.';
		}
	}

	function stopRecording() {
		if (mediaRecorder && mediaRecorder.state !== 'inactive') {
			mediaRecorder.stop();
			isRecording = false;

			if (recordingInterval) {
				clearInterval(recordingInterval);
				recordingInterval = null;
			}
		}
	}

	function clearRecording() {
		if (audioUrl) {
			URL.revokeObjectURL(audioUrl);
			audioUrl = null;
		}
		selectedFile = null;
		recordingTime = 0;
		recordingError = null;
	}

	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	}

	$effect(() => {
		return () => {
			if (recordingInterval) {
				clearInterval(recordingInterval);
			}
			if (audioUrl) {
				URL.revokeObjectURL(audioUrl);
			}
			if (mediaRecorder && mediaRecorder.state !== 'inactive') {
				mediaRecorder.stop();
			}
		};
	});
</script>

<div class="audio-recorder">
	{#if recordingError}
		<div class="error-message">
			<span class="error-icon"><AlertTriangleIcon /></span>
			{recordingError}
		</div>
	{/if}

	{#if !isRecording && !audioUrl}
		<button class="record-button" onclick={startRecording} {disabled}>
			<span class="button-icon"><MicIcon /></span>
			Start Recording
		</button>
	{:else if isRecording}
		<div class="recording-status">
			<div class="recording-indicator">
				<span class="recording-dot"></span>
				Recording... {formatTime(recordingTime)}
			</div>
			<button class="stop-button" onclick={stopRecording}>
				<span class="button-icon"><SquareIcon /></span>
				Stop Recording
			</button>
		</div>
	{:else if audioUrl}
		<div class="recorded-audio">
			<div class="audio-player">
				<audio controls src={audioUrl}></audio>
			</div>
			<div class="audio-info">
				<strong>Recording Complete</strong>
				<small>{formatTime(recordingTime)} • {selectedFile?.name}</small>
			</div>
			<button class="clear-button" onclick={clearRecording} {disabled}>
				<span class="button-icon"><Trash2Icon /></span>
				Clear Recording
			</button>
		</div>
	{/if}
</div>

<style>
	.audio-recorder {
		margin-top: 1rem;
		padding: 1.5rem;
		background: var(--color-background-light-blue);
		border: var(--border-brutalist-thick);
		box-shadow: 5px 5px 0 var(--color-text-primary);
		transform: rotate(-0.5deg);
	}

	.error-message {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem;
		background: var(--color-background-light-pink);
		border: var(--border-brutalist-thin);
		border-color: var(--color-danger);
		margin-bottom: 1rem;
		font-weight: 500;
		color: var(--color-text-danger);
	}

	.error-icon {
		font-size: 1.25rem;
		display: flex;
		align-items: center;
		color: var(--color-text-danger);
	}

	.error-icon :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}

	.record-button,
	.stop-button,
	.clear-button {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		background: var(--color-background-main);
		border: var(--border-brutalist-thick);
		box-shadow: var(--shadow-brutalist-medium);
		font-size: 1rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 1px;
		cursor: pointer;
		transition: all 0.15s;
	}

	.record-button {
		background: var(--color-success-hover);
	}

	.stop-button {
		background: var(--color-danger);
		color: var(--color-text-inverse);
	}

	.clear-button {
		background: var(--color-primary-dark);
		margin-top: 1rem;
	}

	.record-button:hover:not(:disabled),
	.stop-button:hover:not(:disabled),
	.clear-button:hover:not(:disabled) {
		transform: translate(-2px, -2px);
		box-shadow: var(--shadow-brutalist-large);
	}

	.record-button:disabled,
	.stop-button:disabled,
	.clear-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.button-icon {
		font-size: 1.25rem;
		display: flex;
		align-items: center;
	}

	.button-icon :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}

	.recording-status {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.recording-indicator {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem;
		background: var(--color-background-main);
		border: var(--border-brutalist-thin);
		font-weight: 700;
		font-size: 1.125rem;
	}

	.recording-dot {
		width: 12px;
		height: 12px;
		background: var(--color-accent-red);
		border-radius: 50%;
		animation: pulse 1.5s infinite;
	}

	@keyframes pulse {
		0% {
			opacity: 1;
			transform: scale(1);
		}
		50% {
			opacity: 0.7;
			transform: scale(1.2);
		}
		100% {
			opacity: 1;
			transform: scale(1);
		}
	}

	.recorded-audio {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.audio-player {
		background: var(--color-background-main);
		padding: 1rem;
		border: var(--border-brutalist-thin);
	}

	.audio-player audio {
		width: 100%;
		outline: none;
	}

	.audio-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.audio-info strong {
		font-size: 1.125rem;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.audio-info small {
		color: var(--color-text-tertiary);
		font-weight: 500;
	}

	@media (max-width: 600px) {
		.audio-recorder {
			padding: 1rem;
		}

		.record-button,
		.stop-button,
		.clear-button {
			width: 100%;
			justify-content: center;
		}
	}
</style>
