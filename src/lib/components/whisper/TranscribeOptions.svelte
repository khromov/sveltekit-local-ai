<script lang="ts">
	import FileUpload from './FileUpload.svelte';

	interface Props {
		transcribeMode: 'demo' | 'upload';
		selectedFile: File | null;
		onFileSelect: (file: File) => void;
		onModeChange: (mode: 'demo' | 'upload') => void;
		disabled?: boolean;
	}

	let {
		transcribeMode = $bindable(),
		selectedFile = $bindable(),
		onFileSelect,
		onModeChange,
		disabled = false
	}: Props = $props();

	function handleModeChange(mode: 'demo' | 'upload') {
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

		<label class="option-label" class:selected={transcribeMode === 'demo'}>
			<input
				type="radio"
				name="transcribeMode"
				value="demo"
				checked={transcribeMode === 'demo'}
				onchange={() => handleModeChange('demo')}
				{disabled}
			/>
			<div class="option-content">
				<div class="option-header">
					<span class="option-icon">🎤</span>
					<strong>Demo Audio</strong>
				</div>
				<small>Use the JFK speech sample (<a href="/jfk.mp3" target="_blank">listen →</a>)</small>
			</div>
		</label>
	</div>

	{#if transcribeMode === 'upload'}
		<FileUpload bind:selectedFile {onFileSelect} {disabled} />
	{/if}
</div>

<style>
	.transcribe-options {
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

	.options-decoration {
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

	.transcribe-options h3 {
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

	.option-group {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1.25rem;
	}

	.option-label {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.25rem;
		border: 3px solid #000;
		background: #fff;
		cursor: pointer;
		transition: all 0.15s ease;
		box-shadow: 4px 4px 0 #000;
		position: relative;
		transform: rotate(-0.5deg);
	}

	.option-label:nth-child(2) {
		transform: rotate(0.5deg);
	}

	.option-label:hover {
		transform: translate(-2px, -2px) rotate(0deg);
		box-shadow: 6px 6px 0 #000;
		background: #fffacd;
	}

	.option-label.selected {
		background: #98fb98;
		transform: translate(-3px, -3px) rotate(0deg);
		box-shadow: 7px 7px 0 #000;
	}

	.option-label input[type='radio'] {
		width: 20px;
		height: 20px;
		margin: 0;
		accent-color: #000;
		cursor: pointer;
		border: 2px solid #000;
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
		color: #000;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.option-content small {
		font-size: 0.9375rem;
		color: #333;
		font-weight: 500;
		margin-left: 2rem;
	}

	.option-content small a {
		color: #000;
		font-weight: 700;
		text-decoration: none;
		padding: 2px 6px;
		background: #ffd93d;
		border: 2px solid #000;
		transition: all 0.15s;
		display: inline-block;
		box-shadow: 2px 2px 0 #000;
	}

	.option-content small a:hover {
		transform: translate(-1px, -1px);
		box-shadow: 3px 3px 0 #000;
		background: #ff69b4;
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
