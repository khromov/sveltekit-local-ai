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
	<div class="options-decoration"></div>
	<h3>
		<span class="title-icon">🎵</span>
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
					<span class="option-icon">📁</span>
					<strong>Local File</strong>
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
					<span class="option-icon">🎙️</span>
					<strong>Record Audio</strong>
				</div>
				<small>Record audio directly from your microphone</small>
			</div>
		</label>

		<div class="or-divider">
			<span>OR</span>
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
				<strong>Demo File</strong>
				<small><a href="/rich.mp3" target="_blank">Listen →</a></small>
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
		background: rgba(255, 255, 255, 0.95);
		border: 1px solid rgba(82, 121, 82, 0.2);
		padding: 2.5rem;
		box-shadow: 0 16px 64px rgba(82, 121, 82, 0.15);
		margin-bottom: 1.5rem;
		position: relative;
		animation: gentle-slide-in 0.6s ease-out;
		animation-delay: 0.1s;
		animation-fill-mode: both;
		border-radius: 20px;
		backdrop-filter: blur(16px);
	}

	@keyframes gentle-slide-in {
		from {
			transform: translateY(20px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.options-decoration {
		position: absolute;
		top: -15px;
		left: -15px;
		right: -15px;
		bottom: -15px;
		background: radial-gradient(
			circle at 30% 70%,
			rgba(82, 121, 82, 0.08) 0%,
			rgba(107, 142, 107, 0.04) 50%,
			transparent 100%
		);
		z-index: -1;
		opacity: 0.6;
		border-radius: 30px;
	}

	.transcribe-options h3 {
		margin-top: 0;
		margin-bottom: 2rem;
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.75rem;
		color: #2e4a2e;
		text-align: center;
		letter-spacing: 0.01em;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		background: linear-gradient(135deg, rgba(82, 121, 82, 0.1) 0%, rgba(107, 142, 107, 0.08) 100%);
		padding: 1rem 2rem;
		border: 1px solid rgba(82, 121, 82, 0.2);
		box-shadow: 0 8px 32px rgba(82, 121, 82, 0.1);
		width: fit-content;
		margin-left: auto;
		margin-right: auto;
		text-transform: none;
		border-radius: 16px;
		backdrop-filter: blur(8px);
		font-weight: 600;
	}

	.title-icon {
		font-size: 1.5rem;
		filter: drop-shadow(0 2px 4px rgba(82, 121, 82, 0.3));
	}

	.option-group {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1.25rem;
	}

	.option-label {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		padding: 1.5rem;
		border: 1px solid rgba(82, 121, 82, 0.2);
		background: rgba(255, 255, 255, 0.9);
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 4px 16px rgba(82, 121, 82, 0.08);
		position: relative;
		border-radius: 16px;
		backdrop-filter: blur(8px);
	}

	.option-label:nth-child(2) {
		/* Remove individual transforms */
	}

	.option-label:hover {
		transform: translateY(-3px);
		box-shadow: 0 8px 32px rgba(82, 121, 82, 0.15);
		background: rgba(255, 255, 255, 1);
		border-color: rgba(82, 121, 82, 0.3);
	}

	.option-label.selected {
		background: rgba(82, 121, 82, 0.1);
		transform: translateY(-3px);
		box-shadow: 0 12px 48px rgba(82, 121, 82, 0.2);
		border-color: rgba(82, 121, 82, 0.4);
	}

	.option-label input[type='radio'] {
		width: 18px;
		height: 18px;
		margin: 0;
		accent-color: #527952;
		cursor: pointer;
		border: 1px solid rgba(82, 121, 82, 0.3);
	}

	.option-content {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
		flex: 1;
	}

	.option-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.option-icon {
		font-size: 1.5rem;
	}

	.option-content strong {
		font-size: 1.125rem;
		color: #2e4a2e;
		text-transform: none;
		letter-spacing: 0.01em;
		font-weight: 600;
	}

	.option-content small {
		font-size: 0.9rem;
		color: rgba(82, 121, 82, 0.7);
		font-weight: 400;
		margin-left: 2rem;
		line-height: 1.4;
	}

	.option-content small a {
		color: #527952;
		font-weight: 500;
		text-decoration: none;
		padding: 0.25rem 0.75rem;
		background: rgba(82, 121, 82, 0.1);
		border: 1px solid rgba(82, 121, 82, 0.2);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		display: inline-block;
		box-shadow: 0 2px 8px rgba(82, 121, 82, 0.1);
		border-radius: 8px;
		backdrop-filter: blur(4px);
	}

	.option-content small a:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 16px rgba(82, 121, 82, 0.2);
		background: rgba(82, 121, 82, 0.15);
		border-color: rgba(82, 121, 82, 0.3);
		color: #2e4a2e;
	}

	.or-divider {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0.5rem 0;
		position: relative;
	}

	.or-divider span {
		background: rgba(255, 255, 255, 0.9);
		padding: 0 1.25rem;
		font-weight: 500;
		font-size: 0.8rem;
		text-transform: none;
		letter-spacing: 0.02em;
		color: rgba(82, 121, 82, 0.6);
		position: relative;
		border-radius: 12px;
		border: 1px solid rgba(82, 121, 82, 0.15);
		backdrop-filter: blur(8px);
	}

	.or-divider::before {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		height: 1px;
		background: rgba(82, 121, 82, 0.2);
		top: 50%;
		transform: translateY(-50%);
	}

	.demo-option {
		padding: 0.75rem 1rem !important;
	}

	.demo-option .option-content {
		flex-direction: row !important;
		align-items: center;
		gap: 0.5rem !important;
	}

	.demo-option strong {
		font-size: 1rem !important;
	}

	.demo-option small {
		margin-left: 0 !important;
		font-size: 0.875rem !important;
	}

	@media (max-width: 600px) {
		.transcribe-options {
			padding: 1.25rem;
		}

		.option-group {
			gap: 0.75rem;
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
	}
</style>
