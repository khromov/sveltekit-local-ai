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
		background: #fff;
		border: 4px dashed #000;
		cursor: pointer;
		transition: all 0.15s ease;
		overflow: hidden;
		transform: rotate(-0.5deg);
		box-shadow: 5px 5px 0 #000;
	}

	.file-upload-label:hover:not(.disabled) {
		transform: translate(-2px, -2px) rotate(0deg);
		box-shadow: 7px 7px 0 #000;
		background: #fffacd;
	}

	.file-upload-label.has-file {
		background: #98fb98;
		border-style: solid;
	}

	.file-upload-label.disabled {
		cursor: not-allowed;
		opacity: 0.6;
		background: #e0e0e0;
	}

	.file-upload-label.dragging {
		background: #ffd93d;
		border-style: solid;
		border-color: #000;
		transform: translate(-3px, -3px) rotate(0deg);
		box-shadow: 8px 8px 0 #000;
	}

	.upload-decoration {
		position: absolute;
		top: 10px;
		right: 10px;
		width: 60px;
		height: 60px;
		background: #ff69b4;
		border: 3px solid #000;
		border-radius: 30% 70% 70% 30% / 60% 40% 60% 40%;
		opacity: 0.3;
		transform: rotate(45deg);
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
		color: #000;
		margin-bottom: 1rem;
		animation: float 3s ease-in-out infinite;
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	.upload-text {
		font-size: 1.125rem;
		color: #000;
		margin: 0 0 0.5rem 0;
		text-align: center;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 1px;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.file-icon {
		font-size: 1.25rem;
	}

	.upload-hint {
		font-size: 0.9375rem;
		color: #333;
		margin: 0;
		text-align: center;
		font-weight: 600;
		background: #ffd93d;
		padding: 4px 12px;
		border: 2px solid #000;
		box-shadow: 3px 3px 0 #000;
	}

	.file-upload-label.has-file .upload-hint {
		background: #fff;
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
