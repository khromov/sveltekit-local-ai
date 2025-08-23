<script lang="ts">
	interface Props {
		message?: string;
	}

	let { message = 'Enter some text above to see the token count' }: Props = $props();
</script>

<div class="empty-state">
	<div class="empty-state-content">
		<div class="empty-state-icon">
			<span class="dots">⋯</span>
		</div>
		<h3>{message}</h3>
		<p>
			Type or paste text in the input field above to analyze tokens, character count, and API costs.
		</p>
	</div>
</div>

<style>
	.empty-state {
		background: var(--color-background-main);
		border: var(--border-brutalist-thick);
		box-shadow: var(--shadow-brutalist-large);
		padding: 3rem 2rem;
		transform: rotate(0.1deg);
		border-radius: 8px;
		text-align: center;
	}

	.empty-state-content {
		max-width: 400px;
		margin: 0 auto;
	}

	.empty-state-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 4rem;
		height: 4rem;
		margin: 0 auto 1.5rem auto;
		background: var(--color-background-secondary);
		border: var(--border-brutalist-thick);
		border-radius: 50%;
		color: var(--color-text-secondary);
		font-size: 1.5rem;
		transform: rotate(-0.2deg);
		box-shadow: var(--shadow-brutalist-medium);
	}

	.dots {
		font-size: 2rem;
		font-weight: bold;
		line-height: 1;
	}

	.empty-state h3 {
		margin: 0 0 1rem 0;
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-text-primary);
		font-family: var(--font-family-display);
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.empty-state p {
		margin: 0;
		color: var(--color-text-secondary);
		font-size: 1rem;
		line-height: 1.6;
		opacity: 0.8;
	}

	.empty-state:hover {
		transform: rotate(0deg) translate(-2px, -2px);
		box-shadow: var(--shadow-brutalist-large);
	}

	.empty-state:hover .empty-state-icon {
		transform: rotate(0deg);
		background: var(--color-accent-primary);
		color: var(--color-text-primary);
	}

	@media (max-width: 600px) {
		.empty-state {
			padding: 2rem 1rem;
		}

		.empty-state h3 {
			font-size: 1.25rem;
		}

		.empty-state p {
			font-size: 0.9rem;
		}

		.empty-state-icon {
			width: 3rem;
			height: 3rem;
			margin-bottom: 1rem;
		}

		.dots {
			font-size: 1.5rem;
		}
	}
</style>
