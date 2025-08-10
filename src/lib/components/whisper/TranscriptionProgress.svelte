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
	<div class="transcribing-decoration">
		<svg viewBox="0 0 100 100" width="100" height="100">
			<circle
				cx="50"
				cy="50"
				r="30"
				fill="none"
				stroke="var(--sage)"
				stroke-width="2"
				opacity="0.3"
			>
				<animate attributeName="r" values="30;35;30" dur="3s" repeatCount="indefinite" />
			</circle>
			<circle
				cx="50"
				cy="50"
				r="20"
				fill="none"
				stroke="var(--clay)"
				stroke-width="1.5"
				opacity="0.4"
			>
				<animate attributeName="r" values="20;15;20" dur="2s" repeatCount="indefinite" />
			</circle>
			<circle cx="50" cy="50" r="5" fill="var(--mocha-mousse)" opacity="0.6">
				<animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite" />
			</circle>
		</svg>
	</div>
	<h3>
		<svg viewBox="0 0 24 24" width="24" height="24" class="title-icon">
			<path
				d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"
				fill="currentColor"
				opacity="0.7"
			/>
			<path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="currentColor" stroke-width="1.5" fill="none" />
			<circle cx="12" cy="20" r="2" fill="currentColor" opacity="0.5" />
		</svg>
		Transcribing Audio
	</h3>
	<p class="progress-percentage">{progress}% Complete</p>

	<div class="progress-wrapper">
		<ProgressBar {progress} {previousProgress} />
	</div>

	{#if currentSegment}
		<div class="segment-preview">
			<div class="segment-decoration">
				<svg viewBox="0 0 40 40" width="40" height="40">
					<circle cx="20" cy="20" r="12" fill="var(--clay)" opacity="0.2" />
					<path
						d="M15,15 Q20,10 25,15 T30,20"
						stroke="var(--earth-dark)"
						stroke-width="1"
						fill="none"
						opacity="0.5"
					/>
				</svg>
			</div>
			<h4>Current Segment</h4>
			<p>"{currentSegment}"</p>
		</div>
	{/if}

	{#if isStuck}
		<div class="stuck-message">
			<svg viewBox="0 0 24 24" width="20" height="20" class="warning-icon">
				<polygon points="12,2 22,20 2,20" fill="none" stroke="#c07860" stroke-width="2" />
				<line x1="12" y1="9" x2="12" y2="13" stroke="#c07860" stroke-width="2" />
				<circle cx="12" cy="17" r="1" fill="#c07860" />
			</svg>
			Transcription seems stuck
			<button class="reload-link" onclick={onReload}>
				<svg viewBox="0 0 20 20" width="16" height="16">
					<path
						d="M4,10 A6,6 0 1,1 16,10 M13,7 L16,10 L13,13"
						stroke="currentColor"
						stroke-width="1.5"
						fill="none"
						stroke-linecap="round"
					/>
				</svg>
				Reload Page →
			</button>
		</div>
	{:else}
		<div class="transcribing-message">
			<svg viewBox="0 0 24 24" width="20" height="20" class="pulse-icon">
				<circle
					cx="12"
					cy="12"
					r="8"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					opacity="0.6"
				>
					<animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
				</circle>
				<circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.8" />
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
		padding: 3rem 2rem;
		background: rgba(245, 241, 235, 0.9);
		backdrop-filter: blur(15px);
		border: 1px solid var(--earth-medium);
		box-shadow:
			0 12px 40px rgba(139, 111, 71, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
		margin: 1.5rem 0;
		animation: fadeInScale 0.6s ease-out;
		position: relative;
		border-radius: 1.5rem;
	}

	@keyframes fadeInScale {
		from {
			transform: scale(0.95);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	.transcribing-decoration {
		position: absolute;
		top: -25px;
		left: -25px;
		opacity: 0.7;
		z-index: 0;
	}

	.transcribing h3 {
		margin-top: 0;
		margin-bottom: 1.25rem;
		font-family: 'Bebas Neue', sans-serif;
		font-size: 2rem;
		color: var(--text-primary);
		letter-spacing: 0.08em;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		position: relative;
		z-index: 1;
	}

	.title-icon {
		color: var(--mocha-mousse);
		filter: drop-shadow(0 2px 4px rgba(139, 111, 71, 0.2));
	}

	.progress-percentage {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 1.5rem;
		background: linear-gradient(135deg, rgba(167, 132, 106, 0.2) 0%, rgba(245, 241, 235, 0.8) 100%);
		backdrop-filter: blur(10px);
		padding: 0.75rem 1.5rem;
		border: 1px solid var(--mocha-mousse);
		box-shadow:
			0 4px 15px rgba(139, 111, 71, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.6);
		border-radius: 1.5rem;
		letter-spacing: 0.02em;
		animation: gentlePulse 3s ease-in-out infinite;
	}

	@keyframes gentlePulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.02);
		}
	}

	.progress-wrapper {
		width: 100%;
		max-width: 400px;
		margin-bottom: 2rem;
	}

	.segment-preview {
		margin: 1.5rem 0;
		padding: 1.75rem;
		background: rgba(245, 241, 235, 0.8);
		backdrop-filter: blur(10px);
		border: 1px solid var(--earth-medium);
		box-shadow:
			0 6px 24px rgba(139, 111, 71, 0.12),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
		width: 100%;
		max-width: 500px;
		animation: slideIn 0.4s ease-out;
		position: relative;
		border-radius: 1.25rem;
	}

	@keyframes slideIn {
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
		opacity: 0.6;
		z-index: 0;
	}

	.segment-preview h4 {
		text-align: center;
		margin: 0 0 1rem 0;
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--text-primary);
		letter-spacing: 0.03em;
		background: rgba(193, 154, 107, 0.2);
		padding: 0.5rem 1rem;
		border: 1px solid var(--clay);
		display: inline-block;
		box-shadow:
			0 2px 8px rgba(139, 111, 71, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.6);
		border-radius: 1rem;
		backdrop-filter: blur(5px);
		position: relative;
		z-index: 1;
	}

	.segment-preview p {
		margin: 0;
		font-size: 1rem;
		line-height: 1.6;
		color: var(--text-primary);
		font-style: italic;
		font-weight: 400;
		padding: 1rem 1.25rem;
		background: linear-gradient(135deg, rgba(156, 175, 136, 0.1) 0%, rgba(245, 241, 235, 0.6) 100%);
		border: 1px dashed var(--sage);
		border-radius: 1rem;
		letter-spacing: 0.01em;
		position: relative;
		z-index: 1;
	}

	.transcribing-message {
		margin-top: 1.5rem;
		color: var(--text-primary);
		font-weight: 500;
		text-align: center;
		background: linear-gradient(
			135deg,
			rgba(193, 154, 107, 0.15) 0%,
			rgba(245, 241, 235, 0.8) 100%
		);
		backdrop-filter: blur(10px);
		padding: 1.25rem 2rem;
		border: 1px solid var(--clay);
		box-shadow:
			0 4px 15px rgba(139, 111, 71, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.6);
		letter-spacing: 0.02em;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		border-radius: 1.5rem;
		font-size: 0.95rem;
		line-height: 1.4;
	}

	.pulse-icon {
		color: var(--mocha-mousse);
		flex-shrink: 0;
	}

	.stuck-message {
		margin-top: 1.5rem;
		color: var(--text-primary);
		font-weight: 500;
		text-align: center;
		background: linear-gradient(135deg, rgba(192, 120, 96, 0.15) 0%, rgba(245, 241, 235, 0.8) 100%);
		backdrop-filter: blur(10px);
		padding: 1.25rem 2rem;
		border: 1px solid #c07860;
		box-shadow:
			0 4px 15px rgba(192, 120, 96, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.6);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		animation: gentleShake 0.5s ease-in-out;
		border-radius: 1.5rem;
		letter-spacing: 0.02em;
		line-height: 1.4;
	}

	@keyframes gentleShake {
		0%,
		100% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(-2px);
		}
		75% {
			transform: translateX(2px);
		}
	}

	.warning-icon {
		color: #c07860;
		flex-shrink: 0;
	}

	.reload-link {
		background: linear-gradient(135deg, var(--clay), var(--mocha-mousse));
		color: var(--cream);
		border: 1px solid var(--earth-dark);
		padding: 0.75rem 1.5rem;
		cursor: pointer;
		font-size: 0.9rem;
		font-weight: 500;
		box-shadow:
			0 4px 15px rgba(139, 111, 71, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.2);
		letter-spacing: 0.02em;
		font-family: 'Space Grotesk', 'Georgia', serif;
		transition: all 0.3s ease;
		border-radius: 1.25rem;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		backdrop-filter: blur(5px);
	}

	.reload-link:hover {
		transform: translateY(-2px);
		box-shadow:
			0 6px 20px rgba(139, 111, 71, 0.3),
			inset 0 1px 0 rgba(255, 255, 255, 0.3);
		background: linear-gradient(135deg, var(--mocha-mousse), var(--clay));
	}

	@media (max-width: 600px) {
		.transcribing {
			padding: 2rem 1.5rem;
		}

		.transcribing h3 {
			font-size: 1.75rem;
		}

		.segment-preview {
			max-width: none;
			padding: 1.5rem;
		}

		.transcribing-message,
		.stuck-message {
			font-size: 0.9rem;
			padding: 1rem 1.5rem;
			flex-direction: column;
			text-align: center;
		}

		.transcribing-decoration {
			display: none;
		}
	}
</style>
