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
		<div class="upload-decoration">
			<svg viewBox="0 0 80 80" width="80" height="80">
				<path
					d="M20,40 Q40,20 60,40 Q40,60 20,40"
					fill="none"
					stroke="var(--clay)"
					stroke-width="2"
					opacity="0.3"
				/>
				<circle cx="30" cy="30" r="2" fill="var(--sage)" opacity="0.5" />
				<circle cx="50" cy="50" r="1.5" fill="var(--earth-dark)" opacity="0.6" />
			</svg>
		</div>
		<div class="upload-content">
			<svg
				class="upload-icon"
				viewBox="0 0 24 24"
				width="40"
				height="40"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
			>
				<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
				<polyline points="7,10 12,15 17,10"></polyline>
				<line x1="12" y1="15" x2="12" y2="3"></line>
			</svg>
			<p class="upload-text">
				{#if selectedFile}
					<svg viewBox="0 0 16 16" width="16" height="16" class="file-icon">
						<rect
							x="3"
							y="2"
							width="10"
							height="12"
							rx="2"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
						/>
						<path
							d="M6,6 L10,6 M6,8 L10,8 M6,10 L8,10"
							stroke="currentColor"
							stroke-width="1"
							opacity="0.7"
						/>
					</svg>
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
		margin-top: 1.25rem;
	}

	.file-upload input[type='file'] {
		display: none;
	}

	.file-upload-label {
		display: block;
		position: relative;
		min-height: 140px;
		background: rgba(245, 241, 235, 0.6);
		backdrop-filter: blur(10px);
		border: 2px dashed var(--earth-medium);
		cursor: pointer;
		transition: all 0.3s ease;
		overflow: hidden;
		border-radius: 1.5rem;
		box-shadow:
			0 4px 15px rgba(139, 111, 71, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.6);
	}

	.file-upload-label:hover:not(.disabled) {
		transform: translateY(-2px);
		box-shadow:
			0 6px 20px rgba(139, 111, 71, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
		background: rgba(245, 241, 235, 0.8);
		border-color: var(--mocha-mousse);
	}

	.file-upload-label.has-file {
		background: linear-gradient(135deg, rgba(156, 175, 136, 0.2) 0%, rgba(245, 241, 235, 0.8) 100%);
		border-style: solid;
		border-color: var(--sage);
	}

	.file-upload-label.disabled {
		cursor: not-allowed;
		opacity: 0.6;
		background: rgba(168, 160, 144, 0.3);
	}

	.file-upload-label.dragging {
		background: linear-gradient(135deg, rgba(193, 154, 107, 0.2) 0%, rgba(245, 241, 235, 0.9) 100%);
		border-style: solid;
		border-color: var(--clay);
		transform: translateY(-3px);
		box-shadow:
			0 8px 25px rgba(139, 111, 71, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
	}

	.upload-decoration {
		position: absolute;
		top: -15px;
		right: -15px;
		opacity: 0.6;
		z-index: 0;
		animation: gentleFloat 8s ease-in-out infinite;
	}

	@keyframes gentleFloat {
		0%,
		100% {
			transform: translateY(0) rotate(0deg);
		}
		50% {
			transform: translateY(-8px) rotate(10deg);
		}
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
		color: var(--text-primary);
		margin-bottom: 1rem;
		animation: gentleBounce 3s ease-in-out infinite;
		opacity: 0.8;
	}

	@keyframes gentleBounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-5px);
		}
	}

	.upload-text {
		font-size: 1rem;
		color: var(--text-primary);
		margin: 0 0 0.75rem 0;
		text-align: center;
		font-weight: 600;
		letter-spacing: 0.02em;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		line-height: 1.4;
	}

	.file-icon {
		color: var(--mocha-mousse);
		opacity: 0.8;
		flex-shrink: 0;
	}

	.upload-hint {
		font-size: 0.9rem;
		color: var(--text-secondary);
		margin: 0;
		text-align: center;
		font-weight: 400;
		background: rgba(245, 241, 235, 0.8);
		backdrop-filter: blur(5px);
		padding: 0.5rem 1rem;
		border: 1px solid var(--earth-medium);
		border-radius: 1rem;
		box-shadow:
			0 2px 8px rgba(139, 111, 71, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.6);
		letter-spacing: 0.01em;
		line-height: 1.3;
	}

	.file-upload-label.has-file .upload-hint {
		background: rgba(156, 175, 136, 0.2);
		border-color: var(--sage);
	}

	.file-upload-label.dragging .upload-hint {
		background: rgba(193, 154, 107, 0.2);
		border-color: var(--clay);
	}

	@media (max-width: 600px) {
		.upload-content {
			padding: 1.5rem;
			min-height: 120px;
		}

		.upload-text {
			font-size: 0.95rem;
			flex-direction: column;
			gap: 0.5rem;
		}

		.upload-hint {
			font-size: 0.85rem;
		}

		.upload-decoration {
			display: none;
		}
	}
</style>
