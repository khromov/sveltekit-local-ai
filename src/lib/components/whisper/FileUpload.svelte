<script lang="ts">
	interface Props {
		selectedFile: File | null;
		onFileSelect: (file: File) => void;
		disabled?: boolean;
	}

	let { selectedFile = $bindable(), onFileSelect, disabled = false }: Props = $props();

	let fileInputElement: HTMLInputElement | undefined = $state();
	let isDragging = $state(false);

	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			onFileSelect(target.files[0]);
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		if (disabled) return;
		isDragging = true;
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
		const x = event.clientX;
		const y = event.clientY;

		if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
			isDragging = false;
		}
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		isDragging = false;

		if (disabled) return;

		const files = event.dataTransfer?.files;
		if (files && files.length > 0) {
			onFileSelect(files[0]);
		}
	}

	function openFileDialog() {
		fileInputElement?.click();
	}
</script>

<div class="mt-4">
	<input
		bind:this={fileInputElement}
		type="file"
		accept="audio/*"
		onchange={handleFileSelect}
		id="audio-file"
		{disabled}
		class="hidden"
	/>
	<div
		class="relative block min-h-[140px] -rotate-[0.5deg] cursor-pointer overflow-hidden border-4 border-dashed border-black bg-white shadow-neo-lg transition-all duration-150 ease-in-out hover:enabled:-translate-x-0.5 hover:enabled:-translate-y-0.5 hover:enabled:rotate-0 hover:enabled:bg-[#fffacd] hover:enabled:shadow-neo-2xl {disabled
			? 'cursor-not-allowed bg-gray-200 opacity-60'
			: ''} {isDragging
			? '-translate-x-[3px] -translate-y-[3px] rotate-0 border-solid border-black bg-neo-yellow shadow-neo-3xl'
			: ''} {selectedFile ? 'border-solid bg-neo-green' : ''}"
		ondragover={handleDragOver}
		ondragleave={handleDragLeave}
		ondrop={handleDrop}
		onclick={openFileDialog}
		onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && openFileDialog()}
		role="button"
		tabindex="0"
	>
		<div
			class="absolute top-[10px] right-[10px] h-[60px] w-[60px] rotate-45 rounded-[30%_70%_70%_30%/60%_40%_60%_40%] border-[3px] border-black bg-neo-pink opacity-30"
		></div>
		<div class="relative z-[1] flex h-full min-h-[140px] flex-col items-center justify-center p-8">
			<svg
				class="mb-4 animate-float text-black"
				viewBox="0 0 24 24"
				width="48"
				height="48"
				fill="none"
				stroke="currentColor"
				stroke-width="3"
			>
				<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
				<polyline points="7,10 12,15 17,10"></polyline>
				<line x1="12" y1="15" x2="12" y2="3"></line>
			</svg>
			<p
				class="m-0 mb-2 flex items-center gap-2 text-center text-[1.125rem] font-bold tracking-wider text-black uppercase"
			>
				{#if selectedFile}
					<span class="text-xl">📎</span>
					{selectedFile.name}
				{:else}
					Drop your audio file here
				{/if}
			</p>
			<p
				class="m-0 border-2 border-black bg-neo-yellow px-3 py-1 text-center text-[0.9375rem] font-semibold text-gray-800 shadow-neo {selectedFile
					? 'bg-white'
					: ''}"
			>
				{#if selectedFile}
					Click to change file
				{:else}
					or click to browse • MP3, WAV, M4A supported
				{/if}
			</p>
		</div>
	</div>
</div>
