<script lang="ts">
	import FileUpload from './FileUpload.svelte';
	import AudioRecorder from './AudioRecorder.svelte';

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

	function handleModeChange(mode: 'demo' | 'upload' | 'record') {
		onModeChange(mode);
	}
</script>

<div
	class="shadow-neo-3xl relative mb-6 rotate-[0.5deg] animate-[slideIn_0.4s_ease-out] border-4 border-black bg-white p-8 [animation-delay:0.1s] [animation-fill-mode:both]"
>
	<div
		class="bg-gradient-pink absolute -top-2 -right-2 -bottom-2 -left-2 z-[-1] rounded-[5%_20%_5%_20%/20%_5%_20%_5%] opacity-30"
	></div>

	<h3
		class="font-bebas bg-neo-yellow shadow-neo-lg mx-auto mt-0 mb-6 flex w-fit rotate-1 items-center justify-center gap-3 border-[3px] border-black px-6 py-2 text-center text-[2rem] tracking-[2px] text-black uppercase"
	>
		<span class="text-[1.75rem]">🎵</span>
		Choose Audio Source
	</h3>

	<div class="mb-5 flex flex-col gap-4">
		<label
			class="shadow-neo-md hover:shadow-neo-xl relative flex -rotate-[0.5deg] cursor-pointer items-center gap-4 border-[3px] border-black bg-white p-5 transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:rotate-0 hover:bg-[#fffacd] {transcribeMode ===
			'upload'
				? 'bg-neo-green shadow-neo-2xl -translate-x-[3px] -translate-y-[3px] rotate-0'
				: ''}"
		>
			<input
				type="radio"
				name="transcribeMode"
				value="upload"
				checked={transcribeMode === 'upload'}
				onchange={() => handleModeChange('upload')}
				{disabled}
				class="m-0 h-5 w-5 cursor-pointer border-2 border-black accent-black"
			/>
			<div class="flex flex-1 flex-col gap-1.5">
				<div class="flex items-center gap-2">
					<span class="text-2xl">📁</span>
					<strong class="text-[1.125rem] tracking-wider text-black uppercase">Local File</strong>
				</div>
				<small class="ml-8 text-[0.9375rem] font-medium text-gray-800"
					>Select an audio file from your device (.mp3, .wav, .m4a)</small
				>
			</div>
		</label>

		<label
			class="shadow-neo-md hover:shadow-neo-xl relative flex rotate-[0.5deg] cursor-pointer items-center gap-4 border-[3px] border-black bg-white p-5 transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:rotate-0 hover:bg-[#fffacd] {transcribeMode ===
			'record'
				? 'bg-neo-green shadow-neo-2xl -translate-x-[3px] -translate-y-[3px] rotate-0'
				: ''}"
		>
			<input
				type="radio"
				name="transcribeMode"
				value="record"
				checked={transcribeMode === 'record'}
				onchange={() => handleModeChange('record')}
				{disabled}
				class="m-0 h-5 w-5 cursor-pointer border-2 border-black accent-black"
			/>
			<div class="flex flex-1 flex-col gap-1.5">
				<div class="flex items-center gap-2">
					<span class="text-2xl">🎙️</span>
					<strong class="text-[1.125rem] tracking-wider text-black uppercase">Record Audio</strong>
				</div>
				<small class="ml-8 text-[0.9375rem] font-medium text-gray-800"
					>Record audio directly from your microphone</small
				>
			</div>
		</label>

		<div class="relative my-2 flex items-center justify-center">
			<span
				class="relative bg-white px-4 text-[0.875rem] font-bold tracking-[2px] text-gray-600 uppercase"
				>OR</span
			>
			<div
				class="absolute top-1/2 right-0 left-0 z-[-1] h-[2px] -translate-y-1/2 bg-gray-300"
			></div>
		</div>

		<label
			class="shadow-neo-md hover:shadow-neo-xl relative flex cursor-pointer items-center gap-4 border-[3px] border-black bg-white px-4 py-3 transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:rotate-0 hover:bg-[#fffacd] {transcribeMode ===
			'demo'
				? 'bg-neo-green shadow-neo-2xl -translate-x-[3px] -translate-y-[3px] rotate-0'
				: ''}"
		>
			<input
				type="radio"
				name="transcribeMode"
				value="demo"
				checked={transcribeMode === 'demo'}
				onchange={() => handleModeChange('demo')}
				{disabled}
				class="m-0 h-5 w-5 cursor-pointer border-2 border-black accent-black"
			/>
			<div class="flex items-center gap-2">
				<strong class="text-base uppercase">Demo File</strong>
				<small>
					<a
						href="/rich.mp3"
						target="_blank"
						class="bg-neo-yellow shadow-neo-sm hover:shadow-neo hover:bg-neo-pink inline-block border-2 border-black px-1.5 py-0.5 font-bold text-black no-underline transition-all duration-150 hover:-translate-x-[1px] hover:-translate-y-[1px]"
					>
						Listen →
					</a>
				</small>
			</div>
		</label>
	</div>

	{#if transcribeMode === 'upload'}
		<FileUpload bind:selectedFile {onFileSelect} {disabled} />
	{:else if transcribeMode === 'record'}
		<AudioRecorder bind:selectedFile {onFileSelect} {disabled} />
	{/if}
</div>
