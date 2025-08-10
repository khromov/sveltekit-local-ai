<script lang="ts">
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
		<span class="title-icon">{mode === 'single' ? '📁' : '📁'}</span>
		{mode === 'single' ? 'Choose Image' : 'Batch Processing'}
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
				{#if mode === 'single'}
					{#if selectedFile}
						<span class="file-icon">🖼️</span>
						{selectedFile.name}
					{:else}
						Drop your image here
					{/if}
				{:else if selectedFiles.length > 0}
					<span class="file-icon">📁</span>
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
			<span class="example-icon">🌟</span>
			Try Example Image
		</button>
	{/if}

	{#if mode === 'batch' && selectedFiles.length > 0}
		<div class="selected-files">
			<div class="files-header">
				<h4>Selected Images ({selectedFiles.length})</h4>
				<button class="clear-all-btn" onclick={clearAllFiles} {disabled}>
					<span class="clear-icon">🗑️</span>
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
					<span class="btn-icon">⚡</span>
					Process {selectedFiles.length} Image{selectedFiles.length === 1 ? '' : 's'}
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.background-remover-upload {
		background: #fff;
		border: 4px solid #000;
		padding: 2rem;
		box-shadow: 8px 8px 0 #000;
		margin-bottom: 1.5rem;
		position: relative;
		transform: rotate(0.5deg);
		animation: slideIn 0.4s ease-out;
		animation-delay: 0.1s;
		animation-fill-mode: both;
	}

	.background-remover-upload.batch-mode .upload-decoration {
		background: linear-gradient(135deg, #87ceeb 0%, #98fb98 100%);
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
		background: linear-gradient(135deg, #ffd93d 0%, #ff69b4 100%);
		z-index: -1;
		opacity: 0.3;
		border-radius: 5% 20% 5% 20% / 20% 5% 20% 5%;
	}

	.background-remover-upload h3 {
		margin-top: 0;
		margin-bottom: 1.5rem;
		font-family: 'Bebas Neue', sans-serif;
		font-size: 2rem;
		color: #000;
		text-align: center;
		letter-spacing: 2px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		background: #ffd93d;
		padding: 0.5rem 1.5rem;
		border: 3px solid #000;
		box-shadow: 5px 5px 0 #000;
		transform: rotate(1deg);
		width: fit-content;
		margin-left: auto;
		margin-right: auto;
		text-transform: uppercase;
	}

	.batch-mode h3 {
		background: #87ceeb;
	}

	.title-icon {
		font-size: 1.75rem;
	}

	.background-remover-upload input[type='file'] {
		display: none;
	}

	.file-upload-label {
		display: block;
		position: relative;
		min-height: 180px;
		background: #fff;
		border: 4px dashed #000;
		cursor: pointer;
		transition: all 0.15s ease;
		overflow: hidden;
		transform: rotate(-0.5deg);
		box-shadow: 5px 5px 0 #000;
		margin-bottom: 1.5rem;
	}

	.file-upload-label:hover:not(.disabled) {
		transform: translate(-2px, -2px) rotate(0deg);
		box-shadow: 7px 7px 0 #000;
		background: #fffacd;
	}

	.file-upload-label.has-file {
		border-style: solid;
	}

	.file-upload-label.has-file {
		background: #98fb98;
	}

	.batch-mode .file-upload-label.has-file {
		background: #87ceeb;
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

	.or-divider {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 1rem 0;
		position: relative;
	}

	.or-divider span {
		background: #fff;
		padding: 0 1rem;
		font-weight: 700;
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 2px;
		color: #666;
		position: relative;
	}

	.or-divider::before {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		height: 2px;
		background: #ddd;
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
		background: #98fb98;
		color: #000;
		border: 3px solid #000;
		border-radius: 8px;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 700;
		transition: all 0.2s;
		box-shadow: 4px 4px 0 #000;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		transform: rotate(-0.5deg);
	}

	.example-button:hover:not(:disabled) {
		transform: translate(-2px, -2px) rotate(0deg);
		box-shadow: 6px 6px 0 #000;
		background: #ffd93d;
	}

	.example-button:disabled {
		background: #e0e0e0;
		cursor: not-allowed;
		opacity: 0.6;
	}

	.example-icon {
		font-size: 1.25rem;
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
		border-bottom: 2px solid #000;
	}

	.files-header h4 {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 700;
		color: #000;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.clear-all-btn {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.375rem 0.75rem;
		background: #ff6b6b;
		color: #000;
		border: 2px solid #000;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.8125rem;
		font-weight: 700;
		transition: all 0.2s;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-family: 'Space Grotesk', system-ui, sans-serif;
	}

	.clear-all-btn:hover:not(:disabled) {
		background: #ff5252;
		transform: translate(-1px, -1px);
		box-shadow: 2px 2px 0 #000;
	}

	.clear-all-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.clear-icon {
		font-size: 1rem;
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
		background: #f5f5f5;
		border: 2px solid #000;
		border-radius: 8px;
		overflow: hidden;
		position: relative;
		transition: all 0.2s;
		box-shadow: 3px 3px 0 #000;
	}

	.file-item:hover {
		transform: translate(-1px, -1px);
		box-shadow: 4px 4px 0 #000;
	}

	.file-preview {
		width: 100%;
		height: 120px;
		overflow: hidden;
		background: #fff;
		border-bottom: 2px solid #000;
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
		color: #000;
		margin-bottom: 0.25rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.file-size {
		font-size: 0.75rem;
		color: #666;
		font-weight: 500;
	}

	.remove-file-btn {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		width: 24px;
		height: 24px;
		background: #ff6b6b;
		color: #000;
		border: 2px solid #000;
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
		background: #ff5252;
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
		border-top: 2px solid #000;
	}

	.start-batch-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem 2rem;
		font-size: 1.125rem;
		background: #98fb98;
	}

	.start-batch-btn:hover:not(:disabled) {
		background: #90ee90;
	}

	.btn-icon {
		font-size: 1.5rem;
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
