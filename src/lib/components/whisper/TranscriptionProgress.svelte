<script lang="ts">
	import ProgressBar from '../ProgressBar.svelte';
	import HeadphonesIcon from 'virtual:icons/lucide/headphones';
	import ZapIcon from 'virtual:icons/lucide/zap';
	import AlertTriangleIcon from 'virtual:icons/lucide/alert-triangle';

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
		<span class="title-icon"><HeadphonesIcon /></span>
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
			<span class="warning-icon"><AlertTriangleIcon /></span>
			Transcription seems stuck
			<button class="reload-link" onclick={onReload}> Reload Page → </button>
		</div>
	{:else}
		<div class="transcribing-message">
			<span class="pulse-icon"><ZapIcon /></span>
			Keep this tab active during transcription
		</div>
	{/if}
</div>

<style>
	.transcribing {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2.5rem;
		background: #fff;
		border: 4px solid #000;
		box-shadow: 10px 10px 0 #000;
		margin: 1.5rem 0;
		animation: wobbleIn 0.5s ease-out;
		position: relative;
		transform: rotate(-1deg);
	}

	@keyframes wobbleIn {
		from {
			transform: scale(0.9) rotate(-3deg);
			opacity: 0;
		}
		to {
			transform: scale(1) rotate(-1deg);
			opacity: 1;
		}
	}

	.transcribing-decoration {
		position: absolute;
		top: -10px;
		left: -10px;
		width: 100px;
		height: 100px;
		background: repeating-linear-gradient(
			45deg,
			#98fb98,
			#98fb98 10px,
			transparent 10px,
			transparent 20px
		);
		border: 3px solid #000;
		border-radius: 50%;
		opacity: 0.3;
		animation: spin 10s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.transcribing h3 {
		margin-top: 0;
		margin-bottom: 1rem;
		font-family: 'Bebas Neue', sans-serif;
		font-size: 2.5rem;
		color: #000;
		letter-spacing: 3px;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		background: #ffd93d;
		padding: 0.5rem 2rem;
		border: 3px solid #000;
		box-shadow: 6px 6px 0 #000;
		transform: rotate(-2deg);
		text-transform: uppercase;
	}

	.title-icon {
		font-size: 2rem;
		display: flex;
		align-items: center;
		color: #000;
		animation: bounce 2s ease-in-out infinite;
	}

	.title-icon :global(svg) {
		width: 2rem;
		height: 2rem;
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-5px);
		}
	}

	.progress-percentage {
		font-size: 1.5rem;
		font-weight: 700;
		color: #000;
		margin-bottom: 1.5rem;
		background: #98fb98;
		padding: 0.5rem 1.5rem;
		border: 3px solid #000;
		box-shadow: 5px 5px 0 #000;
		transform: rotate(1deg);
		animation: pulse 2s ease-in-out infinite;
		text-transform: uppercase;
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1) rotate(1deg);
		}
		50% {
			transform: scale(1.05) rotate(1deg);
		}
	}

	.progress-wrapper {
		width: 100%;
		max-width: 400px;
		margin-bottom: 1.5rem;
	}

	.segment-preview {
		margin: 1.5rem 0;
		padding: 1.5rem;
		background: #fff;
		border: 3px solid #000;
		box-shadow: 6px 6px 0 #000;
		width: 100%;
		max-width: 500px;
		animation: slideIn 0.3s ease-out;
		position: relative;
		transform: rotate(0.5deg);
	}

	@keyframes slideIn {
		from {
			transform: translateY(10px) rotate(0.5deg);
			opacity: 0;
		}
		to {
			transform: translateY(0) rotate(0.5deg);
			opacity: 1;
		}
	}

	.segment-decoration {
		position: absolute;
		top: -8px;
		right: -8px;
		width: 50px;
		height: 50px;
		background: #ff69b4;
		border: 2px solid #000;
		border-radius: 30% 70% 70% 30% / 60% 40% 60% 40%;
		opacity: 0.4;
		transform: rotate(-45deg);
	}

	.segment-preview h4 {
		text-align: center;
		margin: 0 0 0.75rem 0;
		font-size: 1rem;
		font-weight: 700;
		color: #000;
		text-transform: uppercase;
		letter-spacing: 2px;
		background: #ffd93d;
		padding: 4px 12px;
		border: 2px solid #000;
		display: inline-block;
		box-shadow: 3px 3px 0 #000;
	}

	.segment-preview p {
		margin: 0;
		font-size: 1.0625rem;
		line-height: 1.5;
		color: #000;
		font-style: italic;
		font-weight: 500;
		padding: 0.75rem;
		background: linear-gradient(135deg, rgba(255, 217, 61, 0.1) 0%, rgba(152, 251, 152, 0.1) 100%);
		border: 2px dashed #000;
	}

	.transcribing-message {
		margin-top: 1rem;
		color: #000;
		font-weight: 700;
		text-align: center;
		background: #ffd93d;
		padding: 1rem 1.5rem;
		border: 3px solid #000;
		box-shadow: 5px 5px 0 #000;
		text-transform: uppercase;
		letter-spacing: 1px;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		transform: rotate(-0.5deg);
	}

	.pulse-icon {
		font-size: 1.5rem;
		display: flex;
		align-items: center;
		color: #000;
		animation: flash 1s ease-in-out infinite;
	}

	.pulse-icon :global(svg) {
		width: 1.5rem;
		height: 1.5rem;
	}

	@keyframes flash {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	.stuck-message {
		margin-top: 1rem;
		color: #000;
		font-weight: 700;
		text-align: center;
		background: #ff6b6b;
		padding: 1rem 1.5rem;
		border: 3px solid #000;
		box-shadow: 5px 5px 0 #000;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		animation: shake 0.5s ease-in-out;
		transform: rotate(-1deg);
		text-transform: uppercase;
	}

	@keyframes shake {
		0%,
		100% {
			transform: translateX(0) rotate(-1deg);
		}
		25% {
			transform: translateX(-5px) rotate(-1deg);
		}
		75% {
			transform: translateX(5px) rotate(-1deg);
		}
	}

	.warning-icon {
		font-size: 2rem;
		display: flex;
		align-items: center;
		color: #000;
	}

	.warning-icon :global(svg) {
		width: 2rem;
		height: 2rem;
	}

	.reload-link {
		background: #ffd93d;
		border: 3px solid #000;
		color: #000;
		padding: 0.5rem 1rem;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 700;
		box-shadow: 4px 4px 0 #000;
		text-transform: uppercase;
		letter-spacing: 1px;
		font-family: 'Space Grotesk', monospace;
		transition: all 0.15s;
	}

	.reload-link:hover {
		transform: translate(-2px, -2px);
		box-shadow: 6px 6px 0 #000;
		background: #98fb98;
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
