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
		color: var(--color-text-primary);
		background: #ffb6c1;
		padding: 1.5rem;
		border: var(--border-brutalist-thick);
		text-align: center;
		box-shadow: 5px 5px 0 var(--color-border-primary);
		width: calc(100% - 4rem);
		max-width: 500px;
		border-radius: 12px;
		margin: 0 auto;
		box-sizing: border-box;
	}

	.error h3 {
		font-size: 1.5rem;
		margin: 0 0 0.75rem 0;
		color: var(--color-text-primary);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.error p {
		font-size: 1rem;
		font-weight: 500;
		margin-bottom: 1.25rem;
		line-height: 1.5;
		color: var(--color-text-primary);
		word-wrap: break-word;
	}

	.retry-button {
		padding: 0.75rem 1.5rem;
		background: var(--color-text-primary);
		color: var(--color-text-inverse);
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 600;
		transition: all 0.2s;
		font-family: var(--font-family-primary);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.retry-button:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	}

	.retry-button:disabled {
		background: var(--color-text-tertiary);
		cursor: not-allowed;
		opacity: 0.7;
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
