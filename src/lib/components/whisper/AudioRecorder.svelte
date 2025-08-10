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
	<div class="recorder-decoration">
		<svg viewBox="0 0 60 60" width="60" height="60">
			<circle
				cx="30"
				cy="30"
				r="20"
				fill="none"
				stroke="var(--sage)"
				stroke-width="2"
				opacity="0.3"
			/>
			<circle cx="30" cy="30" r="8" fill="var(--clay)" opacity="0.2">
				{#if isRecording}
					<animate attributeName="r" values="8;12;8" dur="1s" repeatCount="indefinite" />
				{/if}
			</circle>
		</svg>
	</div>

	{#if recordingError}
		<div class="error-message">
			<svg viewBox="0 0 20 20" width="18" height="18" class="error-icon">
				<circle cx="10" cy="10" r="8" fill="none" stroke="#c07860" stroke-width="2" />
				<path d="M7,7 L13,13 M13,7 L7,13" stroke="#8b5a3c" stroke-width="2" />
			</svg>
			{recordingError}
		</div>
	{/if}

	{#if !isRecording && !audioUrl}
		<button class="record-button" onclick={startRecording} {disabled}>
			<svg viewBox="0 0 20 20" width="20" height="20" class="button-icon">
				<circle cx="10" cy="10" r="6" fill="currentColor" />
			</svg>
			Start Recording
		</button>
	{:else if isRecording}
		<div class="recording-status">
			<div class="recording-indicator">
				<svg viewBox="0 0 20 20" width="20" height="20" class="recording-dot">
					<circle cx="10" cy="10" r="6" fill="#c07860">
						<animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />
					</circle>
				</svg>
				<span class="recording-text">Recording... {formatTime(recordingTime)}</span>
			</div>
			<button class="stop-button" onclick={stopRecording}>
				<svg viewBox="0 0 20 20" width="18" height="18" class="button-icon">
					<rect x="6" y="6" width="8" height="8" rx="1" fill="currentColor" />
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
				<div class="audio-title">
					<svg viewBox="0 0 16 16" width="16" height="16" class="audio-icon">
						<path d="M8,2 L14,6 L8,10 L2,6 Z" fill="currentColor" />
					</svg>
					<strong>Recording Complete</strong>
				</div>
				<small>{formatTime(recordingTime)} • {selectedFile?.name}</small>
			</div>
			<button class="clear-button" onclick={clearRecording} {disabled}>
				<svg viewBox="0 0 20 20" width="16" height="16" class="button-icon">
					<path
						d="M3,6 L17,6 M8,6 L8,16 M12,6 L12,16 M6,6 L6,2 L14,2 L14,6"
						stroke="currentColor"
						stroke-width="1.5"
						fill="none"
					/>
				</svg>
				Clear Recording
			</button>
		</div>
	{/if}
</div>

<style>
	.audio-recorder {
		margin-top: 1.25rem;
		padding: 2rem;
		background: linear-gradient(135deg, rgba(156, 175, 136, 0.1) 0%, rgba(245, 241, 235, 0.8) 100%);
		backdrop-filter: blur(15px);
		border: 1px solid var(--sage);
		box-shadow:
			0 8px 32px rgba(139, 111, 71, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
		border-radius: 1.5rem;
		position: relative;
		animation: fadeInScale 0.4s ease-out;
	}

	@keyframes fadeInScale {
		from {
			opacity: 0;
			transform: scale(0.98);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	.recorder-decoration {
		position: absolute;
		top: -15px;
		right: -15px;
		opacity: 0.6;
		z-index: 0;
	}

	.error-message {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 1.25rem;
		background: linear-gradient(135deg, rgba(192, 120, 96, 0.1) 0%, rgba(245, 241, 235, 0.8) 100%);
		backdrop-filter: blur(10px);
		border: 1px solid #c07860;
		margin-bottom: 1.25rem;
		font-weight: 500;
		color: var(--text-primary);
		border-radius: 1rem;
		box-shadow:
			0 4px 15px rgba(192, 120, 96, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.6);
		line-height: 1.4;
		letter-spacing: 0.01em;
	}

	.error-icon {
		flex-shrink: 0;
	}

	.record-button,
	.stop-button,
	.clear-button {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 1.75rem;
		background: linear-gradient(135deg, var(--mocha-mousse), var(--clay));
		color: var(--cream);
		border: 1px solid var(--earth-dark);
		box-shadow:
			0 4px 15px rgba(139, 111, 71, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.2);
		font-size: 1rem;
		font-weight: 500;
		letter-spacing: 0.02em;
		cursor: pointer;
		transition: all 0.3s ease;
		border-radius: 1.5rem;
		font-family: 'Space Grotesk', 'Georgia', serif;
		position: relative;
		z-index: 1;
	}

	.record-button {
		background: linear-gradient(135deg, var(--sage), #7eb069);
	}

	.stop-button {
		background: linear-gradient(135deg, #c07860, #a86550);
	}

	.clear-button {
		background: linear-gradient(135deg, var(--stone), #9a8e7e);
		margin-top: 1rem;
	}

	.record-button:hover:not(:disabled),
	.stop-button:hover:not(:disabled),
	.clear-button:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow:
			0 6px 20px rgba(139, 111, 71, 0.3),
			inset 0 1px 0 rgba(255, 255, 255, 0.3);
	}

	.record-button:disabled,
	.stop-button:disabled,
	.clear-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
		box-shadow:
			0 2px 8px rgba(139, 111, 71, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.1);
	}

	.button-icon {
		filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
	}

	.recording-status {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		position: relative;
		z-index: 1;
	}

	.recording-indicator {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.25rem 1.5rem;
		background: rgba(245, 241, 235, 0.9);
		backdrop-filter: blur(10px);
		border: 1px solid var(--earth-medium);
		font-weight: 600;
		font-size: 1.1rem;
		border-radius: 1.25rem;
		box-shadow:
			0 4px 15px rgba(139, 111, 71, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
		color: var(--text-primary);
		letter-spacing: 0.02em;
	}

	.recording-dot {
		filter: drop-shadow(0 2px 4px rgba(192, 120, 96, 0.3));
	}

	.recording-text {
		flex: 1;
	}

	.recorded-audio {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		position: relative;
		z-index: 1;
	}

	.audio-player {
		background: rgba(245, 241, 235, 0.9);
		backdrop-filter: blur(10px);
		padding: 1.25rem;
		border: 1px solid var(--earth-medium);
		border-radius: 1.25rem;
		box-shadow:
			0 4px 15px rgba(139, 111, 71, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
	}

	.audio-player audio {
		width: 100%;
		outline: none;
		border-radius: 0.5rem;
	}

	.audio-info {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.audio-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 1.05rem;
		letter-spacing: 0.02em;
	}

	.audio-icon {
		color: var(--mocha-mousse);
		opacity: 0.8;
	}

	.audio-info strong {
		color: var(--text-primary);
		font-weight: 600;
	}

	.audio-info small {
		color: var(--text-secondary);
		font-weight: 400;
		font-size: 0.9rem;
		margin-left: 1.5rem;
		letter-spacing: 0.01em;
	}

	@media (max-width: 600px) {
		.audio-recorder {
			padding: 1.5rem;
		}

		.record-button,
		.stop-button,
		.clear-button {
			width: 100%;
			justify-content: center;
			padding: 0.875rem 1.5rem;
		}

		.recording-indicator {
			padding: 1rem;
			font-size: 1rem;
		}

		.audio-player {
			padding: 1rem;
		}

		.recorder-decoration {
			display: none;
		}
	}
</style>
