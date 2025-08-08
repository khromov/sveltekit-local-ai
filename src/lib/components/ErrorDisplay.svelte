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
	<p>{message}</p>
	{#if onRetry}
		<button onclick={onRetry} disabled={isRetrying}>
			{isRetrying ? 'Retrying...' : buttonText}
		</button>
	{/if}
</div>

<style>
	.error {
		color: #ff3b30;
		background-color: #feeced;
		padding: 1.5rem;
		border-radius: 16px;
		text-align: center;
		box-shadow: 0 2px 12px rgba(255, 59, 48, 0.15);
		width: 100%;
		max-width: 500px;
		animation: errorPulse 2s infinite alternate;
	}

	.error p {
		font-size: 1.0625rem;
		margin-bottom: 1.25rem;
		line-height: 1.5;
	}

	.error button {
		padding: 0.875rem 1.5rem;
		background-color: #ff3b30;
		color: white;
		border: none;
		border-radius: 12px;
		cursor: pointer;
		font-size: 1.0625rem;
		font-weight: 500;
		transition: all 0.2s;
		box-shadow: 0 2px 8px rgba(255, 59, 48, 0.3);
	}

	.error button:hover {
		background-color: #e0352b;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(255, 59, 48, 0.4);
	}

	.error button:active {
		transform: translateY(0);
		box-shadow: 0 1px 3px rgba(255, 59, 48, 0.3);
	}

	.error button:disabled {
		background-color: #b0b0b0;
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
	}

	@keyframes errorPulse {
		0% {
			box-shadow: 0 2px 12px rgba(255, 59, 48, 0.15);
		}
		100% {
			box-shadow: 0 2px 16px rgba(255, 59, 48, 0.3);
		}
	}

	@media (max-width: 600px) {
		.error {
			max-width: none;
		}
	}
</style>
