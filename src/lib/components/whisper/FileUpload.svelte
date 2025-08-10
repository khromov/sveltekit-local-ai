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
		<!-- Nature decoration -->
		<svg
			class="upload-decoration"
			width="100%"
			height="100%"
			style="position: absolute; top: 0; left: 0; opacity: 0.05; pointer-events: none;"
		>
			<pattern id="upload-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
				<circle
					cx="20"
					cy="20"
					r="15"
					fill="none"
					stroke="currentColor"
					stroke-width="1"
					stroke-dasharray="2 3"
					opacity="0.3"
				/>
				<circle
					cx="60"
					cy="60"
					r="10"
					fill="none"
					stroke="currentColor"
					stroke-width="1"
					stroke-dasharray="1 2"
					opacity="0.3"
				/>
				<path d="M40,30 Q35,35 35,40 Q40,40 45,35 Q40,35 40,30" fill="currentColor" opacity="0.2" />
			</pattern>
			<rect width="100%" height="100%" fill="url(#upload-pattern)" />
		</svg>

		<div class="upload-content">
			<svg class="upload-icon" viewBox="0 0 48 48" width="48" height="48" fill="none">
				<circle
					cx="24"
					cy="24"
					r="20"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-dasharray="2 3"
					opacity="0.3"
				/>
				<path d="M24 32V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
				<path
					d="M16 24L24 16L32 24"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path d="M32 32H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
				<!-- Decorative elements -->
				<circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.2" />
				<circle cx="36" cy="12" r="2" fill="currentColor" opacity="0.2" />
			</svg>

			<p class="upload-text">
				{#if selectedFile}
					<svg
						width="16"
						height="16"
						viewBox="0 0 16 16"
						fill="none"
						style="display: inline-block; vertical-align: middle; margin-right: 4px;"
					>
						<circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" />
						<path
							d="M5 8L7 10L11 6"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
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
		margin-top: 1rem;
	}

	.file-upload input[type='file'] {
		display: none;
	}

	.file-upload-label {
		display: block;
		position: relative;
		min-height: 140px;
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.8) 0%,
			rgba(250, 248, 243, 0.85) 100%
		);
		border: 2px dashed rgba(139, 111, 71, 0.25);
		cursor: pointer;
		transition: all 0.3s ease;
		overflow: hidden;
		border-radius: 16px;
		backdrop-filter: blur(5px);
	}

	.file-upload-label:hover:not(.disabled) {
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.95) 0%,
			rgba(250, 248, 243, 0.98) 100%
		);
		border-color: rgba(46, 90, 61, 0.3);
		transform: translateY(-2px);
		box-shadow: 0 4px 20px rgba(46, 90, 61, 0.08);
	}

	.file-upload-label.has-file {
		background: linear-gradient(
			135deg,
			rgba(136, 179, 120, 0.1) 0%,
			rgba(168, 185, 159, 0.08) 100%
		);
		border-style: solid;
		border-color: rgba(46, 90, 61, 0.2);
	}

	.file-upload-label.disabled {
		cursor: not-allowed;
		opacity: 0.6;
		background: rgba(240, 240, 240, 0.5);
	}

	.file-upload-label.dragging {
		background: linear-gradient(
			135deg,
			rgba(136, 179, 120, 0.15) 0%,
			rgba(168, 185, 159, 0.12) 100%
		);
		border-style: solid;
		border-color: var(--forest-primary);
		transform: scale(1.02);
		box-shadow: 0 6px 24px rgba(46, 90, 61, 0.12);
	}

	.upload-decoration {
		color: var(--forest-primary);
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
		color: var(--forest-primary);
		margin-bottom: 1rem;
		opacity: 0.7;
		transition: all 0.3s ease;
	}

	.file-upload-label:hover .upload-icon {
		opacity: 1;
		transform: translateY(-3px);
	}

	.file-upload-label.dragging .upload-icon {
		animation: pulse 1s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.1);
		}
	}

	.upload-text {
		font-size: 1rem;
		color: var(--text-primary);
		margin: 0 0 0.5rem 0;
		text-align: center;
		font-weight: 600;
		letter-spacing: 0.01em;
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.upload-hint {
		font-size: 0.875rem;
		color: var(--text-secondary);
		margin: 0;
		text-align: center;
		font-weight: 400;
		padding: 0.375rem 0.875rem;
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(250, 248, 243, 0.9) 100%);
		border: 1px solid rgba(139, 111, 71, 0.15);
		border-radius: 8px;
		letter-spacing: 0.02em;
	}

	.file-upload-label.has-file .upload-hint {
		background: linear-gradient(
			135deg,
			rgba(136, 179, 120, 0.1) 0%,
			rgba(168, 185, 159, 0.08) 100%
		);
		border-color: rgba(46, 90, 61, 0.15);
	}

	@media (max-width: 600px) {
		.upload-content {
			padding: 1.5rem;
			min-height: 120px;
		}

		.upload-text {
			font-size: 0.9375rem;
		}

		.upload-hint {
			font-size: 0.8125rem;
			padding: 0.25rem 0.625rem;
		}
	}
</style>
