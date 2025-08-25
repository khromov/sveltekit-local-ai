<script lang="ts">
	import FolderIcon from 'virtual:icons/lucide/folder';
	import ImageIcon from 'virtual:icons/lucide/image';
	import StarIcon from 'virtual:icons/lucide/star';
	import Trash2Icon from 'virtual:icons/lucide/trash-2';
	import UploadIcon from 'virtual:icons/lucide/upload';
	import ZapIcon from 'virtual:icons/lucide/zap';

	interface Props {
		mode: 'single' | 'batch';
		selectedFile?: File | null;
		selectedFiles?: File[];
		onFileSelect?: (file: File) => void;
		onFilesSelect?: (files: File[]) => void;
		onExampleUse?: () => void;
		disabled?: boolean;
	}

	let {
		mode = 'single',
		selectedFile = $bindable(),
		selectedFiles = $bindable([]),
		onFileSelect,
		onFilesSelect,
		onExampleUse,
		disabled = false
	}: Props = $props();

	let fileInputElement: HTMLInputElement | undefined = $state();
	let isDragging = $state(false);

	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			if (mode === 'single') {
				const file = target.files[0];
				selectedFile = file;
				onFileSelect?.(file);
			} else {
				const filesArray = Array.from(target.files);
				selectedFiles = filesArray;
				onFilesSelect?.(filesArray);
			}
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
			if (mode === 'single') {
				const file = files[0];
				selectedFile = file;
				onFileSelect?.(file);
			} else {
				const filesArray = Array.from(files).filter((file) => file.type.startsWith('image/'));
				if (filesArray.length > 0) {
					selectedFiles = filesArray;
					onFilesSelect?.(filesArray);
				}
			}
		}
	}

	function openFileDialog() {
		fileInputElement?.click();
	}

	function removeFile(index: number) {
		if (mode === 'batch') {
			const newFiles = selectedFiles.filter((_, i) => i !== index);
			selectedFiles = newFiles;
			onFilesSelect?.(newFiles);
		}
	}

	function clearAllFiles() {
		if (mode === 'single') {
			selectedFile = null;
		} else {
			selectedFiles = [];
			onFilesSelect?.([]);
		}
	}

	function handleImageLoad(event: Event) {
		const img = event.target as HTMLImageElement;
		if (img.src.startsWith('blob:')) {
			URL.revokeObjectURL(img.src);
		}
	}

	// Computed properties for conditional rendering
	let hasFiles = $derived(mode === 'single' ? selectedFile !== null : selectedFiles.length > 0);
</script>

