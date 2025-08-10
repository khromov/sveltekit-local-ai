<script lang="ts">
	import ProgressBar from '../ProgressBar.svelte';

	interface Props {
		progress: number;
		previousProgress?: number;
		currentSegment?: string;
		isStuck?: boolean;
		onReload?: () => void;
	}

	let {
		progress = 0,
		previousProgress = 0,
		currentSegment = '',
		isStuck = false,
		onReload
	}: Props = $props();
</script>

<div class="transcribing">
	<div class="transcribing-decoration"></div>
	<h3>
		<span class="title-icon">🎧</span>
		Transcribing Audio
	</h3>
	<p class="progress-percentage">{progress}% Complete</p>

	<div class="progress-wrapper">
		<ProgressBar {progress} {previousProgress} />
	</div>

	{#if currentSegment}
		<div class="segment-preview">
			<h4>Current Segment</h4>
			<p>"{currentSegment}"</p>
			<div class="segment-decoration"></div>
		</div>
	{/if}

	{#if isStuck}
		<div class="stuck-message">
			<span class="warning-icon">⚠️</span>
			Transcription seems stuck
			<button class="reload-link" onclick={onReload}> Reload Page → </button>
		</div>
	{:else}
		<div class="transcribing-message">
			<span class="pulse-icon">⚡</span>
			Keep this tab active during transcription
		</div>
	{/if}
</div>

<style>
	.transcribing {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 3rem;
		background: rgba(255, 255, 255, 0.95);
		border: 1px solid rgba(82, 121, 82, 0.2);
		box-shadow: 0 16px 64px rgba(82, 121, 82, 0.15);
		margin: 1.5rem 0;
		animation: gentle-fade-in 0.8s ease-out;
		position: relative;
		border-radius: 20px;
		backdrop-filter: blur(16px);
	}

	@keyframes gentle-fade-in {
		from {
			transform: translateY(20px) scale(0.95);
			opacity: 0;
		}
		to {
			transform: translateY(0) scale(1);
			opacity: 1;
		}
	}

	.transcribing-decoration {
		position: absolute;
		top: -20px;
		left: -20px;
		width: 120px;
		height: 120px;
		background: radial-gradient(
			circle,
			rgba(82, 121, 82, 0.1) 0%,
			rgba(107, 142, 107, 0.05) 70%,
			transparent 100%
		);
		border: 1px solid rgba(82, 121, 82, 0.15);
		border-radius: 50%;
		opacity: 0.6;
		animation: gentle-spin 20s linear infinite;
	}

	@keyframes gentle-spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.transcribing h3 {
		margin-top: 0;
		margin-bottom: 1.5rem;
		font-family: 'Space Grotesk', sans-serif;
		font-size: 2rem;
		color: #2e4a2e;
		letter-spacing: 0.01em;
		display: flex;
		align-items: center;
		gap: 1rem;
		background: linear-gradient(135deg, rgba(82, 121, 82, 0.1) 0%, rgba(107, 142, 107, 0.08) 100%);
		padding: 1rem 2.5rem;
		border: 1px solid rgba(82, 121, 82, 0.2);
		box-shadow: 0 8px 32px rgba(82, 121, 82, 0.15);
		width: fit-content;
		text-transform: none;
		border-radius: 16px;
		backdrop-filter: blur(8px);
		font-weight: 600;
	}

	.title-icon {
		font-size: 1.75rem;
		animation: gentle-bounce 3s ease-in-out infinite;
		filter: drop-shadow(0 2px 8px rgba(82, 121, 82, 0.3));
	}

	@keyframes gentle-bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-3px);
		}
	}

	.progress-percentage {
		font-size: 1.25rem;
		font-weight: 500;
		color: #527952;
		margin-bottom: 2rem;
		background: rgba(82, 121, 82, 0.1);
		padding: 0.75rem 1.75rem;
		border: 1px solid rgba(82, 121, 82, 0.2);
		box-shadow: 0 4px 16px rgba(82, 121, 82, 0.1);
		animation: gentle-pulse-progress 3s ease-in-out infinite;
		text-transform: none;
		border-radius: 12px;
		backdrop-filter: blur(8px);
	}

	@keyframes gentle-pulse-progress {
		0%,
		100% {
			transform: scale(1);
			opacity: 1;
		}
		50% {
			transform: scale(1.02);
			opacity: 0.9;
		}
	}

	.progress-wrapper {
		width: 100%;
		max-width: 400px;
		margin-bottom: 1.5rem;
	}

	.segment-preview {
		margin: 2rem 0;
		padding: 2rem;
		background: rgba(255, 255, 255, 0.9);
		border: 1px solid rgba(82, 121, 82, 0.2);
		box-shadow: 0 8px 32px rgba(82, 121, 82, 0.12);
		width: 100%;
		max-width: 500px;
		animation: gentle-slide-in 0.5s ease-out;
		position: relative;
		border-radius: 16px;
		backdrop-filter: blur(8px);
	}

	@keyframes gentle-slide-in {
		from {
			transform: translateY(15px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.segment-decoration {
		position: absolute;
		top: -10px;
		right: -10px;
		width: 40px;
		height: 40px;
		background: radial-gradient(circle, rgba(82, 121, 82, 0.15) 0%, rgba(107, 142, 107, 0.08) 100%);
		border: 1px solid rgba(82, 121, 82, 0.2);
		border-radius: 50%;
		opacity: 0.6;
	}

	.segment-preview h4 {
		text-align: center;
		margin: 0 0 1rem 0;
		font-size: 1rem;
		font-weight: 500;
		color: #527952;
		text-transform: none;
		letter-spacing: 0.01em;
		background: rgba(82, 121, 82, 0.1);
		padding: 0.5rem 1.25rem;
		border: 1px solid rgba(82, 121, 82, 0.2);
		display: inline-block;
		box-shadow: 0 2px 8px rgba(82, 121, 82, 0.1);
		border-radius: 12px;
		backdrop-filter: blur(4px);
	}

	.segment-preview p {
		margin: 0;
		font-size: 1rem;
		line-height: 1.6;
		color: #2e4a2e;
		font-style: italic;
		font-weight: 400;
		padding: 1rem;
		background: rgba(82, 121, 82, 0.05);
		border: 1px dashed rgba(82, 121, 82, 0.2);
		border-radius: 12px;
	}

	.transcribing-message {
		margin-top: 1.5rem;
		color: #2e4a2e;
		font-weight: 500;
		text-align: center;
		background: rgba(82, 121, 82, 0.1);
		padding: 1.25rem 2rem;
		border: 1px solid rgba(82, 121, 82, 0.2);
		box-shadow: 0 4px 16px rgba(82, 121, 82, 0.1);
		text-transform: none;
		letter-spacing: 0.01em;
		display: flex;
		align-items: center;
		gap: 1rem;
		justify-content: center;
		border-radius: 12px;
		backdrop-filter: blur(8px);
		line-height: 1.5;
	}

	.pulse-icon {
		font-size: 1.25rem;
		animation: gentle-flash 2s ease-in-out infinite;
		filter: drop-shadow(0 1px 3px rgba(82, 121, 82, 0.3));
	}

	@keyframes gentle-flash {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.6;
		}
	}

	.stuck-message {
		margin-top: 1.5rem;
		color: #c85a54;
		font-weight: 500;
		text-align: center;
		background: rgba(255, 240, 240, 0.9);
		padding: 1.25rem 2rem;
		border: 1px solid rgba(200, 90, 84, 0.3);
		box-shadow: 0 8px 32px rgba(200, 90, 84, 0.15);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		animation: gentle-shake 0.5s ease-in-out;
		text-transform: none;
		border-radius: 12px;
		backdrop-filter: blur(8px);
	}

	@keyframes gentle-shake {
		0%,
		100% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(-3px);
		}
		75% {
			transform: translateX(3px);
		}
	}

	.warning-icon {
		font-size: 1.75rem;
		filter: drop-shadow(0 2px 4px rgba(200, 90, 84, 0.3));
	}

	.reload-link {
		background: linear-gradient(135deg, #527952 0%, #6b8e6b 100%);
		border: 1px solid rgba(82, 121, 82, 0.3);
		color: #ffffff;
		padding: 0.75rem 1.5rem;
		cursor: pointer;
		font-size: 0.9rem;
		font-weight: 500;
		box-shadow: 0 4px 16px rgba(82, 121, 82, 0.2);
		text-transform: none;
		letter-spacing: 0.01em;
		font-family: 'Space Grotesk', monospace;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		border-radius: 12px;
	}

	.reload-link:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 32px rgba(82, 121, 82, 0.3);
		background: linear-gradient(135deg, #6b8e6b 0%, #7da47d 100%);
	}

	@media (max-width: 600px) {
		.transcribing {
			padding: 1.75rem;
		}

		.transcribing h3 {
			font-size: 2rem;
		}

		.segment-preview {
			max-width: none;
		}

		.transcribing-message,
		.stuck-message {
			font-size: 0.875rem;
			padding: 0.875rem 1rem;
		}
	}
</style>
