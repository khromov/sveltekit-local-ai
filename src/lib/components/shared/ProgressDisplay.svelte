<!-- Shared Progress Display Component -->
<script lang="ts">
	import ProgressBar from '$lib/components/common/ProgressBar.svelte';
	import RotateCwIcon from 'virtual:icons/lucide/rotate-cw';
	import SparklesIcon from 'virtual:icons/lucide/sparkles';
	import AlertTriangleIcon from 'virtual:icons/lucide/alert-triangle';

	interface Props {
		title?: string;
		progress: number;
		previousProgress?: number;
		message?: string;
		subMessage?: string;
		icon?: 'processing' | 'sparkles' | 'warning';
		showPercentage?: boolean;
		isStuck?: boolean;
		onReload?: () => void;
	}

	let {
		title = 'Processing',
		progress = 0,
		previousProgress = 0,
		message = 'Processing...',
		subMessage = '',
		icon = 'processing',
		showPercentage = true,
		isStuck = false,
		onReload
	}: Props = $props();
</script>

<div class="progress-display">
	<div class="progress-decoration"></div>

	<h3>
		{#if icon === 'processing'}
			<span class="title-icon rotating"><RotateCwIcon /></span>
		{:else if icon === 'sparkles'}
			<span class="title-icon sparkling"><SparklesIcon /></span>
		{:else if icon === 'warning'}
			<span class="title-icon warning"><AlertTriangleIcon /></span>
		{/if}
		{title}
	</h3>

	{#if showPercentage}
		<p class="progress-percentage">{progress}% Complete</p>
	{/if}

	<div class="progress-wrapper">
		<ProgressBar {progress} {previousProgress} />
	</div>

	{#if subMessage}
		<div class="sub-message">
			<p>"{subMessage}"</p>
		</div>
	{/if}

	{#if isStuck}
		<div class="stuck-message">
			<span class="warning-icon"><AlertTriangleIcon /></span>
			Process seems stuck
			{#if onReload}
				<button class="reload-link" onclick={onReload}>Reload Page →</button>
			{/if}
		</div>
	{:else}
		<div class="processing-message">
			{#if icon === 'sparkles'}
				<span class="pulse-icon"><SparklesIcon /></span>
			{:else}
				<span class="pulse-icon"><RotateCwIcon /></span>
			{/if}
			{message}
		</div>
	{/if}
</div>

<style>
	.progress-display {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2.5rem;
		background: var(--color-background-main);
		border: var(--border-brutalist-extra-thick);
		box-shadow: var(--shadow-brutalist-xlarge);
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

	.progress-decoration {
		position: absolute;
		top: -10px;
		left: -10px;
		width: 100px;
		height: 100px;
		background: repeating-linear-gradient(
			45deg,
			var(--color-success),
			var(--color-success) 10px,
			transparent 10px,
			transparent 20px
		);
		border: var(--border-brutalist-thick);
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

	.progress-display h3 {
		margin-top: 0;
		margin-bottom: 1rem;
		font-family: var(--font-family-display);
		font-size: 2.5rem;
		color: var(--color-text-primary);
		letter-spacing: 3px;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		background: var(--color-primary-dark);
		padding: 0.5rem 2rem;
		border: var(--border-brutalist-thick);
		box-shadow: var(--shadow-brutalist-large);
		transform: rotate(-2deg);
		text-transform: uppercase;
	}

	.title-icon {
		font-size: 2rem;
		display: flex;
		align-items: center;
		color: var(--color-text-primary);
	}

	.title-icon :global(svg) {
		width: 2rem;
		height: 2rem;
	}

	.title-icon.rotating {
		animation: rotate 2s linear infinite;
	}

	.title-icon.sparkling {
		animation: sparkle 2s ease-in-out infinite;
	}

	.title-icon.warning {
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes sparkle {
		0%,
		100% {
			transform: scale(1) rotate(0deg);
		}
		50% {
			transform: scale(1.2) rotate(180deg);
		}
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.1);
		}
	}

	.progress-percentage {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-text-primary);
		margin-bottom: 1.5rem;
		background: var(--color-success);
		padding: 0.5rem 1.5rem;
		border: var(--border-brutalist-thick);
		box-shadow: 5px 5px 0 var(--color-text-primary);
		transform: rotate(1deg);
		animation: pulseBadge 2s ease-in-out infinite;
		text-transform: uppercase;
	}

	@keyframes pulseBadge {
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

	.sub-message {
		margin: 1.5rem 0;
		padding: 1.5rem;
		background: var(--color-background-main);
		border: var(--border-brutalist-thick);
		box-shadow: var(--shadow-brutalist-large);
		width: 100%;
		max-width: 500px;
		animation: slideIn 0.3s ease-out;
		position: relative;
		transform: rotate(0.5deg);
	}

	.sub-message p {
		margin: 0;
		font-size: 1.0625rem;
		line-height: 1.5;
		color: var(--color-text-primary);
		font-style: italic;
		font-weight: 500;
		padding: 0.75rem;
		background: linear-gradient(135deg, rgba(255, 217, 61, 0.1) 0%, rgba(152, 251, 152, 0.1) 100%);
		border: 2px dashed var(--color-text-primary);
	}

	.processing-message {
		margin-top: 1rem;
		color: var(--color-text-primary);
		font-weight: 700;
		text-align: center;
		background: var(--color-primary-dark);
		padding: 1rem 1.5rem;
		border: var(--border-brutalist-thick);
		box-shadow: 5px 5px 0 var(--color-text-primary);
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
		color: var(--color-text-primary);
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
		color: var(--color-text-primary);
		font-weight: 700;
		text-align: center;
		background: var(--color-danger);
		padding: 1rem 1.5rem;
		border: var(--border-brutalist-thick);
		box-shadow: 5px 5px 0 var(--color-text-primary);
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
		color: var(--color-text-primary);
	}

	.warning-icon :global(svg) {
		width: 2rem;
		height: 2rem;
	}

	.reload-link {
		background: var(--color-primary-dark);
		border: var(--border-brutalist-thick);
		color: var(--color-text-primary);
		padding: 0.5rem 1rem;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 700;
		box-shadow: var(--shadow-brutalist-medium);
		text-transform: uppercase;
		letter-spacing: 1px;
		font-family: var(--font-family-primary);
		transition: all 0.15s;
	}

	.reload-link:hover {
		transform: translate(-2px, -2px);
		box-shadow: var(--shadow-brutalist-large);
		background: var(--color-success);
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

	@media (max-width: 600px) {
		.progress-display {
			padding: 1.75rem;
		}

		.progress-display h3 {
			font-size: 2rem;
		}

		.sub-message {
			max-width: none;
		}

		.processing-message,
		.stuck-message {
			font-size: 0.875rem;
			padding: 0.875rem 1rem;
		}
	}
</style>