<div class="background-remover-upload" class:batch-mode={mode === 'batch'}>
	<div class="upload-decoration"></div>
	<h3>
		<span class="title-icon"><FolderIcon /></span>
		{mode === 'single' ? /* @wc-include */ 'Choose Image' : /* @wc-include */ 'Batch Processing'}
	</h3>

	<input
		bind:this={fileInputElement}
		type="file"
		accept="image/*"
		multiple={mode === 'batch'}
		onchange={handleFileSelect}
		id={mode === 'single' ? 'image-file' : 'batch-image-files'}
		{disabled}
	/>

	<div
		class="file-upload-label"
		class:disabled
		class:dragging={isDragging}
		class:has-file={hasFiles}
		ondragover={handleDragOver}
		ondragleave={handleDragLeave}
		ondrop={handleDrop}
		onclick={openFileDialog}
		onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && openFileDialog()}
		role="button"
		tabindex="0"
	>
		<div class="upload-content">
			<span class="upload-icon">
				<UploadIcon />
			</span>
			<p class="upload-text">
				{#if mode === 'single'}
					{#if selectedFile}
						<span class="file-icon"><ImageIcon /></span>
						{selectedFile.name}
					{:else}
						Drop your image here
					{/if}
				{:else if selectedFiles.length > 0}
					<span class="file-icon"><FolderIcon /></span>
					{selectedFiles.length} image{selectedFiles.length === 1 ? '' : 's'} selected
				{:else}
					Drop multiple images here
				{/if}
			</p>
			<p class="upload-hint">
				{#if hasFiles}
					{mode === 'single' ? 'Click to change image' : 'Click to add more images'}
				{:else}
					{mode === 'single'
						? 'or click to browse • JPG, PNG, WebP supported'
						: 'or click to browse • JPG, PNG, WebP supported'}
				{/if}
			</p>
		</div>
	</div>

	{#if mode === 'single' && !hasFiles}
		<div class="or-divider">
			<span>OR</span>
		</div>

		<button class="example-button" onclick={onExampleUse} {disabled}>
			<span class="example-icon"><StarIcon /></span>
			Try Example Image
		</button>
	{/if}

	{#if mode === 'batch' && selectedFiles.length > 0}
		<div class="selected-files">
			<div class="files-header">
				<h4>Selected Images ({selectedFiles.length})</h4>
				<button class="clear-all-btn" onclick={clearAllFiles} {disabled}>
					<span class="clear-icon"><Trash2Icon /></span>
					Clear All
				</button>
			</div>

			<div class="files-grid">
				{#each selectedFiles as file, index (file.name + file.size)}
					<div class="file-item">
						<div class="file-preview">
							<img src={URL.createObjectURL(file)} alt={file.name} onload={handleImageLoad} />
						</div>
						<div class="file-info">
							<div class="file-name" title={file.name}>{file.name}</div>
							<div class="file-size">{(file.size / 1024 / 1024).toFixed(1)} MB</div>
						</div>
						<button
							class="remove-file-btn"
							onclick={() => removeFile(index)}
							{disabled}
							aria-label={`Remove ${file.name}`}
						>
							×
						</button>
					</div>
				{/each}
			</div>

			<div class="batch-actions">
				<button
					class="start-batch-btn primary-button"
					onclick={() => onFilesSelect?.(selectedFiles)}
					{disabled}
				>
					<span class="btn-icon"><ZapIcon /></span>
					Process {selectedFiles.length} Image{selectedFiles.length === 1 ? '' : 's'}
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.background-remover-upload {
		background: var(--color-background-main);
		border: var(--border-brutalist-extra-thick);
		padding: 2rem;
		box-shadow: var(--shadow-brutalist-xlarge);
		margin-bottom: 1.5rem;
		position: relative;
		transform: rotate(0.5deg);
		animation: slideIn 0.4s ease-out;
		animation-delay: 0.1s;
		animation-fill-mode: both;
	}

	.background-remover-upload.batch-mode .upload-decoration {
		background: linear-gradient(135deg, var(--color-accent-blue) 0%, var(--color-success) 100%);
	}

	@keyframes slideIn {
		from {
			transform: translateX(20px) rotate(1deg);
			opacity: 0;
		}
		to {
			transform: translateX(0) rotate(0.5deg);
			opacity: 1;
		}
	}

	.upload-decoration {
		position: absolute;
		top: -8px;
		left: -8px;
		right: -8px;
		bottom: -8px;
		background: linear-gradient(
			135deg,
			var(--color-primary-dark) 0%,
			var(--color-accent-pink) 100%
		);
		z-index: -1;
		opacity: 0.3;
		border-radius: 5% 20% 5% 20% / 20% 5% 20% 5%;
	}

	.background-remover-upload h3 {
		margin-top: 0;
		margin-bottom: 1.5rem;
		font-family: var(--font-family-display);
		font-size: 2rem;
		color: var(--color-text-primary);
		text-align: center;
		letter-spacing: 2px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		background: var(--color-primary-dark);
		padding: 0.5rem 1.5rem;
		border: var(--border-brutalist-thick);
		box-shadow: 5px 5px 0 var(--color-text-primary);
		transform: rotate(1deg);
		width: fit-content;
		margin-left: auto;
		margin-right: auto;
		text-transform: uppercase;
	}

	.batch-mode h3 {
		background: var(--color-accent-blue);
	}

	.title-icon {
		font-size: 1.75rem;
		display: flex;
		align-items: center;
		color: var(--color-text-primary);
	}

	.title-icon :global(svg) {
		width: 1.75rem;
		height: 1.75rem;
	}

	.background-remover-upload input[type='file'] {
		display: none;
	}

	.file-upload-label {
		display: block;
		position: relative;
		min-height: 180px;
		background: var(--color-background-main);
		border: 4px dashed var(--color-text-primary);
		cursor: pointer;
		transition: all 0.15s ease;
		overflow: hidden;
		transform: rotate(-0.5deg);
		box-shadow: 5px 5px 0 var(--color-text-primary);
		margin-bottom: 1.5rem;
	}

	.file-upload-label:hover:not(.disabled) {
		transform: translate(-2px, -2px) rotate(0deg);
		box-shadow: 7px 7px 0 var(--color-text-primary);
		background: var(--color-background-cream);
	}

	.file-upload-label.has-file {
		border-style: solid;
	}

	.file-upload-label.has-file {
		background: var(--color-success);
	}

	.batch-mode .file-upload-label.has-file {
		background: var(--color-accent-blue);
	}

	.file-upload-label.disabled {
		cursor: not-allowed;
		opacity: 0.6;
		background: var(--color-background-disabled);
	}

	.file-upload-label.dragging {
		background: var(--color-primary-dark);
		border-style: solid;
		border-color: var(--color-text-primary);
		transform: translate(-3px, -3px) rotate(0deg);
		box-shadow: 8px 8px 0 var(--color-text-primary);
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
		color: var(--color-text-primary);
		margin-bottom: 1rem;
		animation: float 3s ease-in-out infinite;
		display: flex;
		font-size: 48px;
	}

	.upload-icon :global(svg) {
		width: 48px;
		height: 48px;
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
		color: var(--color-text-primary);
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
		display: flex;
		align-items: center;
		color: var(--color-text-primary);
	}

	.file-icon :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}

	.upload-hint {
		font-size: 0.9375rem;
		color: var(--color-text-secondary);
		margin: 0;
		text-align: center;
		font-weight: 600;
		background: var(--color-primary-dark);
		padding: 4px 12px;
		border: var(--border-brutalist-thin);
		box-shadow: var(--shadow-brutalist-small);
	}

	.file-upload-label.has-file .upload-hint {
		background: var(--color-background-main);
	}

	.or-divider {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 1rem 0;
		position: relative;
	}

	.or-divider span {
		background: var(--color-background-main);
		padding: 0 1rem;
		font-weight: 700;
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 2px;
		color: var(--color-text-tertiary);
		position: relative;
	}

	.or-divider::before {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		height: 2px;
		background: var(--color-gray-300);
		top: 50%;
		transform: translateY(-50%);
	}

	.example-button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		width: 100%;
		padding: 1rem 1.5rem;
		background: var(--color-success);
		color: var(--color-text-primary);
		border: var(--border-brutalist-thick);
		border-radius: 8px;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 700;
		transition: all 0.2s;
		box-shadow: var(--shadow-brutalist-medium);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-family: var(--font-family-primary);
		transform: rotate(-0.5deg);
	}

	.example-button:hover:not(:disabled) {
		transform: translate(-2px, -2px) rotate(0deg);
		box-shadow: var(--shadow-brutalist-large);
		background: var(--color-primary-dark);
	}

	.example-button:disabled {
		background: var(--color-background-disabled);
		cursor: not-allowed;
		opacity: 0.6;
	}

	.example-icon {
		font-size: 1.25rem;
		display: flex;
		align-items: center;
		color: var(--color-text-primary);
	}

	.example-icon :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}

	/* Batch Mode Specific Styles */
	.selected-files {
		margin-top: 1.5rem;
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

	.clear-all-btn:hover:not(:disabled) {
		background: var(--color-danger-hover);
		transform: translate(-1px, -1px);
		box-shadow: var(--shadow-brutalist-small);
	}

	.clear-all-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.clear-icon {
		font-size: 1rem;
		display: flex;
		align-items: center;
		color: var(--color-text-primary);
	}

	.clear-icon :global(svg) {
		width: 1rem;
		height: 1rem;
	}

	.files-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1rem;
		margin-bottom: 1.5rem;
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

	.file-info {
		padding: 0.75rem;
		flex: 1;
	}

	.file-name {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text-primary);
		margin-bottom: 0.25rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.file-size {
		font-size: 0.75rem;
		color: var(--color-text-tertiary);
		font-weight: 500;
	}

	.remove-file-btn {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		width: 24px;
		height: 24px;
		background: var(--color-danger);
		color: var(--color-text-primary);
		border: var(--border-brutalist-thin);
		border-radius: 50%;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 700;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
		line-height: 1;
	}

	.remove-file-btn:hover:not(:disabled) {
		background: var(--color-danger-hover);
		transform: scale(1.1);
	}

	.remove-file-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.batch-actions {
		display: flex;
		justify-content: center;
		padding-top: 1rem;
		border-top: var(--border-brutalist-thin);
	}

	.start-batch-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem 2rem;
		font-size: 1.125rem;
		background: var(--color-success);
	}

	.start-batch-btn:hover:not(:disabled) {
		background: var(--color-success-hover);
	}

	.btn-icon {
		font-size: 1.5rem;
		display: flex;
		align-items: center;
		color: var(--color-text-primary);
	}

	.btn-icon :global(svg) {
		width: 1.5rem;
		height: 1.5rem;
	}

	@media (max-width: 768px) {
		.background-remover-upload {
			padding: 1.5rem;
		}

		.files-grid {
			grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
			gap: 0.75rem;
		}

		.files-header {
			flex-direction: column;
			gap: 0.75rem;
			align-items: stretch;
		}

		.clear-all-btn {
			align-self: center;
		}
	}

	@media (max-width: 600px) {
		.background-remover-upload {
			padding: 1.25rem;
		}

		.upload-content {
			padding: 1.5rem;
			min-height: 150px;
		}

		.upload-text {
			font-size: 1rem;
		}

		.upload-hint {
			font-size: 0.875rem;
		}

		.example-button {
			font-size: 0.875rem;
			padding: 0.875rem 1.25rem;
		}

		.files-grid {
			grid-template-columns: 1fr 1fr;
		}

		.start-batch-btn {
			width: 100%;
			justify-content: center;
		}
	}
</style>
