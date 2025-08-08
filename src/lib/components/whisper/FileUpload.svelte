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

<div class="file-upload">
	<input
		bind:this={fileInputElement}
		type="file"
		accept="audio/*"
		onchange={handleFileSelect}
		id="audio-file"
		{disabled}
	/>
	<div
		class="file-upload-label"
		class:disabled
		class:dragging={isDragging}
		ondragover={handleDragOver}
		ondragleave={handleDragLeave}
		ondrop={handleDrop}
		onclick={openFileDialog}
		onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && openFileDialog()}
		role="button"
		tabindex="0"
	>
		<div class="upload-content">
			<svg
				class="upload-icon"
				viewBox="0 0 24 24"
				width="32"
				height="32"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
				<polyline points="7,10 12,15 17,10"></polyline>
				<line x1="12" y1="15" x2="12" y2="3"></line>
			</svg>
			<p class="upload-text">
				{selectedFile ? selectedFile.name : 'Choose audio file or drag and drop here'}
			</p>
			<p class="upload-hint">Supports MP3, WAV, M4A and other audio formats</p>
		</div>
	</div>
</div>

<style>
	.file-upload {
		margin-top: 0.5rem;
	}

	.file-upload input[type='file'] {
		display: none;
	}

	.file-upload-label {
		display: block;
		position: relative;
		min-height: 120px;
		background-color: #f8f8f8;
		border: 2px dashed #ccc;
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.2s ease;
		overflow: hidden;
	}

	.file-upload-label:hover:not(.disabled) {
		border-color: #0071e3;
		background-color: #f0f4ff;
	}

	.file-upload-label.disabled {
		cursor: not-allowed;
		opacity: 0.6;
	}

	.file-upload-label.dragging {
		border-color: #0071e3;
		background-color: #f0f4ff;
		border-style: solid;
	}

	.upload-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
		height: 100%;
		min-height: 120px;
	}

	.upload-icon {
		color: #0071e3;
		margin-bottom: 0.75rem;
	}

	.upload-text {
		font-size: 1rem;
		color: #333;
		margin: 0 0 0.25rem 0;
		text-align: center;
		font-weight: 500;
	}

	.upload-hint {
		font-size: 0.875rem;
		color: #666;
		margin: 0;
		text-align: center;
	}

	@media (max-width: 600px) {
		.upload-content {
			padding: 1rem;
			min-height: 100px;
		}
	}
</style>
