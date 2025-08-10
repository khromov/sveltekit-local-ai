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
	<!-- Nature decoration -->
	<svg
		class="options-decoration"
		width="100%"
		height="60"
		style="position: absolute; top: -30px; left: 0; opacity: 0.1; pointer-events: none;"
	>
		<defs>
			<pattern id="wave-pattern" x="0" y="0" width="200" height="60" patternUnits="userSpaceOnUse">
				<path
					d="M0,30 Q50,10 100,30 T200,30"
					stroke="currentColor"
					stroke-width="1"
					fill="none"
					opacity="0.5"
				/>
				<circle cx="50" cy="20" r="2" fill="currentColor" opacity="0.3" />
				<circle cx="150" cy="40" r="3" fill="currentColor" opacity="0.3" />
			</pattern>
		</defs>
		<rect width="100%" height="100%" fill="url(#wave-pattern)" />
	</svg>

	<h3>
		<svg
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
			style="display: inline-block; vertical-align: middle; margin-right: 6px;"
		>
			<path d="M10 2Q8 6 8 10Q8 14 10 18Q12 14 12 10Q12 6 10 2" fill="currentColor" opacity="0.3" />
			<circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5" />
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
					<svg class="option-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
						<path
							d="M13 2H6C5 2 4 3 4 4V20C4 21 5 22 6 22H18C19 22 20 21 20 20V9L13 2Z"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="M13 2V9H20"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<circle cx="12" cy="15" r="2" fill="currentColor" opacity="0.3" />
					</svg>
					<strong>Local File</strong>
				</div>
				<small>Upload an audio file from your device</small>
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
					<svg class="option-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
						<circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.3" />
						<circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.5" />
						<path
							d="M12 2V6M12 18V22M2 12H6M18 12H22"
							stroke="currentColor"
							stroke-width="1"
							opacity="0.3"
						/>
					</svg>
					<strong>Record Audio</strong>
				</div>
				<small>Record directly from your microphone</small>
			</div>
		</label>

		<div class="or-divider">
			<span>or try</span>
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
			<div class="option-content">
				<svg class="demo-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
					<polygon
						points="5,3 15,10 5,17"
						fill="currentColor"
						opacity="0.3"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linejoin="round"
					/>
				</svg>
				<strong>Demo File</strong>
				<a href="/rich.mp3" target="_blank" class="demo-link">Listen →</a>
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
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.95) 0%,
			rgba(250, 248, 243, 0.98) 100%
		);
		border: 1px solid rgba(139, 111, 71, 0.15);
		padding: 2rem;
		box-shadow:
			0 4px 20px rgba(46, 90, 61, 0.08),
			0 1px 3px rgba(139, 111, 71, 0.08);
		margin-bottom: 1.5rem;
		position: relative;
		border-radius: 16px;
		animation: fadeIn 0.4s ease-out;
		animation-delay: 0.1s;
		animation-fill-mode: both;
		backdrop-filter: blur(10px);
		overflow: visible;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(15px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.options-decoration {
		color: var(--forest-primary);
	}

	.transcribe-options h3 {
		margin-top: 0;
		margin-bottom: 1.5rem;
		font-size: 1.25rem;
		color: var(--forest-primary);
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		letter-spacing: -0.01em;
	}

	.option-group {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 1.25rem;
	}

	.option-label {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem 1.25rem;
		border: 1px solid rgba(139, 111, 71, 0.15);
		background: rgba(255, 255, 255, 0.6);
		cursor: pointer;
		transition: all 0.3s ease;
		border-radius: 12px;
		position: relative;
		backdrop-filter: blur(5px);
	}

	.option-label:hover {
		background: rgba(255, 255, 255, 0.9);
		border-color: rgba(46, 90, 61, 0.2);
		transform: translateX(2px);
		box-shadow: 0 2px 12px rgba(46, 90, 61, 0.08);
	}

	.option-label.selected {
		background: linear-gradient(
			135deg,
			rgba(136, 179, 120, 0.15) 0%,
			rgba(168, 185, 159, 0.1) 100%
		);
		border-color: rgba(46, 90, 61, 0.3);
		box-shadow:
			0 3px 16px rgba(46, 90, 61, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.5);
	}

	.option-label input[type='radio'] {
		width: 16px;
		height: 16px;
		margin: 0;
		accent-color: var(--forest-primary);
		cursor: pointer;
		flex-shrink: 0;
	}

	.option-content {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		flex: 1;
	}

	.option-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.option-icon {
		color: var(--forest-primary);
		opacity: 0.7;
		transition: opacity 0.3s ease;
	}

	.option-label:hover .option-icon,
	.option-label.selected .option-icon {
		opacity: 1;
	}

	.option-content strong {
		font-size: 0.975rem;
		color: var(--text-primary);
		font-weight: 600;
		letter-spacing: 0.01em;
	}

	.option-content small {
		font-size: 0.875rem;
		color: var(--text-secondary);
		font-weight: 400;
		margin-left: 2rem;
		letter-spacing: 0.01em;
	}

	.or-divider {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0.75rem 0;
		position: relative;
	}

	.or-divider span {
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.95) 0%,
			rgba(250, 248, 243, 0.98) 100%
		);
		padding: 0 1rem;
		font-weight: 500;
		font-size: 0.8125rem;
		text-transform: lowercase;
		letter-spacing: 0.05em;
		color: var(--text-muted);
		position: relative;
		z-index: 1;
	}

	.or-divider::before {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(139, 111, 71, 0.15), transparent);
		top: 50%;
		transform: translateY(-50%);
	}

	.demo-option {
		padding: 0.875rem 1.125rem;
		background: linear-gradient(
			135deg,
			rgba(212, 165, 116, 0.08) 0%,
			rgba(168, 185, 159, 0.05) 100%
		);
	}

	.demo-option .option-content {
		flex-direction: row;
		align-items: center;
		gap: 0.75rem;
	}

	.demo-icon {
		color: var(--forest-primary);
		opacity: 0.7;
	}

	.demo-option strong {
		font-size: 0.9375rem;
	}

	.demo-option small {
		margin-left: 0;
	}

	.demo-link {
		color: var(--forest-primary);
		font-weight: 600;
		text-decoration: none;
		padding: 0.25rem 0.625rem;
		background: linear-gradient(
			135deg,
			rgba(136, 179, 120, 0.15) 0%,
			rgba(168, 185, 159, 0.1) 100%
		);
		border: 1px solid rgba(46, 90, 61, 0.2);
		transition: all 0.3s ease;
		border-radius: 6px;
		font-size: 0.875rem;
		letter-spacing: 0.02em;
		margin-left: auto;
	}

	.demo-link:hover {
		background: linear-gradient(
			135deg,
			rgba(136, 179, 120, 0.25) 0%,
			rgba(168, 185, 159, 0.2) 100%
		);
		transform: translateX(2px);
		box-shadow: 0 2px 8px rgba(46, 90, 61, 0.1);
	}

	@media (max-width: 600px) {
		.transcribe-options {
			padding: 1.25rem;
		}

		.option-group {
			gap: 0.625rem;
		}

		.option-label {
			padding: 0.875rem 1rem;
			flex-direction: column;
			align-items: flex-start;
			gap: 0.75rem;
		}

		.option-content small {
			margin-left: 0;
			font-size: 0.8125rem;
		}

		.demo-option .option-content {
			flex-direction: column;
			align-items: flex-start;
		}

		.demo-link {
			margin-left: 0;
			margin-top: 0.5rem;
		}
	}
</style>
