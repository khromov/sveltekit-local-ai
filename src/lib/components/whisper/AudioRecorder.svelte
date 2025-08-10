<script lang="ts">
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
		onModeChange, // eslint-disable-line @typescript-eslint/no-unused-vars
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
			<span class="error-icon">⚠️</span>
			{recordingError}
		</div>
	{/if}

	{#if !isRecording && !audioUrl}
		<button class="record-button" onclick={startRecording} {disabled}>
			<span class="button-icon">🎙️</span>
			Start Recording
		</button>
	{:else if isRecording}
		<div class="recording-status">
			<div class="recording-indicator">
				<span class="recording-dot"></span>
				Recording... {formatTime(recordingTime)}
			</div>
			<button class="stop-button" onclick={stopRecording}>
				<span class="button-icon">⏹️</span>
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
				<span class="button-icon">🗑️</span>
				Clear Recording
			</button>
		</div>
	{/if}
</div>

<style>
	.audio-recorder {
		margin-top: 1rem;
		padding: 1.5rem;
		background: rgba(245, 242, 236, 0.9);
		border: 1px solid rgba(74, 124, 89, 0.2);
		box-shadow:
			0 8px 20px rgba(45, 93, 58, 0.08),
			inset 0 1px 0 rgba(255, 255, 255, 0.7);
		border-radius: 16px;
		backdrop-filter: blur(5px);
	}

	.error-message {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem;
		background: rgba(139, 90, 60, 0.1);
		border: 1px solid rgba(139, 90, 60, 0.3);
		margin-bottom: 1rem;
		font-weight: 500;
		color: #8b5a3c;
		border-radius: 12px;
		backdrop-filter: blur(3px);
	}

	.error-icon {
		font-size: 1.25rem;
	}

	.record-button,
	.stop-button,
	.clear-button {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.875rem 1.75rem;
		background: rgba(250, 248, 245, 0.9);
		border: 1px solid rgba(74, 124, 89, 0.2);
		box-shadow:
			0 4px 12px rgba(58, 110, 74, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.6);
		font-size: 1rem;
		font-weight: 600;
		letter-spacing: 0.3px;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		border-radius: 14px;
		font-family: 'Caveat', cursive;
		backdrop-filter: blur(5px);
		color: #4a7c59;
	}

	.record-button {
		background: linear-gradient(135deg, rgba(90, 140, 105, 0.9) 0%, rgba(74, 124, 89, 0.85) 100%);
		color: #faf8f5;
	}

	.stop-button {
		background: linear-gradient(135deg, rgba(139, 90, 60, 0.9) 0%, rgba(107, 76, 58, 0.85) 100%);
		color: #faf8f5;
	}

	.clear-button {
		background: linear-gradient(135deg, rgba(166, 124, 90, 0.9) 0%, rgba(139, 90, 60, 0.85) 100%);
		color: #faf8f5;
		margin-top: 1rem;
	}

	.record-button:hover:not(:disabled),
	.stop-button:hover:not(:disabled),
	.clear-button:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow:
			0 6px 16px rgba(58, 110, 74, 0.15),
			inset 0 2px 0 rgba(255, 255, 255, 0.3);
	}

	.record-button:disabled,
	.stop-button:disabled,
	.clear-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.button-icon {
		font-size: 1.25rem;
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
		background: #fff;
		border: 2px solid #000;
		font-weight: 700;
		font-size: 1.125rem;
	}

	.recording-dot {
		width: 12px;
		height: 12px;
		background: #ff0000;
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
		background: #fff;
		padding: 1rem;
		border: 2px solid #000;
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
		color: #666;
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
