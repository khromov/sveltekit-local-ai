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
			role="button"
			tabindex="0"
		>
			<span class="upload-icon"><UploadIcon /></span>
			<p><strong>Drag & Drop Audio File</strong></p>
			<p class="upload-hint">or</p>
			<button onclick={() => fileInput?.click()} {disabled} class="browse-button">
				Browse Files
			</button>
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
		border: 3px dashed #000;
		padding: 2rem;
		text-align: center;
		background: linear-gradient(135deg, rgba(255, 229, 180, 0.1) 0%, rgba(230, 230, 250, 0.1) 100%);
		cursor: pointer;
		transition: all 0.3s;
		position: relative;
		transform: rotate(-0.5deg);
	}

	.upload-area.drag-over {
		background: #fff9e6;
		border-color: var(--color-primary);
		transform: rotate(0deg) scale(1.02);
		box-shadow: 5px 5px 0 #000;
	}

	.upload-icon {
		font-size: 3rem;
		display: block;
		margin-bottom: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #000;
	}

	.upload-icon :global(svg) {
		width: 3rem;
		height: 3rem;
	}

	.upload-area p {
		margin: 0.5rem 0;
		font-weight: 500;
	}

	.upload-hint {
		color: #666;
		font-size: 0.875rem;
	}

	.browse-button {
		margin-top: 1rem;
		padding: 0.75rem 1.5rem;
		background: #98fb98;
		border: 3px solid #000;
		box-shadow: 4px 4px 0 #000;
		font-size: 1rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 1px;
		cursor: pointer;
		transition: all 0.15s;
	}

	.browse-button:hover:not(:disabled) {
		transform: translate(-2px, -2px);
		box-shadow: 6px 6px 0 #000;
		background: #ffd93d;
	}

	.browse-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.file-selected {
		background: #f0f8ff;
		border: 3px solid #000;
		box-shadow: 5px 5px 0 #000;
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
		color: #000;
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
		letter-spacing: 0.5px;
	}

	.file-details small {
		color: #666;
		font-weight: 500;
	}

	.clear-button {
		padding: 0.5rem;
		background: #ff6b6b;
		border: 2px solid #000;
		box-shadow: 3px 3px 0 #000;
		cursor: pointer;
		transition: all 0.15s;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		color: #000;
	}

	.clear-button :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}

	.clear-button:hover:not(:disabled) {
		transform: translate(-2px, -2px);
		box-shadow: 5px 5px 0 #000;
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
