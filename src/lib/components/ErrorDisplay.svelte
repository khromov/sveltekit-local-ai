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
	<svg class="error-icon" width="48" height="48" viewBox="0 0 48 48" fill="none">
		<circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="2" opacity="0.3" />
		<path d="M24 14V26" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
		<circle cx="24" cy="34" r="1.5" fill="currentColor" />
		<!-- Wilted leaf decoration -->
		<path
			d="M10,10 Q5,15 5,20 Q10,20 15,15 Q10,15 10,10"
			fill="currentColor"
			opacity="0.2"
			transform="rotate(135 10 15)"
		/>
		<path
			d="M38,10 Q43,15 43,20 Q38,20 33,15 Q38,15 38,10"
			fill="currentColor"
			opacity="0.2"
			transform="rotate(-135 38 15)"
		/>
	</svg>

	<h3>Something went wrong</h3>
	<p>{message}</p>

	{#if onRetry}
		<button onclick={onRetry} disabled={isRetrying} class="retry-button">
			{#if isRetrying}
				<svg class="loading-spinner" width="16" height="16" viewBox="0 0 16 16" fill="none">
					<circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" opacity="0.3" />
					<path
						d="M8 2C11.3 2 14 4.7 14 8"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
					/>
				</svg>
				Retrying...
			{:else}
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
					<path
						d="M2 8C2 4.7 4.7 2 8 2C10.2 2 12.1 3.1 13.3 4.7L14 6"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M14 2V6H10"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M14 8C14 11.3 11.3 14 8 14C5.8 14 3.9 12.9 2.7 11.3L2 10"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M2 14V10H6"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
				{buttonText}
			{/if}
		</button>
	{/if}
</div>

<style>
	.error {
		color: var(--text-primary);
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.95) 0%,
			rgba(252, 248, 243, 0.98) 100%
		);
		padding: 2rem;
		border: 1px solid rgba(212, 165, 116, 0.3);
		text-align: center;
		box-shadow:
			0 8px 32px rgba(139, 111, 71, 0.1),
			0 2px 8px rgba(212, 165, 116, 0.15);
		width: 100%;
		max-width: 500px;
		border-radius: 20px;
		margin: 0 auto;
		box-sizing: border-box;
		backdrop-filter: blur(10px);
		animation: fadeIn 0.6s ease-out;
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

	.error-icon {
		color: var(--earth-soil);
		margin-bottom: 1rem;
		animation: gentle-shake 2s ease-in-out infinite;
	}

	@keyframes gentle-shake {
		0%,
		100% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(-2px) rotate(-1deg);
		}
		75% {
			transform: translateX(2px) rotate(1deg);
		}
	}

	.error h3 {
		font-size: 1.375rem;
		margin: 0 0 0.75rem 0;
		color: var(--earth-soil);
		font-weight: 600;
		letter-spacing: -0.01em;
	}

	.error p {
		font-size: 0.975rem;
		font-weight: 400;
		margin-bottom: 1.5rem;
		line-height: 1.5;
		color: var(--text-secondary);
		word-wrap: break-word;
		letter-spacing: 0.01em;
	}

	.retry-button {
		padding: 0.75rem 1.5rem;
		background: linear-gradient(135deg, var(--earth-clay) 0%, var(--earth-soil) 100%);
		color: white;
		border: 1px solid rgba(139, 111, 71, 0.2);
		border-radius: 12px;
		cursor: pointer;
		font-size: 0.9375rem;
		font-weight: 600;
		transition: all 0.3s ease;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		letter-spacing: 0.03em;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		box-shadow:
			0 4px 16px rgba(139, 111, 71, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.1);
	}

	.retry-button:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow:
			0 6px 24px rgba(139, 111, 71, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.15);
		background: linear-gradient(135deg, var(--leaf-gold) 0%, var(--earth-clay) 100%);
	}

	.retry-button:active:not(:disabled) {
		transform: translateY(0);
		box-shadow:
			0 2px 8px rgba(139, 111, 71, 0.15),
			inset 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	.retry-button:disabled {
		background: linear-gradient(135deg, var(--earth-stone) 0%, var(--text-muted) 100%);
		cursor: not-allowed;
		opacity: 0.7;
	}

	.loading-spinner {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	@media (max-width: 600px) {
		.error {
			padding: 1.5rem 1.25rem;
			max-width: none;
		}

		.error h3 {
			font-size: 1.25rem;
		}

		.error p {
			font-size: 0.9375rem;
		}

		.error-icon {
			width: 40px;
			height: 40px;
		}
	}
</style>
