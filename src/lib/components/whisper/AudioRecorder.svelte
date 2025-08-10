<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		transcribeMode: 'demo' | 'upload' | 'record';
		selectedFile: File | null;
		onFileSelect: (file: File) => void;
		onModeChange: (mode: 'demo' | 'upload' | 'record') => void;
		disabled?: boolean;
	}

	let {
		transcribeMode = $bindable(),
		selectedFile = $bindable(),
		onFileSelect,
		onModeChange,
		disabled = false
	}: Props = $props();

	let mediaRecorder: MediaRecorder | null = null;
	let audioChunks: Blob[] = [];
	let isRecording = $state(false);
	let recordingTime = $state(0);
	let recordingInterval: number | null = null;
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
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
				<circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" />
				<path d="M8 5V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
				<circle cx="8" cy="11" r="0.5" fill="currentColor" />
			</svg>
			{recordingError}
		</div>
	{/if}

	{#if !isRecording && !audioUrl}
		<button class="record-button" onclick={startRecording} {disabled}>
			<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
				<circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5" />
				<circle cx="10" cy="10" r="4" fill="currentColor" opacity="0.3" />
				<circle cx="10" cy="10" r="3" fill="currentColor" />
			</svg>
			Start Recording
		</button>
	{:else if isRecording}
		<div class="recording-status">
			<div class="recording-indicator">
				<span class="recording-dot"></span>
				<span class="recording-time">Recording... {formatTime(recordingTime)}</span>
			</div>
			<button class="stop-button" onclick={stopRecording}>
				<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
					<rect x="6" y="6" width="8" height="8" rx="2" fill="currentColor" />
				</svg>
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
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
					<path
						d="M2 8C2 4.7 4.7 2 8 2C10.2 2 12.1 3.1 13.3 4.7L14 6"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M14 2V6H10"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
				Clear Recording
			</button>
		</div>
	{/if}
</div>

<style>
	.audio-recorder {
		margin-top: 1rem;
		padding: 1.5rem;
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.8) 0%,
			rgba(250, 248, 243, 0.85) 100%
		);
		border: 1px solid rgba(139, 111, 71, 0.15);
		box-shadow:
			0 2px 12px rgba(46, 90, 61, 0.06),
			inset 0 1px 0 rgba(255, 255, 255, 0.5);
		border-radius: 12px;
		backdrop-filter: blur(5px);
	}

	.error-message {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.875rem;
		background: linear-gradient(135deg, rgba(212, 165, 116, 0.1) 0%, rgba(139, 111, 71, 0.08) 100%);
		border: 1px solid rgba(212, 165, 116, 0.3);
		margin-bottom: 1rem;
		font-weight: 500;
		color: var(--earth-soil);
		border-radius: 8px;
		font-size: 0.875rem;
		letter-spacing: 0.01em;
	}

	.record-button,
	.stop-button,
	.clear-button {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.25rem;
		background: linear-gradient(135deg, var(--forest-light) 0%, var(--forest-primary) 100%);
		color: white;
		border: 1px solid rgba(46, 90, 61, 0.3);
		box-shadow:
			0 4px 16px rgba(45, 90, 61, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.1);
		font-size: 0.9375rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		border-radius: 10px;
		letter-spacing: 0.02em;
		font-family: 'Space Grotesk', system-ui, sans-serif;
	}

	.stop-button {
		background: linear-gradient(135deg, var(--earth-clay) 0%, var(--earth-soil) 100%);
	}

	.clear-button {
		background: linear-gradient(135deg, rgba(168, 185, 159, 0.2) 0%, rgba(139, 111, 71, 0.15) 100%);
		color: var(--text-primary);
		border-color: rgba(139, 111, 71, 0.2);
		margin-top: 0.75rem;
	}

	.record-button:hover:not(:disabled),
	.stop-button:hover:not(:disabled),
	.clear-button:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow:
			0 6px 24px rgba(45, 90, 61, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.15);
	}

	.record-button:disabled,
	.stop-button:disabled,
	.clear-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
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
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.9) 0%,
			rgba(250, 248, 243, 0.95) 100%
		);
		border: 1px solid rgba(212, 165, 116, 0.2);
		font-weight: 600;
		font-size: 1rem;
		border-radius: 10px;
		color: var(--text-primary);
		letter-spacing: 0.01em;
	}

	.recording-dot {
		width: 10px;
		height: 10px;
		background: var(--earth-clay);
		border-radius: 50%;
		animation: pulse-dot 1.5s infinite;
		box-shadow: 0 0 0 0 rgba(212, 165, 116, 0.4);
	}

	@keyframes pulse-dot {
		0% {
			box-shadow: 0 0 0 0 rgba(212, 165, 116, 0.4);
		}
		70% {
			box-shadow: 0 0 0 6px rgba(212, 165, 116, 0);
		}
		100% {
			box-shadow: 0 0 0 0 rgba(212, 165, 116, 0);
		}
	}

	.recorded-audio {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.audio-player {
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.9) 0%,
			rgba(250, 248, 243, 0.95) 100%
		);
		padding: 1rem;
		border: 1px solid rgba(139, 111, 71, 0.15);
		border-radius: 10px;
		box-shadow: 0 2px 8px rgba(46, 90, 61, 0.05);
	}

	.audio-player audio {
		width: 100%;
		outline: none;
		filter: sepia(0.2) hue-rotate(70deg);
	}

	.audio-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		color: var(--text-primary);
	}

	.audio-info strong {
		font-size: 1rem;
		font-weight: 600;
		letter-spacing: 0.01em;
	}

	.audio-info small {
		color: var(--text-secondary);
		font-weight: 400;
		font-size: 0.875rem;
		letter-spacing: 0.02em;
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
			padding: 0.625rem 1rem;
			font-size: 0.875rem;
		}
	}
</style>
