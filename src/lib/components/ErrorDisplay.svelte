<script lang="ts">
	interface Props {
		message: string;
		buttonText?: string;
		onRetry?: () => void;
		isRetrying?: boolean;
	}

	let {
		message,
		buttonText = 'Retry',
		onRetry,
		isRetrying = false
	}: Props = $props();
</script>

<div class="error">
	<div class="error-icon">⚠️</div>
	<div class="error-decoration"></div>
	<h3>ERROR!</h3>
	<p>{message}</p>
	{#if onRetry}
		<button onclick={onRetry} disabled={isRetrying} class="retry-button">
			{#if isRetrying}
				<span class="loading-spinner">◐</span>
				RETRYING...
			{:else}
				<span class="button-icon">🔄</span>
				{buttonText.toUpperCase()}
			{/if}
		</button>
	{/if}
</div>

<style>
	.error {
		color: #000;
		background: #FF6B6B;
		padding: 2.5rem;
		border: 4px solid #000;
		text-align: center;
		box-shadow: 10px 10px 0 #000;
		width: 100%;
		max-width: 600px;
		position: relative;
		transform: rotate(-2deg);
		animation: errorShake 0.5s ease-in-out;
	}

	@keyframes errorShake {
		0%, 100% { transform: translateX(0) rotate(-2deg); }
		10% { transform: translateX(-10px) rotate(-2deg); }
		20% { transform: translateX(10px) rotate(-2deg); }
		30% { transform: translateX(-10px) rotate(-2deg); }
		40% { transform: translateX(10px) rotate(-2deg); }
		50% { transform: translateX(-5px) rotate(-2deg); }
		60% { transform: translateX(5px) rotate(-2deg); }
		70% { transform: translateX(-2px) rotate(-2deg); }
		80% { transform: translateX(2px) rotate(-2deg); }
		90% { transform: translateX(-1px) rotate(-2deg); }
	}

	.error-icon {
		position: absolute;
		top: -30px;
		left: 50%;
		transform: translateX(-50%);
		font-size: 3rem;
		animation: iconPulse 2s ease-in-out infinite;
		filter: drop-shadow(3px 3px 0 #000);
	}

	@keyframes iconPulse {
		0%, 100% { transform: translateX(-50%) scale(1); }
		50% { transform: translateX(-50%) scale(1.1); }
	}

	.error-decoration {
		position: absolute;
		top: -10px;
		left: -10px;
		right: -10px;
		bottom: -10px;
		border: 3px dashed #000;
		border-radius: 30% 70% 70% 30% / 60% 40% 60% 40%;
		z-index: -1;
		opacity: 0.3;
		transform: rotate(3deg);
	}

	.error h3 {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 2.5rem;
		margin: 0 0 1rem 0;
		color: #000;
		letter-spacing: 3px;
		text-shadow: 3px 3px 0 rgba(0,0,0,0.2);
	}

	.error p {
		font-size: 1.125rem;
		font-weight: 600;
		margin-bottom: 1.5rem;
		line-height: 1.5;
		padding: 1rem;
		background: #FFF;
		border: 3px solid #000;
		box-shadow: 4px 4px 0 #000;
	}

	.retry-button {
		padding: 1rem 2rem;
		background: #FFD93D;
		color: #000;
		border: 4px solid #000;
		cursor: pointer;
		font-size: 1.25rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 1px;
		transition: all 0.15s;
		box-shadow: 6px 6px 0 #000;
		font-family: 'Space Grotesk', monospace;
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		position: relative;
		overflow: hidden;
	}

	.retry-button::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
		transition: left 0.5s;
	}

	.retry-button:hover:not(:disabled)::before {
		left: 100%;
	}

	.retry-button:hover:not(:disabled) {
		transform: translate(-3px, -3px);
		box-shadow: 9px 9px 0 #000;
		background: #98FB98;
	}

	.retry-button:active:not(:disabled) {
		transform: translate(0);
		box-shadow: 3px 3px 0 #000;
	}

	.retry-button:disabled {
		background: #CCC;
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
		opacity: 0.7;
	}

	.button-icon {
		font-size: 1.5rem;
	}

	.loading-spinner {
		font-size: 1.5rem;
		animation: spin 1s linear infinite;
		display: inline-block;
	}

	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}

	@media (max-width: 600px) {
		.error {
			max-width: none;
			padding: 2rem;
		}

		.error h3 {
			font-size: 2rem;
		}

		.retry-button {
			font-size: 1.125rem;
			padding: 0.875rem 1.5rem;
		}
	}
</style>
