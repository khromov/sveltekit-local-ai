<script lang="ts">
	import FileAudioIcon from 'virtual:icons/lucide/file-audio';
	import UploadIcon from 'virtual:icons/lucide/upload';
	import XIcon from 'virtual:icons/lucide/x';

	interface Props {
		selectedFile: File | null;
		onFileSelect: (file: File) => void;
		disabled?: boolean;
	}

	let { selectedFile = $bindable(), onFileSelect, disabled = false }: Props = $props();

	let fileInput: HTMLInputElement | undefined = $state();
	let dragOver = $state(false);

	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			selectedFile = input.files[0];
			onFileSelect(input.files[0]);
		}
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		dragOver = false;
		if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
			selectedFile = event.dataTransfer.files[0];
			onFileSelect(event.dataTransfer.files[0]);
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		dragOver = true;
	}

	function handleDragLeave() {
		dragOver = false;
	}

	function clearFile() {
		selectedFile = null;
		if (fileInput) {
			fileInput.value = '';
		}
	}
</script>

<div class="file-upload">
	{#if selectedFile}
		<div class="file-selected">
			<div class="file-info">
				<span class="file-icon"><FileAudioIcon /></span>
				<div class="file-details">
					<strong>{selectedFile.name}</strong>
					<small>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</small>
				</div>
			</div>
			<button class="clear-button" onclick={clearFile} {disabled}>
				<XIcon />
			</button>
		</div>
	{:else}
		<div
			class="upload-area"
			class:drag-over={dragOver}
			ondrop={handleDrop}
			ondragover={handleDragOver}
			ondragleave={handleDragLeave}
			onclick={() => fileInput?.click()}
			onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && fileInput?.click()}
			role="button"
			tabindex="0"
		>
			<div class="upload-content">
				<span class="upload-icon"><UploadIcon /></span>
				<p>Drop your audio file here</p>
				<p class="upload-hint">or click to browse • MP3, WAV, M4A supported</p>
			</div>
			<input
				bind:this={fileInput}
				type="file"
				accept="audio/*,.mp3,.wav,.m4a,.ogg,.webm"
				onchange={handleFileSelect}
				style="display: none;"
			/>
		</div>
	{/if}
</div>

<style>
	.file-upload {
		margin-top: 1rem;
	}

	.upload-area {
		border: 4px dashed var(--color-text-primary);
		padding: 2rem;
		text-align: center;
		background: var(--color-background-main);
		cursor: pointer;
		transition: all 0.15s ease;
		position: relative;
		transform: rotate(-0.5deg);
		box-shadow: 5px 5px 0 var(--color-text-primary);
		min-height: 180px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.upload-area.drag-over {
		background: var(--color-primary-dark);
		border-style: solid;
		border-color: var(--color-text-primary);
		transform: translate(-3px, -3px) rotate(0deg);
		box-shadow: 8px 8px 0 var(--color-text-primary);
	}

	.upload-area:hover:not(.drag-over) {
		transform: translate(-2px, -2px) rotate(0deg);
		box-shadow: 7px 7px 0 var(--color-text-primary);
		background: var(--color-background-cream);
	}

	.upload-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		height: 100%;
		min-height: 180px;
		position: relative;
		z-index: 1;
	}

	.upload-icon {
		font-size: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 1rem;
		color: var(--color-text-primary);
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

	.upload-icon :global(svg) {
		width: 48px;
		height: 48px;
	}

	.upload-area p {
		margin: 0.5rem 0;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 1px;
		color: var(--color-text-primary);
		text-align: center;
	}

	.upload-hint {
		color: var(--color-text-secondary);
		font-size: 0.9375rem;
		font-weight: 600;
		background: var(--color-primary-dark);
		padding: 4px 12px;
		border: var(--border-brutalist-thin);
		box-shadow: var(--shadow-brutalist-small);
		display: inline-block;
		margin-top: 0.5rem;
	}

	.file-selected {
		background: var(--color-background-light-blue);
		border: var(--border-brutalist-thick);
		box-shadow: 5px 5px 0 var(--color-text-primary);
		padding: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		transform: rotate(0.5deg);
		animation: slideIn 0.3s ease-out;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(10px) rotate(0.5deg);
		}
		to {
			opacity: 1;
			transform: translateY(0) rotate(0.5deg);
		}
	}

	.file-info {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.file-icon {
		font-size: 2rem;
		display: flex;
		align-items: center;
		color: var(--color-text-primary);
	}

	.file-icon :global(svg) {
		width: 2rem;
		height: 2rem;
	}

	.file-details {
		display: flex;
		flex-direction: column;
	}

	.file-details strong {
		font-size: 1.125rem;
		text-transform: uppercase;
		letter-spacing: 1px;
		font-weight: 700;
	}

	.file-details small {
		color: var(--color-text-tertiary);
		font-weight: 500;
	}

	.clear-button {
		padding: 0.5rem;
		background: var(--color-danger);
		border: var(--border-brutalist-thin);
		box-shadow: var(--shadow-brutalist-small);
		cursor: pointer;
		transition: all 0.15s;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		color: var(--color-text-primary);
	}

	.clear-button :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}

	.clear-button:hover:not(:disabled) {
		transform: translate(-2px, -2px);
		box-shadow: 5px 5px 0 var(--color-text-primary);
	}

	.clear-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	@media (max-width: 600px) {
		.upload-area {
			padding: 1.5rem;
		}

		.upload-icon {
			font-size: 2.5rem;
		}

		.upload-icon :global(svg) {
			width: 2.5rem;
			height: 2.5rem;
		}

		.file-selected {
			flex-direction: column;
			gap: 1rem;
			align-items: stretch;
		}

		.clear-button {
			width: 100%;
			padding: 0.75rem;
		}
	}
</style>
