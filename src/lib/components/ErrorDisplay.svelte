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
		color: #000;
		background: #FFB6C1;
		padding: 1.5rem;
		border: 3px solid #000;
		text-align: center;
		box-shadow: 5px 5px 0 #000;
		width: 100%;
		max-width: 500px;
		border-radius: 12px;
	}

	.error h3 {
		font-size: 1.5rem;
		margin: 0 0 0.75rem 0;
		color: #000;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.error p {
		font-size: 1rem;
		font-weight: 500;
		margin-bottom: 1.25rem;
		line-height: 1.5;
		color: #000;
	}

	.retry-button {
		padding: 0.75rem 1.5rem;
		background: #000;
		color: #FFF;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 600;
		transition: all 0.2s;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.retry-button:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0,0,0,0.2);
	}

	.retry-button:disabled {
		background: #666;
		cursor: not-allowed;
		opacity: 0.7;
	}

	@media (max-width: 600px) {
		.error {
			max-width: none;
			padding: 1.25rem;
		}

		.error h3 {
			font-size: 1.25rem;
		}
	}
</style>
