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
		class:has-file={selectedFile}
		ondragover={handleDragOver}
		ondragleave={handleDragLeave}
		ondrop={handleDrop}
		onclick={openFileDialog}
		onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && openFileDialog()}
		role="button"
		tabindex="0"
	>
		<div class="upload-decoration"></div>
		<div class="upload-content">
			<svg
				class="upload-icon"
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
			<p class="upload-text">
				{#if selectedFile}
					<span class="file-icon">📎</span>
					{selectedFile.name}
				{:else}
					Drop your audio file here
				{/if}
			</p>
			<p class="upload-hint">
				{#if selectedFile}
					Click to change file
				{:else}
					or click to browse • MP3, WAV, M4A supported
				{/if}
			</p>
		</div>
	</div>
</div>

<style>
	.file-upload {
		margin-top: 1rem;
	}

	.file-upload input[type='file'] {
		display: none;
	}

	.file-upload-label {
		display: block;
		position: relative;
		min-height: 140px;
		background: rgba(255, 255, 255, 0.9);
		border: 2px dashed rgba(82, 121, 82, 0.3);
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		overflow: hidden;
		box-shadow: 0 4px 16px rgba(82, 121, 82, 0.08);
		border-radius: 16px;
		backdrop-filter: blur(8px);
	}

	.file-upload-label:hover:not(.disabled) {
		transform: translateY(-3px);
		box-shadow: 0 8px 32px rgba(82, 121, 82, 0.15);
		background: rgba(255, 255, 255, 1);
		border-color: rgba(82, 121, 82, 0.4);
	}

	.file-upload-label.has-file {
		background: rgba(82, 121, 82, 0.1);
		border-style: solid;
		border-color: rgba(82, 121, 82, 0.4);
	}

	.file-upload-label.disabled {
		cursor: not-allowed;
		opacity: 0.6;
		background: rgba(240, 240, 240, 0.8);
		filter: grayscale(30%);
	}

	.file-upload-label.dragging {
		background: rgba(82, 121, 82, 0.15);
		border-style: solid;
		border-color: rgba(82, 121, 82, 0.5);
		transform: translateY(-5px);
		box-shadow: 0 12px 48px rgba(82, 121, 82, 0.2);
	}

	.upload-decoration {
		position: absolute;
		top: 15px;
		right: 15px;
		width: 50px;
		height: 50px;
		background: radial-gradient(circle, rgba(82, 121, 82, 0.15) 0%, rgba(107, 142, 107, 0.08) 100%);
		border: 1px solid rgba(82, 121, 82, 0.2);
		border-radius: 50%;
		opacity: 0.6;
	}

	.upload-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		height: 100%;
		min-height: 140px;
		position: relative;
		z-index: 1;
	}

	.upload-icon {
		color: #527952;
		margin-bottom: 1.25rem;
		animation: gentle-float 4s ease-in-out infinite;
		filter: drop-shadow(0 2px 8px rgba(82, 121, 82, 0.2));
	}

	@keyframes gentle-float {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-8px);
		}
	}

	.upload-text {
		font-size: 1.125rem;
		color: #2e4a2e;
		margin: 0 0 0.75rem 0;
		text-align: center;
		font-weight: 600;
		text-transform: none;
		letter-spacing: 0.01em;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		justify-content: center;
	}

	.file-icon {
		font-size: 1.25rem;
		filter: drop-shadow(0 1px 3px rgba(82, 121, 82, 0.3));
	}

	.upload-hint {
		font-size: 0.9rem;
		color: rgba(82, 121, 82, 0.7);
		margin: 0;
		text-align: center;
		font-weight: 400;
		background: rgba(82, 121, 82, 0.08);
		padding: 0.5rem 1rem;
		border: 1px solid rgba(82, 121, 82, 0.2);
		box-shadow: 0 2px 8px rgba(82, 121, 82, 0.1);
		border-radius: 12px;
		backdrop-filter: blur(4px);
	}

	.file-upload-label.has-file .upload-hint {
		background: rgba(255, 255, 255, 0.9);
		border-color: rgba(82, 121, 82, 0.15);
	}

	@media (max-width: 600px) {
		.upload-content {
			padding: 1.5rem;
			min-height: 120px;
		}

		.upload-text {
			font-size: 1rem;
		}

		.upload-hint {
			font-size: 0.875rem;
		}
	}
</style>
