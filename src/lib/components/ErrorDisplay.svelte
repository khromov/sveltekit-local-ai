<script lang="ts">
	interface Props {
		message: string;
		buttonText?: string;
		onRetry?: () => void;
		isRetrying?: boolean;
	}

	let { message, buttonText = 'Try Again', onRetry, isRetrying = false }: Props = $props();
</script>

<div class="error">
	<div class="error-decoration">
		<svg viewBox="0 0 60 60" width="60" height="60">
			<circle cx="30" cy="30" r="20" fill="none" stroke="#c07860" stroke-width="2" opacity="0.4" />
			<path d="M22,22 L38,38 M38,22 L22,38" stroke="#8b5a3c" stroke-width="3" opacity="0.6" />
		</svg>
	</div>
	<h3>Something went wrong</h3>
	<p>{message}</p>
	{#if onRetry}
		<button onclick={onRetry} disabled={isRetrying} class="retry-button">
			{#if isRetrying}
				<svg viewBox="0 0 20 20" width="16" height="16" class="loading-icon">
					<circle
						cx="10"
						cy="10"
						r="6"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						opacity="0.3"
					/>
					<path d="M10 4 A 6 6 0 0 1 16 10" stroke="currentColor" stroke-width="2" fill="none">
						<animateTransform
							attributeName="transform"
							type="rotate"
							values="0 10 10;360 10 10"
							dur="1s"
							repeatCount="indefinite"
						/>
					</path>
				</svg>
				Retrying...
			{:else}
				<svg viewBox="0 0 20 20" width="16" height="16">
					<path
						d="M4,10 A6,6 0 1,1 16,10 M13,7 L16,10 L13,13"
						stroke="currentColor"
						stroke-width="2"
						fill="none"
						stroke-linecap="round"
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
		background: linear-gradient(135deg, rgba(192, 120, 96, 0.1) 0%, rgba(245, 241, 235, 0.8) 100%);
		backdrop-filter: blur(15px);
		padding: 2rem;
		border: 1px solid #c07860;
		text-align: center;
		box-shadow:
			0 8px 32px rgba(192, 120, 96, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
		width: calc(100% - 4rem);
		max-width: 500px;
		border-radius: 1.5rem;
		margin: 0 auto;
		box-sizing: border-box;
		position: relative;
		animation: fadeInScale 0.6s ease-out;
	}

	@keyframes fadeInScale {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	.error-decoration {
		display: flex;
		justify-content: center;
		margin-bottom: 1.5rem;
		animation: gentleFloat 3s ease-in-out infinite;
	}

	@keyframes gentleFloat {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-5px);
		}
	}

	.error h3 {
		font-size: 1.4rem;
		margin: 0 0 1rem 0;
		color: var(--text-primary);
		font-weight: 600;
		letter-spacing: 0.02em;
	}

	.error p {
		font-size: 1rem;
		font-weight: 400;
		margin-bottom: 1.5rem;
		line-height: 1.6;
		color: var(--text-secondary);
		word-wrap: break-word;
		letter-spacing: 0.01em;
	}

	.retry-button {
		padding: 0.875rem 1.75rem;
		background: linear-gradient(135deg, #c07860, #a86550);
		color: var(--cream);
		border: 1px solid #8b5a3c;
		border-radius: 1.5rem;
		cursor: pointer;
		font-size: 0.95rem;
		font-weight: 500;
		transition: all 0.3s ease;
		font-family: 'Space Grotesk', 'Georgia', serif;
		letter-spacing: 0.02em;
		box-shadow:
			0 4px 15px rgba(192, 120, 96, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.2);
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}

	.retry-button:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow:
			0 6px 20px rgba(192, 120, 96, 0.3),
			inset 0 1px 0 rgba(255, 255, 255, 0.3);
		background: linear-gradient(135deg, #d08870, #b87560);
	}

	.retry-button:disabled {
		background: var(--stone);
		color: var(--text-light);
		cursor: not-allowed;
		opacity: 0.7;
		transform: none;
		box-shadow: none;
	}

	.loading-icon {
		filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
	}

	@media (max-width: 600px) {
		.error {
			width: calc(100% - 2rem);
			max-width: none;
			padding: 1.5rem 1.25rem;
			margin: 0 1rem;
		}

		.error h3 {
			font-size: 1.25rem;
		}

		.error p {
			font-size: 0.95rem;
		}

		.retry-button {
			font-size: 0.9rem;
			padding: 0.75rem 1.5rem;
		}
	}

	@media (max-width: 400px) {
		.error {
			width: calc(100% - 1rem);
			margin: 0 0.5rem;
			padding: 1.25rem 1rem;
		}
	}
</style>
