<!-- Shared File Upload Component -->
<script lang="ts">
	import FileAudioIcon from 'virtual:icons/lucide/file-audio';
	import ImageIcon from 'virtual:icons/lucide/image';
	import FileIcon from 'virtual:icons/lucide/file';
	import UploadIcon from 'virtual:icons/lucide/upload';
	import XIcon from 'virtual:icons/lucide/x';
	import Trash2Icon from 'virtual:icons/lucide/trash-2';

	interface Props {
		selectedFile?: File | null;
		selectedFiles?: File[];
		onFileSelect?: (file: File) => void;
		onFilesSelect?: (files: File[]) => void;
		onClear?: () => void;
		disabled?: boolean;
		multiple?: boolean;
		accept?: string;
		fileType?: 'audio' | 'image' | 'any';
		title?: string;
		subtitle?: string;
		maxFiles?: number;
	}

	let {
		selectedFile = $bindable(),
		selectedFiles = $bindable([]),
		onFileSelect,
		onFilesSelect,
		onClear,
		disabled = false,
		multiple = false,
		accept = '*',
		fileType = 'any',
		title = 'Drag & Drop File',
		subtitle = 'or click to browse',
		maxFiles = 10
	}: Props = $props();

	let fileInput: HTMLInputElement | undefined = $state();
	let dragOver = $state(false);

	// Get appropriate icon based on file type
	let FileTypeIcon = $derived(
		fileType === 'audio' ? FileAudioIcon : fileType === 'image' ? ImageIcon : FileIcon
	);

	// Check if we have files
	let hasFiles = $derived(
		multiple ? selectedFiles && selectedFiles.length > 0 : selectedFile !== null
	);

	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			if (multiple) {
				const filesArray = Array.from(input.files).slice(0, maxFiles);
				selectedFiles = filesArray;
				onFilesSelect?.(filesArray);
			} else {
				selectedFile = input.files[0];
				onFileSelect?.(input.files[0]);
			}
		}
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		dragOver = false;

		if (disabled) return;

		const files = event.dataTransfer?.files;
		if (files && files.length > 0) {
			if (multiple) {
				const filesArray = Array.from(files).slice(0, maxFiles);
				selectedFiles = filesArray;
				onFilesSelect?.(filesArray);
			} else {
				selectedFile = files[0];
				onFileSelect?.(files[0]);
			}
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		if (!disabled) {
			dragOver = true;
		}
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
		const x = event.clientX;
		const y = event.clientY;

		if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
			dragOver = false;
		}
	}

	function removeFile(index: number) {
		if (multiple) {
			const newFiles = selectedFiles.filter((_, i) => i !== index);
			selectedFiles = newFiles;
			onFilesSelect?.(newFiles);
		}
	}

	function clearAll() {
		if (multiple) {
			selectedFiles = [];
			onFilesSelect?.([]);
		} else {
			selectedFile = null;
		}
		onClear?.();
		if (fileInput) {
			fileInput.value = '';
		}
	}

	function formatFileSize(bytes: number): string {
		const units = ['B', 'KB', 'MB', 'GB'];
		let size = bytes;
		let unitIndex = 0;

		while (size >= 1024 && unitIndex < units.length - 1) {
			size /= 1024;
			unitIndex++;
		}

		return `${size.toFixed(1)} ${units[unitIndex]}`;
	}
</script>

