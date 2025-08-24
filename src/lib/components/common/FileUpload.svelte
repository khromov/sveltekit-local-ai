<script lang="ts">
	import FileAudioIcon from 'virtual:icons/lucide/file-audio';
	import ImageIcon from 'virtual:icons/lucide/image';
	import FileIcon from 'virtual:icons/lucide/file';
	import UploadIcon from 'virtual:icons/lucide/upload';
	import XIcon from 'virtual:icons/lucide/x';
	import Trash2Icon from 'virtual:icons/lucide/trash-2';
	import StarIcon from 'virtual:icons/lucide/star';
	import ZapIcon from 'virtual:icons/lucide/zap';
	import FolderIcon from 'virtual:icons/lucide/folder';

	type FileType = 'audio' | 'image' | 'any';
	type Mode = 'single' | 'batch';
	type Variant = 'default' | 'compact' | 'minimal';

	interface Props {
		// Core functionality
		mode?: Mode;
		fileType?: FileType;

		// File handling
		selectedFile?: File | null;
		selectedFiles?: File[];
		onFileSelect?: (file: File) => void;
		onFilesSelect?: (files: File[]) => void;

		// UI customization
		title?: string;
		description?: string;
		showExample?: boolean;
		exampleUrl?: string;
		onExampleUse?: () => void;

		// Behavior
		disabled?: boolean;
		maxFiles?: number;
		maxFileSize?: number; // in bytes

		// Styling
		variant?: Variant;
		showPreview?: boolean;
		showFileInfo?: boolean;
	}

	let {
		mode = 'single',
		fileType = 'any',
		selectedFile = $bindable(),
		selectedFiles = $bindable([]),
		onFileSelect,
		onFilesSelect,
		title,
		description,
		showExample = false,
		exampleUrl,
		onExampleUse,
		disabled = false,
		maxFiles = 10,
		maxFileSize = 100 * 1024 * 1024, // 100MB default
		variant = 'default',
		showPreview = true,
		showFileInfo = true
	}: Props = $props();

	// File type configurations
	const FILE_TYPE_CONFIGS = {
		audio: {
			accept: 'audio/*,.mp3,.wav,.m4a,.ogg,.webm',
			icon: FileAudioIcon,
			defaultTitle: 'Choose Audio File',
			defaultDescription: 'Drag & Drop Audio File'
		},
		image: {
			accept: 'image/*,.jpg,.jpeg,.png,.webp,.gif',
			icon: ImageIcon,
			defaultTitle: 'Choose Image',
			defaultDescription: 'Drop your image here'
		},
		any: {
			accept: '*',
			icon: FileIcon,
			defaultTitle: 'Choose File',
			defaultDescription: 'Drop your file here'
		}
	};

	let fileInputElement: HTMLInputElement | undefined = $state();
	let isDragging = $state(false);

	// Computed properties
	let config = $derived(FILE_TYPE_CONFIGS[fileType]);
	let displayTitle = $derived(title || config.defaultTitle);
	let displayDescription = $derived(description || config.defaultDescription);
	let hasFiles = $derived(mode === 'single' ? selectedFile !== null : selectedFiles.length > 0);
	let FileTypeIcon = $derived(config.icon);

	function validateFile(file: File): boolean {
		// Check file size
		if (file.size > maxFileSize) {
			console.warn(`File ${file.name} exceeds maximum size of ${maxFileSize} bytes`);
			return false;
		}

		// Check file type
		if (fileType === 'any') return true;

		if (fileType === 'audio') {
			return (
				file.type.startsWith('audio/') ||
				['.mp3', '.wav', '.m4a', '.ogg', '.webm'].some((ext) =>
					file.name.toLowerCase().endsWith(ext)
				)
			);
		}

		if (fileType === 'image') {
			return (
				file.type.startsWith('image/') ||
				['.jpg', '.jpeg', '.png', '.webp', '.gif'].some((ext) =>
					file.name.toLowerCase().endsWith(ext)
				)
			);
		}

		return true;
	}

	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			const files = Array.from(target.files).filter(validateFile);

			if (mode === 'single' && files.length > 0) {
				const file = files[0];
				selectedFile = file;
				onFileSelect?.(file);
			} else if (mode === 'batch' && files.length > 0) {
				const limitedFiles = files.slice(0, maxFiles);
				selectedFiles = limitedFiles;
				onFilesSelect?.(limitedFiles);
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
			const validFiles = Array.from(files).filter(validateFile);

			if (mode === 'single' && validFiles.length > 0) {
				const file = validFiles[0];
				selectedFile = file;
				onFileSelect?.(file);
			} else if (mode === 'batch' && validFiles.length > 0) {
				const limitedFiles = validFiles.slice(0, maxFiles);
				selectedFiles = limitedFiles;
				onFilesSelect?.(limitedFiles);
			}
		}
	}

	function openFileDialog() {
		if (!disabled) {
			fileInputElement?.click();
		}
	}

	function clearFile() {
		selectedFile = null;
		if (fileInputElement) {
			fileInputElement.value = '';
		}
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
			clearFile();
		} else {
			selectedFiles = [];
			onFilesSelect?.([]);
		}
		if (fileInputElement) {
			fileInputElement.value = '';
		}
	}

	function handleImageLoad(event: Event) {
		const img = event.target as HTMLImageElement;
		if (img.src.startsWith('blob:')) {
			URL.revokeObjectURL(img.src);
		}
	}

	function formatFileSize(bytes: number): string {
		if (bytes === 0) return '0 B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}
</script>

<div
	class="file-upload"
	class:batch-mode={mode === 'batch'}
	class:variant-compact={variant === 'compact'}
	class:variant-minimal={variant === 'minimal'}
>
	<div class="upload-decoration"></div>

	{#if variant !== 'minimal'}
		<h3>
			<span class="title-icon"><FileTypeIcon /></span>
			{displayTitle}
			{#if mode === 'batch'}
				<span class="mode-badge">Batch</span>
			{/if}
		</h3>
	{/if}

	<input
		bind:this={fileInputElement}
		type="file"
		accept={config.accept}
		multiple={mode === 'batch'}
		onchange={handleFileSelect}
		{disabled}
		style="display: none;"
	/>

	{#if !hasFiles || mode === 'batch'}
		<div
			class="file-upload-area"
			class:disabled
			class:dragging={isDragging}
			class:has-files={hasFiles}
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
					{#if hasFiles && mode === 'batch'}
						<span class="file-icon"><FolderIcon /></span>
						{selectedFiles.length} file{selectedFiles.length === 1 ? '' : 's'} selected
					{:else}
						{displayDescription}
					{/if}
				</p>
				<p class="upload-hint">
					{#if hasFiles && mode === 'batch'}
						Click to add more files
					{:else}
						or click to browse • {fileType === 'audio'
							? 'MP3, WAV, M4A supported'
							: fileType === 'image'
								? 'JPG, PNG, WebP supported'
								: 'All file types supported'}
					{/if}
				</p>
			</div>
		</div>
	{/if}

	{#if mode === 'single' && selectedFile && showFileInfo}
		<div class="file-selected">
			<div class="file-info">
				<span class="file-icon"><FileTypeIcon /></span>
				<div class="file-details">
					<strong>{selectedFile.name}</strong>
					<small>{formatFileSize(selectedFile.size)}</small>
				</div>
			</div>
			<button class="clear-button" onclick={clearFile} {disabled}>
				<XIcon />
			</button>
		</div>
	{/if}

	{#if mode === 'single' && !hasFiles && showExample && exampleUrl}
		<div class="or-divider">
			<span>OR</span>
		</div>

		<button class="example-button" onclick={onExampleUse} {disabled}>
			<span class="example-icon"><StarIcon /></span>
			Try Example File
		</button>
	{/if}

	{#if mode === 'batch' && selectedFiles.length > 0}
		<div class="selected-files">
			<div class="files-header">
				<h4>Selected Files ({selectedFiles.length})</h4>
				<button class="clear-all-btn" onclick={clearAllFiles} {disabled}>
					<span class="clear-icon"><Trash2Icon /></span>
					Clear All
				</button>
			</div>

			{#if showPreview && fileType === 'image'}
				<div class="files-grid">
					{#each selectedFiles as file, index (file.name + file.size)}
						<div class="file-item">
							<div class="file-preview">
								<img src={URL.createObjectURL(file)} alt={file.name} onload={handleImageLoad} />
							</div>
							<div class="file-info">
								<div class="file-name" title={file.name}>{file.name}</div>
								<div class="file-size">{formatFileSize(file.size)}</div>
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
			{:else}
				<div class="files-list">
					{#each selectedFiles as file, index (file.name + file.size)}
						<div class="file-list-item">
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
			{/if}

			{#if variant !== 'minimal'}
				<div class="batch-actions">
					<button
						class="process-batch-btn primary-button"
						onclick={() => onFilesSelect?.(selectedFiles)}
						{disabled}
					>
						<span class="btn-icon"><ZapIcon /></span>
						Process {selectedFiles.length} File{selectedFiles.length === 1 ? '' : 's'}
					</button>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.file-upload {
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

	.file-upload.variant-compact {
		padding: 1.5rem;
		margin-bottom: 1rem;
	}

	.file-upload.variant-minimal {
		padding: 1rem;
		margin-bottom: 0.5rem;
		border: var(--border-brutalist-thick);
		box-shadow: var(--shadow-brutalist-medium);
	}

	.file-upload.batch-mode .upload-decoration {
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

	.file-upload h3 {
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

	.mode-badge {
		font-size: 0.875rem;
		background: var(--color-success);
		padding: 0.25rem 0.5rem;
		border: var(--border-brutalist-thin);
		border-radius: 4px;
		margin-left: 0.5rem;
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

	.file-upload-area {
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

	.variant-compact .file-upload-area {
		min-height: 120px;
	}

	.variant-minimal .file-upload-area {
		min-height: 80px;
		border: 2px dashed var(--color-text-primary);
		box-shadow: 3px 3px 0 var(--color-text-primary);
	}

	.file-upload-area:hover:not(.disabled) {
		transform: translate(-2px, -2px) rotate(0deg);
		box-shadow: 7px 7px 0 var(--color-text-primary);
		background: var(--color-background-cream);
	}

	.file-upload-area.has-files {
		border-style: solid;
		background: var(--color-success);
	}

	.batch-mode .file-upload-area.has-files {
		background: var(--color-accent-blue);
	}

	.file-upload-area.disabled {
		cursor: not-allowed;
		opacity: 0.6;
		background: var(--color-background-disabled);
	}

	.file-upload-area.dragging {
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

	.variant-compact .upload-content {
		padding: 1.5rem;
		min-height: 120px;
	}

	.variant-minimal .upload-content {
		padding: 1rem;
		min-height: 80px;
	}

	.upload-icon {
		color: var(--color-text-primary);
		margin-bottom: 1rem;
		animation: float 3s ease-in-out infinite;
		display: flex;
		font-size: 48px;
	}

	.variant-minimal .upload-icon {
		font-size: 32px;
		margin-bottom: 0.5rem;
	}

	.upload-icon :global(svg) {
		width: 48px;
		height: 48px;
	}

	.variant-minimal .upload-icon :global(svg) {
		width: 32px;
		height: 32px;
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

	.variant-minimal .upload-text {
		font-size: 1rem;
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

	.variant-minimal .upload-hint {
		font-size: 0.8125rem;
		padding: 2px 8px;
	}

	.file-upload-area.has-files .upload-hint {
		background: var(--color-background-main);
	}

	/* Single file selected display */
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
		margin-bottom: 1rem;
	}

	.file-info {
		display: flex;
		align-items: center;
		gap: 1rem;
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

	/* Example button */
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
		margin-bottom: 1rem;
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

	/* Batch mode styles */
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

	/* Image grid for batch mode */
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

	.file-item .file-info {
		padding: 0.75rem;
		flex: 1;
		gap: 0;
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

	/* List view for non-image files */
	.files-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
	}

	.file-list-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: var(--color-background-secondary);
		border: var(--border-brutalist-thin);
		border-radius: 8px;
		padding: 1rem;
		transition: all 0.2s;
		box-shadow: var(--shadow-brutalist-small);
	}

	.file-list-item:hover {
		transform: translate(-1px, -1px);
		box-shadow: var(--shadow-brutalist-medium);
	}

	.file-list-item .file-info {
		flex: 1;
		gap: 1rem;
	}

	.file-list-item .remove-file-btn {
		position: static;
		width: 32px;
		height: 32px;
		border-radius: 4px;
	}

	.file-list-item .remove-file-btn :global(svg) {
		width: 1rem;
		height: 1rem;
	}

	/* Batch actions */
	.batch-actions {
		display: flex;
		justify-content: center;
		padding-top: 1rem;
		border-top: var(--border-brutalist-thin);
	}

	.process-batch-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem 2rem;
		font-size: 1.125rem;
		background: var(--color-success);
		color: var(--color-text-primary);
		border: var(--border-brutalist-thick);
		border-radius: 8px;
		cursor: pointer;
		font-weight: 700;
		transition: all 0.2s;
		box-shadow: var(--shadow-brutalist-medium);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-family: var(--font-family-primary);
	}

	.process-batch-btn:hover:not(:disabled) {
		background: var(--color-success-hover);
		transform: translate(-2px, -2px);
		box-shadow: var(--shadow-brutalist-large);
	}

	.process-batch-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
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

	/* Responsive design */
	@media (max-width: 768px) {
		.file-upload {
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
		.file-upload {
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

		.process-batch-btn {
			width: 100%;
			justify-content: center;
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

	@media (max-width: 400px) {
		.file-upload {
			padding: 1rem;
		}

		.variant-minimal .file-upload {
			padding: 0.75rem;
		}

		.files-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
