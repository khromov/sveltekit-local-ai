<script lang="ts">
	interface Props {
		message: string;
		buttonText?: string;
		onRetry?: () => void;
		isRetrying?: boolean;
	}

	let { message, buttonText = 'Retry', onRetry, isRetrying = false }: Props = $props();
</script>

<div class="error">
	<h3>Error</h3>
	<p>{message}</p>
	{#if onRetry}
		<button onclick={onRetry} disabled={isRetrying} class="retry-button">
			{isRetrying ? 'Retrying...' : buttonText}
		</button>
	{/if}
</div>

<style>
	.error {
		color: #2e4a2e;
		background: rgba(255, 240, 240, 0.95);
		padding: 2rem;
		border: 1px solid rgba(200, 90, 84, 0.3);
		text-align: center;
		box-shadow: 0 16px 64px rgba(200, 90, 84, 0.15);
		width: calc(100% - 2rem);
		max-width: 500px;
		border-radius: 20px;
		margin: 0 auto;
		box-sizing: border-box;
		backdrop-filter: blur(16px);
	}

	.error h3 {
		font-size: 1.25rem;
		margin: 0 0 1rem 0;
		color: #c85a54;
		font-weight: 600;
		text-transform: none;
		letter-spacing: 0.01em;
	}

	.error p {
		font-size: 0.95rem;
		font-weight: 400;
		margin-bottom: 1.5rem;
		line-height: 1.6;
		color: rgba(46, 74, 46, 0.8);
		word-wrap: break-word;
	}

	.retry-button {
		padding: 0.875rem 1.5rem;
		background: linear-gradient(135deg, #c85a54 0%, #a04741 100%);
		color: #ffffff;
		border: 1px solid rgba(168, 71, 65, 0.3);
		border-radius: 12px;
		cursor: pointer;
		font-size: 0.9rem;
		font-weight: 500;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		font-family: 'Space Grotesk', system-ui, sans-serif;
		text-transform: none;
		letter-spacing: 0.01em;
		box-shadow: 0 4px 16px rgba(200, 90, 84, 0.2);
	}

	.retry-button:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 8px 32px rgba(200, 90, 84, 0.3);
		background: linear-gradient(135deg, #d46a64 0%, #b55751 100%);
	}

	.retry-button:disabled {
		background: linear-gradient(135deg, #a0a0a0 0%, #b0b0b0 100%);
		cursor: not-allowed;
		opacity: 0.6;
	}

	@media (max-width: 600px) {
		.error {
			width: calc(100% - 2rem);
			max-width: none;
			padding: 1.25rem 1rem;
			margin: 0 1rem;
		}

		.error h3 {
			font-size: 1.25rem;
		}

		.error p {
			font-size: 0.9375rem;
		}
	}

	@media (max-width: 400px) {
		.error {
			width: calc(100% - 1rem);
			margin: 0 0.5rem;
			padding: 1rem 0.75rem;
		}
	}
</style>
