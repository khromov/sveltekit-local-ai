<script lang="ts">
	interface Props {
		selectedFile: File | null;
		onFileSelect: (file: File) => void;
		disabled?: boolean;
	}

	let { selectedFile = $bindable(), onFileSelect, disabled = false }: Props = $props();

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

				// Convert blob to File
				const fileName = `recording-${Date.now()}.webm`;
				const audioFile = new File([audioBlob], fileName, { type: 'audio/webm' });

				selectedFile = audioFile;
				onFileSelect(audioFile);

				// Stop all tracks
				stream.getTracks().forEach((track) => track.stop());
			};

			mediaRecorder.start();
			isRecording = true;
			recordingTime = 0;

			// Start timer
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
			// Cleanup on unmount
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

<div class="mt-4 -rotate-[0.5deg] border-[3px] border-black bg-[#f0f8ff] p-6 shadow-neo-lg">
	{#if recordingError}
		<div
			class="mb-4 flex items-center gap-2 border-2 border-neo-red bg-[#ffe4e1] p-4 font-medium text-[#d62828]"
		>
			<span class="text-xl">⚠️</span>
			{recordingError}
		</div>
	{/if}

	{#if !isRecording && !audioUrl}
		<button
			class="inline-flex cursor-pointer items-center gap-2 border-[3px] border-black bg-neo-green px-6 py-3 text-base font-bold tracking-wider uppercase shadow-neo-md transition-all duration-150 hover:enabled:-translate-x-0.5 hover:enabled:-translate-y-0.5 hover:enabled:shadow-neo-xl disabled:cursor-not-allowed disabled:opacity-50"
			onclick={startRecording}
			{disabled}
		>
			<span class="text-xl">🎙️</span>
			Start Recording
		</button>
	{:else if isRecording}
		<div class="flex flex-col gap-4">
			<div
				class="flex items-center gap-3 border-2 border-black bg-white p-4 text-[1.125rem] font-bold"
			>
				<span class="h-3 w-3 animate-pulse rounded-full bg-red-600"></span>
				Recording... {formatTime(recordingTime)}
			</div>
			<button
				class="inline-flex cursor-pointer items-center gap-2 border-[3px] border-black bg-neo-red px-6 py-3 text-base font-bold tracking-wider text-white uppercase shadow-neo-md transition-all duration-150 hover:enabled:-translate-x-0.5 hover:enabled:-translate-y-0.5 hover:enabled:shadow-neo-xl disabled:cursor-not-allowed disabled:opacity-50"
				onclick={stopRecording}
			>
				<span class="text-xl">⏹️</span>
				Stop Recording
			</button>
		</div>
	{:else if audioUrl}
		<div class="flex flex-col gap-4">
			<div class="border-2 border-black bg-white p-4">
				<audio controls src={audioUrl} class="w-full outline-none"></audio>
			</div>
			<div class="flex flex-col gap-1">
				<strong class="text-[1.125rem] tracking-wider uppercase">Recording Complete</strong>
				<small class="font-medium text-gray-600"
					>{formatTime(recordingTime)} • {selectedFile?.name}</small
				>
			</div>
			<button
				class="mt-4 inline-flex cursor-pointer items-center gap-2 border-[3px] border-black bg-neo-yellow px-6 py-3 text-base font-bold tracking-wider uppercase shadow-neo-md transition-all duration-150 hover:enabled:-translate-x-0.5 hover:enabled:-translate-y-0.5 hover:enabled:shadow-neo-xl disabled:cursor-not-allowed disabled:opacity-50"
				onclick={clearRecording}
				{disabled}
			>
				<span class="text-xl">🗑️</span>
				Clear Recording
			</button>
		</div>
	{/if}
</div>
