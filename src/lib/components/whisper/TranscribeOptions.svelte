<script lang="ts">
	import FileUpload from './FileUpload.svelte';
	import AudioRecorder from './AudioRecorder.svelte';

	interface Props {
		transcribeMode: 'demo' | 'upload' | 'record';
		selectedFile: File | null;
		onFileSelect: (file: File) => void;
		onModeChange: (mode: 'demo' | 'upload' | 'record') => void;
		disabled?: boolean;
	}

	let {
		transcribeMode = $bindable(),
		selectedFile = $bindable(),
		onFileSelect,
		onModeChange,
		disabled = false
	}: Props = $props();

	function handleModeChange(mode: 'demo' | 'upload' | 'record') {
		onModeChange(mode);
	}
</script>

<div class="transcribe-options">
	<div class="options-decoration">
		<svg viewBox="0 0 100 100" width="100" height="100">
			<path
				d="M20,50 Q50,20 80,50 Q50,80 20,50"
				fill="none"
				stroke="var(--sage)"
				stroke-width="2"
				opacity="0.2"
			/>
			<circle cx="35" cy="40" r="3" fill="var(--clay)" opacity="0.4" />
			<circle cx="65" cy="60" r="2" fill="var(--earth-dark)" opacity="0.5" />
		</svg>
	</div>
	<h3>
		<svg viewBox="0 0 20 20" width="20" height="20" class="title-icon">
			<circle cx="10" cy="10" r="6" fill="var(--mocha-mousse)" opacity="0.7" />
			<circle cx="8" cy="8" r="2" fill="var(--cream)" opacity="0.9" />
			<circle cx="12" cy="12" r="1.5" fill="var(--cream)" opacity="0.8" />
		</svg>
		Choose Audio Source
	</h3>

	<div class="option-group">
		<label class="option-label" class:selected={transcribeMode === 'upload'}>
			<input
				type="radio"
				name="transcribeMode"
				value="upload"
				checked={transcribeMode === 'upload'}
				onchange={() => handleModeChange('upload')}
				{disabled}
			/>
			<div class="option-content">
				<div class="option-header">
					<svg viewBox="0 0 20 20" width="20" height="20" class="option-icon">
						<rect
							x="3"
							y="4"
							width="14"
							height="10"
							rx="2"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
						/>
						<path
							d="M7,8 L13,8 M7,10 L11,10"
							stroke="currentColor"
							stroke-width="1"
							opacity="0.7"
						/>
					</svg>
					<strong>Upload File</strong>
				</div>
				<small>Select an audio file from your device (.mp3, .wav, .m4a)</small>
			</div>
		</label>

		<label class="option-label" class:selected={transcribeMode === 'record'}>
			<input
				type="radio"
				name="transcribeMode"
				value="record"
				checked={transcribeMode === 'record'}
				onchange={() => handleModeChange('record')}
				{disabled}
			/>
			<div class="option-content">
				<div class="option-header">
					<svg viewBox="0 0 20 20" width="20" height="20" class="option-icon">
						<rect
							x="7"
							y="2"
							width="6"
							height="10"
							rx="3"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
						/>
						<path
							d="M4,10 Q4,16 10,16 Q16,16 16,10"
							stroke="currentColor"
							stroke-width="1.5"
							fill="none"
						/>
						<line x1="10" y1="16" x2="10" y2="18" stroke="currentColor" stroke-width="1.5" />
						<line x1="7" y1="18" x2="13" y2="18" stroke="currentColor" stroke-width="1.5" />
					</svg>
					<strong>Record Audio</strong>
				</div>
				<small>Record audio directly from your microphone</small>
			</div>
		</label>

		<div class="or-divider">
			<span>or try</span>
			<svg viewBox="0 0 40 2" width="40" height="2" class="divider-line">
				<path d="M0,1 L40,1" stroke="var(--earth-medium)" stroke-width="1" opacity="0.5" />
			</svg>
		</div>

		<label class="option-label demo-option" class:selected={transcribeMode === 'demo'}>
			<input
				type="radio"
				name="transcribeMode"
				value="demo"
				checked={transcribeMode === 'demo'}
				onchange={() => handleModeChange('demo')}
				{disabled}
			/>
			<div class="option-content demo-content">
				<div class="demo-header">
					<svg viewBox="0 0 20 20" width="18" height="18" class="demo-icon">
						<polygon points="8,5 8,15 15,10" fill="currentColor" />
					</svg>
					<strong>Demo Audio</strong>
				</div>
				<small>
					<a href="/rich.mp3" target="_blank" class="demo-link">
						<svg viewBox="0 0 16 16" width="12" height="12">
							<path d="M8,2 L14,6 L8,10 L2,6 Z" fill="currentColor" />
						</svg>
						Listen to sample →
					</a>
				</small>
			</div>
		</label>
	</div>

	{#if transcribeMode === 'upload'}
		<FileUpload bind:selectedFile {onFileSelect} {disabled} />
	{:else if transcribeMode === 'record'}
		<AudioRecorder bind:selectedFile {onFileSelect} {disabled} />
	{/if}
</div>

<style>
	.transcribe-options {
		background: rgba(245, 241, 235, 0.8);
		backdrop-filter: blur(15px);
		border: 1px solid var(--earth-medium);
		padding: 2rem;
		box-shadow:
			0 8px 32px rgba(139, 111, 71, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
		margin-bottom: 1.5rem;
		position: relative;
		border-radius: 1.5rem;
		animation: slideIn 0.6s ease-out;
		animation-delay: 0.1s;
		animation-fill-mode: both;
	}

	@keyframes slideIn {
		from {
			transform: translateX(20px);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}

	.options-decoration {
		position: absolute;
		top: -20px;
		left: -20px;
		opacity: 0.6;
		z-index: 0;
		animation: gentleRotate 15s linear infinite;
	}

	@keyframes gentleRotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.transcribe-options h3 {
		margin-top: 0;
		margin-bottom: 1.5rem;
		font-family: 'Bebas Neue', sans-serif;
		font-size: 1.5rem;
		color: var(--text-primary);
		text-align: center;
		letter-spacing: 0.05em;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		position: relative;
		z-index: 1;
	}

	.title-icon {
		filter: drop-shadow(0 2px 4px rgba(139, 111, 71, 0.2));
	}

	.option-group {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.option-label {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.25rem;
		border: 1px solid var(--earth-medium);
		background: rgba(245, 241, 235, 0.6);
		backdrop-filter: blur(10px);
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow:
			0 4px 15px rgba(139, 111, 71, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.6);
		position: relative;
		border-radius: 1rem;
	}

	.option-label:hover {
		transform: translateY(-2px);
		box-shadow:
			0 6px 20px rgba(139, 111, 71, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
		background: rgba(245, 241, 235, 0.8);
	}

	.option-label.selected {
		background: linear-gradient(135deg, rgba(156, 175, 136, 0.2) 0%, rgba(245, 241, 235, 0.9) 100%);
		border-color: var(--sage);
		transform: translateY(-3px);
		box-shadow:
			0 8px 25px rgba(139, 111, 71, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
	}

	.option-label input[type='radio'] {
		width: 18px;
		height: 18px;
		margin: 0;
		accent-color: var(--mocha-mousse);
		cursor: pointer;
		border: 2px solid var(--earth-medium);
		position: relative;
	}

	.option-content {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		flex: 1;
	}

	.option-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.option-icon {
		color: var(--text-primary);
		opacity: 0.8;
	}

	.option-content strong {
		font-size: 1rem;
		color: var(--text-primary);
		letter-spacing: 0.02em;
		font-weight: 600;
	}

	.option-content small {
		font-size: 0.9rem;
		color: var(--text-secondary);
		font-weight: 400;
		margin-left: 2.75rem;
		line-height: 1.4;
		letter-spacing: 0.01em;
	}

	.or-divider {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0.75rem 0;
		position: relative;
		gap: 1rem;
	}

	.or-divider span {
		background: rgba(245, 241, 235, 0.9);
		backdrop-filter: blur(5px);
		padding: 0.5rem 1rem;
		font-weight: 500;
		font-size: 0.85rem;
		letter-spacing: 0.05em;
		color: var(--text-light);
		border: 1px solid var(--earth-medium);
		border-radius: 1rem;
		font-style: italic;
	}

	.divider-line {
		opacity: 0.6;
	}

	.demo-option {
		padding: 1rem !important;
		background: linear-gradient(135deg, rgba(193, 154, 107, 0.1) 0%, rgba(245, 241, 235, 0.7) 100%);
	}

	.demo-option.selected {
		background: linear-gradient(135deg, rgba(193, 154, 107, 0.2) 0%, rgba(245, 241, 235, 0.9) 100%);
		border-color: var(--clay);
	}

	.demo-content {
		flex-direction: row !important;
		align-items: center !important;
		gap: 1rem !important;
	}

	.demo-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-shrink: 0;
	}

	.demo-icon {
		color: var(--text-primary);
		opacity: 0.8;
	}

	.demo-content strong {
		font-size: 0.95rem !important;
	}

	.demo-content small {
		margin-left: 0 !important;
		font-size: 0.85rem !important;
	}

	.demo-link {
		color: var(--text-primary);
		font-weight: 600;
		text-decoration: none;
		padding: 0.25rem 0.75rem;
		background: rgba(193, 154, 107, 0.2);
		border: 1px solid var(--clay);
		border-radius: 1rem;
		transition: all 0.3s ease;
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		box-shadow:
			0 2px 8px rgba(139, 111, 71, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.6);
		letter-spacing: 0.02em;
		backdrop-filter: blur(5px);
	}

	.demo-link:hover {
		transform: translateY(-1px);
		box-shadow:
			0 4px 12px rgba(139, 111, 71, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
		background: rgba(193, 154, 107, 0.3);
		border-color: var(--mocha-mousse);
	}

	@media (max-width: 600px) {
		.transcribe-options {
			padding: 1.5rem;
		}

		.option-group {
			gap: 0.875rem;
		}

		.option-label {
			padding: 1rem;
			flex-direction: column;
			align-items: flex-start;
			gap: 0.75rem;
		}

		.option-content small {
			margin-left: 0;
		}

		.demo-content {
			flex-direction: column !important;
			align-items: flex-start !important;
			gap: 0.5rem !important;
		}

		.options-decoration {
			display: none;
		}
	}
</style>