<div class="file-upload-area">
	{#if hasFiles}
		<!-- File(s) Selected Display -->
		{#if multiple && selectedFiles.length > 0}
			<div class="selected-files">
				<div class="files-header">
					<h4>Selected Files ({selectedFiles.length})</h4>
					<button class="clear-all-btn" onclick={clearAll} {disabled}>
						<Trash2Icon />
						Clear All
					</button>
				</div>

				<div class="files-grid">
					{#each selectedFiles as file, index (file.name + file.size)}
						<div class="file-item">
							{#if fileType === 'image'}
								<div class="file-preview">
									<img src={URL.createObjectURL(file)} alt={file.name} />
								</div>
							{/if}
							<div class="file-info">
								<span class="file-icon"><FileTypeIcon /></span>
								<div class="file-details">
									<div class="file-name" title={file.name}>{file.name}</div>
									<div class="file-size">{formatFileSize(file.size)}</div>
								</div>
							</div>
							<button
								class="remove-file-btn"
								onclick={() => removeFile(index)}
								{disabled}
								aria-label={`Remove ${file.name}`}
							>
								<XIcon />
							</button>
						</div>
					{/each}
				</div>
			</div>
		{:else if selectedFile}
			<div class="single-file-selected">
				<div class="file-info">
					<span class="file-icon"><FileTypeIcon /></span>
					<div class="file-details">
						<strong>{selectedFile.name}</strong>
						<small>{formatFileSize(selectedFile.size)}</small>
					</div>
				</div>
				<button class="clear-button" onclick={clearAll} {disabled}>
					<XIcon />
				</button>
			</div>
		{/if}
	{:else}
		<!-- Upload Area -->
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
			<span class="upload-icon"><UploadIcon /></span>
			<p class="upload-title"><strong>{title}</strong></p>
			<p class="upload-hint">{subtitle}</p>
			<button class="browse-button" {disabled}> Browse Files </button>
			<input
				bind:this={fileInput}
				type="file"
				{accept}
				{multiple}
				onchange={handleFileSelect}
				style="display: none;"
			/>
		</div>
	{/if}
</div>

<style>
	.file-upload-area {
		width: 100%;
	}

	/* Upload Area Styles */
	.upload-area {
		border: 3px dashed var(--color-text-primary);
		padding: 2rem;
		text-align: center;
		background: linear-gradient(135deg, rgba(255, 229, 180, 0.1) 0%, rgba(230, 230, 250, 0.1) 100%);
		cursor: pointer;
		transition: all 0.3s;
		position: relative;
		transform: rotate(-0.5deg);
	}

	.upload-area.drag-over {
		background: var(--color-accent-light-yellow);
		border-color: var(--color-primary);
		transform: rotate(0deg) scale(1.02);
		box-shadow: 5px 5px 0 var(--color-text-primary);
	}

	.upload-icon {
		font-size: 3rem;
		display: block;
		margin-bottom: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-text-primary);
	}

	.upload-icon :global(svg) {
		width: 3rem;
		height: 3rem;
	}

	.upload-title {
		margin: 0.5rem 0;
		font-size: 1.125rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.upload-hint {
		color: var(--color-text-tertiary);
		font-size: 0.875rem;
		margin: 0.5rem 0 1rem 0;
	}

	.browse-button {
		padding: 0.75rem 1.5rem;
		background: var(--color-success);
		border: var(--border-brutalist-thick);
		box-shadow: var(--shadow-brutalist-medium);
		font-size: 1rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 1px;
		cursor: pointer;
		transition: all 0.15s;
	}

	.browse-button:hover:not(:disabled) {
		transform: translate(-2px, -2px);
		box-shadow: var(--shadow-brutalist-large);
		background: var(--color-primary-dark);
	}

	.browse-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Single File Selected */
	.single-file-selected {
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
		letter-spacing: 0.5px;
	}

	.file-details small {
		color: var(--color-text-tertiary);
		font-weight: 500;
	}

	.clear-button,
	.remove-file-btn {
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

	.clear-button :global(svg),
	.remove-file-btn :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}

	.clear-button:hover:not(:disabled),
	.remove-file-btn:hover:not(:disabled) {
		transform: translate(-2px, -2px);
		box-shadow: 5px 5px 0 var(--color-text-primary);
	}

	.clear-button:disabled,
	.remove-file-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Multiple Files Selected */
	.selected-files {
		background: var(--color-background-main);
		border: var(--border-brutalist-thick);
		padding: 1.5rem;
		box-shadow: var(--shadow-brutalist-large);
	}

	.files-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		padding-bottom: 0.5rem;
		border-bottom: var(--border-brutalist-thin);
	}

	.files-header h4 {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--color-text-primary);
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.clear-all-btn {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.375rem 0.75rem;
		background: var(--color-danger);
		color: var(--color-text-primary);
		border: var(--border-brutalist-thin);
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.8125rem;
		font-weight: 700;
		transition: all 0.2s;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-family: var(--font-family-primary);
	}

	.clear-all-btn :global(svg) {
		width: 1rem;
		height: 1rem;
	}

	.clear-all-btn:hover:not(:disabled) {
		background: var(--color-danger-hover);
		transform: translate(-1px, -1px);
		box-shadow: var(--shadow-brutalist-small);
	}

	.clear-all-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.files-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1rem;
	}

	.file-item {
		display: flex;
		flex-direction: column;
		background: var(--color-background-secondary);
		border: var(--border-brutalist-thin);
		border-radius: 8px;
		overflow: hidden;
		position: relative;
		transition: all 0.2s;
		box-shadow: var(--shadow-brutalist-small);
	}

	.file-item:hover {
		transform: translate(-1px, -1px);
		box-shadow: var(--shadow-brutalist-medium);
	}

	.file-preview {
		width: 100%;
		height: 120px;
		overflow: hidden;
		background: var(--color-background-main);
		border-bottom: var(--border-brutalist-thin);
	}

	.file-preview img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.file-item .file-info {
		padding: 0.75rem;
		gap: 0.5rem;
	}

	.file-item .file-icon {
		font-size: 1.25rem;
	}

	.file-item .file-icon :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}

	.file-name {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text-primary);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.file-size {
		font-size: 0.75rem;
		color: var(--color-text-tertiary);
		font-weight: 500;
	}

	.file-item .remove-file-btn {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		width: 24px;
		height: 24px;
		padding: 0;
		border-radius: 50%;
	}

	.file-item .remove-file-btn :global(svg) {
		width: 1rem;
		height: 1rem;
	}

	@media (max-width: 600px) {
		.upload-area {
			padding: 1.5rem;
		}

		.single-file-selected {
			flex-direction: column;
			gap: 1rem;
			align-items: stretch;
		}

		.clear-button {
			width: 100%;
			padding: 0.75rem;
		}

		.files-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
