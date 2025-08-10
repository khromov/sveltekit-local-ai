<script lang="ts">
	interface Props {
		selectedFile: File | null;
		onFileSelect: (file: File) => void;
		onExampleUse: () => void;
		disabled?: boolean;
	}

	let {
		selectedFile = $bindable(),
		onFileSelect,
		onExampleUse,
		disabled = false
	}: Props = $props();

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

<div class="background-remover-upload">
	<div class="upload-decoration"></div>
	<h3>
		<span class="title-icon">📁</span>
		Choose Image
	</h3>

	<input
		bind:this={fileInputElement}
		type="file"
		accept="image/*"
		onchange={handleFileSelect}
		id="image-file"
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
					<span class="file-icon">🖼️</span>
					{selectedFile.name}
				{:else}
					Drop your image here
				{/if}
			</p>
			<p class="upload-hint">
				{#if selectedFile}
					Click to change image
				{:else}
					or click to browse • JPG, PNG, WebP supported
				{/if}
			</p>
		</div>
	</div>

	<div class="or-divider">
		<span>OR</span>
	</div>

	<button class="example-button" onclick={onExampleUse} {disabled}>
		<span class="example-icon">🌟</span>
		Try Example Image
	</button>
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
	}
</style>
