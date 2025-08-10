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
		<svg viewBox="0 0 100 20" width="80" height="16">
			<path
				d="M5,10 Q25,5 50,10 T95,10"
				stroke="#5a8c69"
				stroke-width="2"
				opacity="0.6"
				fill="none"
			/>
			<circle cx="20" cy="8" r="2" fill="#4a7c59" opacity="0.5" />
			<circle cx="50" cy="12" r="1.5" fill="#3a6e4a" opacity="0.4" />
			<circle cx="80" cy="9" r="2.5" fill="#5a8c69" opacity="0.5" />
		</svg>
	</div>
	<h3>
		<svg viewBox="0 0 24 24" width="24" height="24" class="title-icon">
			<path
				d="M12,2 A10,10 0 0,1 22,12 A10,10 0 0,1 12,22 A10,10 0 0,1 2,12 A10,10 0 0,1 12,2 Z"
				fill="#5a8c69"
				opacity="0.7"
			/>
			<path d="M8,8 L16,12 L8,16 Z" fill="#faf8f5" />
		</svg>
		Choose Natural Audio Source
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
						<rect x="4" y="6" width="12" height="10" rx="2" fill="#4a7c59" opacity="0.7" />
						<path
							d="M7,4 L13,4 M7,2 L13,2"
							stroke="#3a6e4a"
							stroke-width="1.5"
							stroke-linecap="round"
						/>
						<circle cx="8" cy="10" r="1" fill="#faf8f5" />
						<circle cx="12" cy="10" r="1" fill="#faf8f5" />
					</svg>
					<strong>Local Grove</strong>
				</div>
				<small>Select an audio file from your natural collection (.mp3, .wav, .m4a)</small>
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
						<ellipse cx="10" cy="8" rx="3" ry="5" fill="#8b5a3c" />
						<path d="M8,2 Q10,1 12,2 Q10,3 8,2" fill="#6b4c3a" />
						<path d="M6,8 Q6,14 10,14 Q14,14 14,8" stroke="#4a7c59" stroke-width="2" fill="none" />
						<line x1="10" y1="14" x2="10" y2="18" stroke="#8b5a3c" stroke-width="2" />
						<path d="M7,18 L13,18" stroke="#8b5a3c" stroke-width="2" />
					</svg>
					<strong>Natural Recording</strong>
				</div>
				<small>Capture audio directly from your natural surroundings</small>
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
				<strong>Nature Sample</strong>
				<small><a href="/rich.mp3" target="_blank">Listen to the Forest →</a></small>
			</div>
		</label>
	</div>

	{#if transcribeMode === 'upload'}
		<FileUpload bind:selectedFile {onFileSelect} {disabled} />
	{:else if transcribeMode === 'record'}
		<AudioRecorder bind:transcribeMode bind:selectedFile {onFileSelect} {onModeChange} {disabled} />
	{/if}
</div>

<style>
	.transcribe-options {
		background: rgba(250, 248, 245, 0.95);
		border: 1px solid rgba(74, 124, 89, 0.2);
		padding: 2rem;
		box-shadow:
			0 12px 28px rgba(45, 93, 58, 0.1),
			0 4px 8px rgba(45, 93, 58, 0.05),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
		margin-bottom: 1.5rem;
		position: relative;
		border-radius: 20px;
		animation: naturalFadeIn 0.8s ease-out;
		animation-delay: 0.1s;
		animation-fill-mode: both;
		backdrop-filter: blur(8px);
		overflow: hidden;
	}

	@keyframes naturalFadeIn {
		from {
			transform: translateY(20px) scale(0.95);
			opacity: 0;
		}
		to {
			transform: translateY(0) scale(1);
			opacity: 1;
		}
	}

	.options-decoration {
		position: absolute;
		top: 1rem;
		left: 1rem;
		right: 1rem;
		height: 16px;
		z-index: 0;
		opacity: 0.6;
		animation: gentleWave 6s ease-in-out infinite;
	}

	.transcribe-options h3 {
		margin-top: 0;
		margin-bottom: 2rem;
		font-family: 'Caveat', cursive;
		font-size: 1.75rem;
		color: #3a6e4a;
		text-align: center;
		letter-spacing: 0.5px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		background: rgba(90, 140, 105, 0.1);
		padding: 0.75rem 2rem;
		border: 1px solid rgba(74, 124, 89, 0.3);
		box-shadow:
			0 8px 20px rgba(58, 110, 74, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.7);
		border-radius: 18px;
		width: fit-content;
		margin-left: auto;
		margin-right: auto;
		font-weight: 700;
		backdrop-filter: blur(5px);
		position: relative;
		z-index: 1;
	}

	.title-icon {
		animation: gentleRotate 8s ease-in-out infinite;
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
		padding: 1.25rem 1.5rem;
		border: 1px solid rgba(74, 124, 89, 0.2);
		background: rgba(250, 248, 245, 0.9);
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow:
			0 4px 12px rgba(58, 110, 74, 0.08),
			inset 0 1px 0 rgba(255, 255, 255, 0.6);
		position: relative;
		border-radius: 16px;
		backdrop-filter: blur(5px);
	}

	.option-label:hover {
		transform: translateY(-2px);
		box-shadow:
			0 6px 16px rgba(58, 110, 74, 0.12),
			inset 0 2px 0 rgba(255, 255, 255, 0.8);
		border-color: rgba(90, 140, 105, 0.3);
	}

	.option-label.selected {
		background: linear-gradient(135deg, rgba(90, 140, 105, 0.2) 0%, rgba(74, 124, 89, 0.15) 100%);
		transform: translateY(-1px);
		box-shadow:
			0 8px 20px rgba(58, 110, 74, 0.15),
			inset 0 2px 0 rgba(255, 255, 255, 0.9);
		border-color: rgba(90, 140, 105, 0.4);
	}

	.option-label input[type='radio'] {
		width: 18px;
		height: 18px;
		margin: 0;
		accent-color: #5a8c69;
		cursor: pointer;
		border: 1px solid rgba(74, 124, 89, 0.3);
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
		opacity: 0.8;
	}

	.option-content strong {
		font-size: 1.1rem;
		color: #4a7c59;
		letter-spacing: 0.3px;
		font-family: 'Caveat', cursive;
		font-weight: 600;
	}

	.option-content small {
		font-size: 0.875rem;
		color: rgba(107, 76, 58, 0.8);
		font-weight: 400;
		margin-left: 1.5rem;
		font-family: 'Inter', sans-serif;
		line-height: 1.4;
	}

	.option-content small a {
		color: #3a6e4a;
		font-weight: 600;
		text-decoration: none;
		padding: 0.25rem 0.75rem;
		background: rgba(90, 140, 105, 0.15);
		border: 1px solid rgba(74, 124, 89, 0.3);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		display: inline-block;
		border-radius: 12px;
		box-shadow:
			0 2px 6px rgba(58, 110, 74, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.5);
		backdrop-filter: blur(3px);
	}

	.option-content small a:hover {
		transform: translateY(-1px);
		box-shadow:
			0 4px 12px rgba(58, 110, 74, 0.15),
			inset 0 2px 0 rgba(255, 255, 255, 0.7);
		background: linear-gradient(135deg, rgba(90, 140, 105, 0.25) 0%, rgba(74, 124, 89, 0.2) 100%);
		border-color: rgba(90, 140, 105, 0.4);
		color: #2d5d3a;
	}

	.or-divider {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 1rem 0;
		position: relative;
	}

	.or-divider span {
		background: rgba(250, 248, 245, 0.9);
		padding: 0.5rem 1.5rem;
		font-weight: 600;
		font-size: 0.8rem;
		letter-spacing: 0.5px;
		color: rgba(107, 76, 58, 0.7);
		position: relative;
		font-family: 'Caveat', cursive;
		border: 1px solid rgba(74, 124, 89, 0.15);
		border-radius: 20px;
		backdrop-filter: blur(3px);
	}

	.or-divider::before {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(
			90deg,
			transparent 0%,
			rgba(74, 124, 89, 0.2) 50%,
			transparent 100%
		);
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

	@keyframes gentleWave {
		0%,
		100% {
			transform: translateX(0);
			opacity: 0.6;
		}
		50% {
			transform: translateX(10px);
			opacity: 0.8;
		}
	}

	@keyframes gentleRotate {
		0%,
		100% {
			transform: rotate(0deg);
		}
		25% {
			transform: rotate(5deg);
		}
		75% {
			transform: rotate(-5deg);
		}
	}

	@media (max-width: 600px) {
		.transcribe-options {
			padding: 1.5rem 1.25rem;
		}

		.transcribe-options h3 {
			font-size: 1.5rem;
			padding: 0.5rem 1.5rem;
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
