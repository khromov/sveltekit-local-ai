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
	<h3>Choose Audio Source</h3>

	<div class="option-group">
		<label class="option-label">
			<input
				type="radio"
				name="transcribeMode"
				value="upload"
				checked={transcribeMode === 'upload'}
				onchange={() => handleModeChange('upload')}
				{disabled}
			/>
			<span class="option-content">
				<strong>Local File</strong>
				<small>Select an audio file from your device (.mp3, .wav, .m4a)</small>
			</span>
		</label>

		<label class="option-label">
			<input
				type="radio"
				name="transcribeMode"
				value="demo"
				checked={transcribeMode === 'demo'}
				onchange={() => handleModeChange('demo')}
				{disabled}
			/>
			<span class="option-content">
				<strong>Demo Audio</strong>
				<small>Use the included JFK speech sample (<a href="/jfk.mp3" target="_blank">listen to audio</a>)</small>
			</span>
		</label>
	</div>

	{#if transcribeMode === 'upload'}
		<FileUpload
			bind:selectedFile
			{onFileSelect}
			{disabled}
		/>
	{/if}
</div>

<style>
	.transcribe-options {
		background-color: white;
		border-radius: 16px;
		padding: 1.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		margin-bottom: 1rem;
	}

	.transcribe-options h3 {
		margin-top: 0;
		margin-bottom: 1rem;
		font-size: 1.25rem;
		font-weight: 600;
		color: #333;
		text-align: center;
	}

	.option-group {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.option-label {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.875rem;
		border: 2px solid #e1e1e1;
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.option-label:hover {
		border-color: #0071e3;
		background-color: #f8f9ff;
	}

	.option-label:has(input:checked) {
		border-color: #0071e3;
		background-color: #f0f4ff;
	}

	.option-label input[type='radio'] {
		margin: 0;
		accent-color: #0071e3;
	}

	.option-content {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.option-content strong {
		font-size: 1rem;
		color: #333;
	}

	.option-content small {
		font-size: 0.875rem;
		color: #666;
	}

	.option-content small a {
		color: #0071e3;
		text-decoration: none;
	}

	.option-content small a:hover {
		text-decoration: underline;
	}

	@media (max-width: 600px) {
		.transcribe-options {
			padding: 1rem;
		}

		.option-group {
			gap: 0.5rem;
		}

		.option-label {
			padding: 0.75rem;
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}
	}
</style>
