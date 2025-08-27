<script lang="ts">
	import UploadIcon from 'virtual:icons/lucide/upload';
	import FileIcon from 'virtual:icons/lucide/file';
	import XIcon from 'virtual:icons/lucide/x';

	interface Props {
		label?: string;
		accept?: string;
		multiple?: boolean;
		disabled?: boolean;
		onFileSelect?: (files: File[]) => void;
		maxSize?: number; // in MB
	}

	let {
		label = 'Choose Files',
		accept = '*',
		multiple = false,
		disabled = false,
		onFileSelect,
		maxSize = 10
	}: Props = $props();

	let fileInput: HTMLInputElement | undefined = $state();
	let isDragging = $state(false);
	let selectedFiles = $state<File[]>([]);

	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			processFiles(Array.from(target.files));
		}
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		isDragging = false;

		if (disabled) return;

		const files = event.dataTransfer?.files;
		if (files && files.length > 0) {
			processFiles(Array.from(files));
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		if (!disabled) {
			isDragging = true;
		}
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		isDragging = false;
	}

	function processFiles(files: File[]) {
		const validFiles = files.filter((file) => {
			const sizeInMB = file.size / (1024 * 1024);
			return sizeInMB <= maxSize;
		});

		selectedFiles = multiple ? [...selectedFiles, ...validFiles] : validFiles.slice(0, 1);

		if (onFileSelect) {
			onFileSelect(selectedFiles);
		}
	}

	function removeFile(index: number) {
		selectedFiles = selectedFiles.filter((_, i) => i !== index);
		if (onFileSelect) {
			onFileSelect(selectedFiles);
		}
	}

	function formatFileSize(bytes: number): string {
		const mb = bytes / (1024 * 1024);
		return `${mb.toFixed(2)} MB`;
	}
</script>

<div class="file-upload-wrapper">
	{#if label}
		<label class="upload-label">{label}</label>
	{/if}

	<div
		class="upload-area"
		class:dragging={isDragging}
		class:disabled
		class:has-files={selectedFiles.length > 0}
		ondrop={handleDrop}
		ondragover={handleDragOver}
		ondragleave={handleDragLeave}
		onclick={() => !disabled && fileInput?.click()}
		role="button"
		tabindex={disabled ? -1 : 0}
	>
		<input
			bind:this={fileInput}
			type="file"
			{accept}
			{multiple}
			{disabled}
			onchange={handleFileSelect}
			style="display: none;"
		/>

		{#if selectedFiles.length === 0}
			<div class="upload-placeholder">
				<span class="upload-icon"><UploadIcon /></span>
				<p><strong>Drag & Drop Files</strong></p>
				<p class="upload-hint">or click to browse</p>
				<p class="upload-info">Max size: {maxSize} MB</p>
			</div>
		{:else}
			<div class="selected-files">
				{#each selectedFiles as file, index (file.name + index)}
					<div class="file-item">
						<span class="file-icon"><FileIcon /></span>
						<div class="file-info">
							<span class="file-name">{file.name}</span>
							<span class="file-size">{formatFileSize(file.size)}</span>
						</div>
						<button class="remove-btn" onclick|stopPropagation={() => removeFile(index)} {disabled}>
							<XIcon />
						</button>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.file-upload-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 100%;
	}

	.upload-label {
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--color-text-primary);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.upload-area {
		min-height: 150px;
		background: var(--color-background-main);
		border: 3px dashed var(--color-text-primary);
		cursor: pointer;
		transition: all 0.2s;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
		border-radius: 8px;
		box-shadow: var(--shadow-brutalist-small);
	}

	.upload-area:hover:not(.disabled) {
		transform: translate(-2px, -2px);
		box-shadow: var(--shadow-brutalist-medium);
		background: var(--color-background-cream);
	}

	.upload-area.dragging {
		background: var(--color-primary);
		border-style: solid;
		transform: translate(-2px, -2px);
		box-shadow: var(--shadow-brutalist-large);
	}

	.upload-area.has-files {
		border-style: solid;
		background: var(--color-background-secondary);
	}

	.upload-area.disabled {
		opacity: 0.6;
		cursor: not-allowed;
		background: var(--color-background-disabled);
	}

	.upload-placeholder {
		text-align: center;
		color: var(--color-text-primary);
	}

	.upload-icon {
		font-size: 3rem;
		display: block;
		margin-bottom: 1rem;
		color: var(--color-text-primary);
	}

	.upload-icon :global(svg) {
		width: 3rem;
		height: 3rem;
	}

	.upload-placeholder p {
		margin: 0.25rem 0;
	}

	.upload-hint {
		color: var(--color-text-secondary);
		font-size: 0.875rem;
	}

	.upload-info {
		font-size: 0.75rem;
		color: var(--color-text-tertiary);
		margin-top: 0.5rem;
	}

	.selected-files {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		width: 100%;
	}

	.file-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		background: var(--color-background-main);
		border: var(--border-brutalist-thin);
		border-radius: 6px;
		box-shadow: var(--shadow-brutalist-small);
	}

	.file-icon {
		display: flex;
		align-items: center;
		color: var(--color-text-secondary);
	}

	.file-icon :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}

	.file-info {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
		flex: 1;
		min-width: 0;
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
	}

	.remove-btn {
		padding: 0.25rem;
		background: var(--color-danger);
		border: var(--border-brutalist-thin);
		border-radius: 4px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
		color: var(--color-text-primary);
	}

	.remove-btn :global(svg) {
		width: 1rem;
		height: 1rem;
	}

	.remove-btn:hover:not(:disabled) {
		transform: scale(1.1);
		box-shadow: var(--shadow-brutalist-small);
	}

	.remove-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	@media (max-width: 600px) {
		.upload-area {
			min-height: 120px;
			padding: 1rem;
		}
	}
</style>
