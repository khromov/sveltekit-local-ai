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
	<!-- Nature-inspired animation -->
	<svg class="transcribing-decoration" width="100" height="100" viewBox="0 0 100 100">
		<g opacity="0.3">
			<!-- Sound waves -->
			<circle cx="50" cy="50" r="10" fill="var(--forest-primary)" opacity="0.5" />
			{#if progress > 0}
				<circle
					cx="50"
					cy="50"
					r={20 + progress * 0.3}
					fill="none"
					stroke="var(--forest-primary)"
					stroke-width="1"
					opacity="0.3"
				/>
			{/if}
			{#if progress > 25}
				<circle
					cx="50"
					cy="50"
					r={30 + progress * 0.3}
					fill="none"
					stroke="var(--moss-green)"
					stroke-width="0.5"
					opacity="0.2"
				/>
			{/if}
			{#if progress > 50}
				<circle
					cx="50"
					cy="50"
					r={40 + progress * 0.3}
					fill="none"
					stroke="var(--sage-green)"
					stroke-width="0.5"
					opacity="0.15"
				/>
			{/if}
		</g>
	</svg>

	<h3>
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
			<circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5" />
			<path
				d="M7 10L10 7V13L13 10"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
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
			<!-- Nature decoration -->
			<svg class="segment-decoration" width="40" height="40" viewBox="0 0 40 40">
				<g opacity="0.2">
					<path
						d="M20,10 Q15,15 15,20 Q15,25 20,30 Q25,25 25,20 Q25,15 20,10"
						fill="currentColor"
					/>
				</g>
			</svg>
		</div>
	{/if}

	{#if isStuck}
		<div class="stuck-message">
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
				<circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" />
				<path d="M8 5V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
				<circle cx="8" cy="11" r="0.5" fill="currentColor" />
			</svg>
			Transcription seems stuck
			<button class="reload-link" onclick={onReload}>Reload Page →</button>
		</div>
	{:else}
		<div class="transcribing-message">
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
				<circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" />
				<path d="M8 4V8L11 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
			</svg>
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
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.95) 0%,
			rgba(250, 248, 243, 0.98) 100%
		);
		border: 1px solid rgba(139, 111, 71, 0.15);
		box-shadow:
			0 8px 32px rgba(46, 90, 61, 0.1),
			0 2px 8px rgba(139, 111, 71, 0.08);
		margin: 1.5rem 0;
		animation: fadeIn 0.5s ease-out;
		position: relative;
		border-radius: 20px;
		backdrop-filter: blur(10px);
		overflow: hidden;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.transcribing-decoration {
		color: var(--forest-primary);
		margin-bottom: 1rem;
		animation: pulse-waves 2s ease-in-out infinite;
	}

	@keyframes pulse-waves {
		0%,
		100% {
			transform: scale(1);
			opacity: 0.3;
		}
		50% {
			transform: scale(1.05);
			opacity: 0.4;
		}
	}

	.transcribing h3 {
		margin-top: 0;
		margin-bottom: 1rem;
		font-size: 1.75rem;
		color: var(--forest-primary);
		letter-spacing: -0.01em;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 600;
	}

	.progress-percentage {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--forest-light);
		margin-bottom: 1.5rem;
		background: linear-gradient(
			135deg,
			rgba(136, 179, 120, 0.15) 0%,
			rgba(168, 185, 159, 0.1) 100%
		);
		padding: 0.5rem 1.5rem;
		border: 1px solid rgba(46, 90, 61, 0.2);
		border-radius: 10px;
		letter-spacing: 0.02em;
	}

	.progress-wrapper {
		width: 100%;
		max-width: 400px;
		margin-bottom: 1.5rem;
	}

	.segment-preview {
		margin: 1.5rem 0;
		padding: 1.5rem;
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(250, 248, 243, 0.9) 100%);
		border: 1px solid rgba(139, 111, 71, 0.15);
		box-shadow:
			0 2px 12px rgba(46, 90, 61, 0.06),
			inset 0 1px 0 rgba(255, 255, 255, 0.5);
		width: 100%;
		max-width: 500px;
		animation: slideIn 0.3s ease-out;
		position: relative;
		border-radius: 12px;
	}

	@keyframes slideIn {
		from {
			transform: translateY(10px);
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
		color: var(--sage-green);
		animation: gentle-rotate 8s linear infinite;
	}

	@keyframes gentle-rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.segment-preview h4 {
		text-align: center;
		margin: 0 0 0.75rem 0;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.segment-preview p {
		margin: 0;
		font-size: 1rem;
		line-height: 1.6;
		color: var(--text-primary);
		font-style: italic;
		font-weight: 400;
		padding: 0.75rem;
		background: linear-gradient(
			135deg,
			rgba(136, 179, 120, 0.05) 0%,
			rgba(168, 185, 159, 0.03) 100%
		);
		border: 1px dashed rgba(139, 111, 71, 0.15);
		border-radius: 8px;
		letter-spacing: 0.01em;
	}

	.transcribing-message {
		margin-top: 1rem;
		color: var(--text-secondary);
		font-weight: 500;
		text-align: center;
		background: linear-gradient(
			135deg,
			rgba(136, 179, 120, 0.08) 0%,
			rgba(168, 185, 159, 0.05) 100%
		);
		padding: 0.75rem 1.25rem;
		border: 1px solid rgba(46, 90, 61, 0.15);
		border-radius: 10px;
		font-size: 0.875rem;
		letter-spacing: 0.02em;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.stuck-message {
		margin-top: 1rem;
		color: var(--earth-soil);
		font-weight: 600;
		text-align: center;
		background: linear-gradient(135deg, rgba(212, 165, 116, 0.15) 0%, rgba(139, 111, 71, 0.1) 100%);
		padding: 1rem 1.5rem;
		border: 1px solid rgba(212, 165, 116, 0.3);
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		animation: gentle-shake 0.5s ease-in-out;
		font-size: 0.9375rem;
		letter-spacing: 0.01em;
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

	.reload-link {
		background: linear-gradient(135deg, var(--earth-clay) 0%, var(--earth-soil) 100%);
		border: 1px solid rgba(139, 111, 71, 0.2);
		color: white;
		padding: 0.5rem 1rem;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 600;
		border-radius: 8px;
		box-shadow:
			0 2px 8px rgba(139, 111, 71, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.1);
		letter-spacing: 0.02em;
		font-family: 'Space Grotesk', monospace;
		transition: all 0.3s ease;
	}

	.reload-link:hover {
		transform: translateY(-2px);
		box-shadow:
			0 4px 12px rgba(139, 111, 71, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.15);
		background: linear-gradient(135deg, var(--leaf-gold) 0%, var(--earth-clay) 100%);
	}

	@media (max-width: 600px) {
		.transcribing {
			padding: 1.75rem 1.25rem;
		}

		.transcribing h3 {
			font-size: 1.5rem;
		}

		.segment-preview {
			max-width: none;
		}

		.transcribing-message,
		.stuck-message {
			font-size: 0.8125rem;
			padding: 0.625rem 1rem;
		}

		.transcribing-decoration {
			width: 80px;
			height: 80px;
		}
	}
</style>
