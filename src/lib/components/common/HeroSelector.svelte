<script lang="ts">
	interface HeroCard {
		id: string;
		icon: any;
		title: string;
		description: string;
		badge?: string;
		recommended?: boolean;
	}

	interface Props {
		title: string;
		stepNumber?: number;
		models: HeroCard[];
		selectedModel: string | null;
		onModelChange: (modelId: string) => void;
		loading?: boolean;
		rotation?: number;
		defaultBadgeText?: string;
	}

	let {
		title,
		stepNumber,
		models,
		selectedModel,
		onModelChange,
		loading = false,
		rotation = -0.2,
		defaultBadgeText = 'Recommended'
	}: Props = $props();
</script>

<div class="hero-selector" style:transform="rotate({rotation}deg)">
	<h3>
		{#if stepNumber}
			<span class="step-number">Step {stepNumber}:</span>
		{/if}
		{title}
	</h3>

	<div
		class="hero-cards"
		class:single-column={models.length === 1}
		class:two-column={models.length === 2}
	>
		{#each models as model, index (model.id)}
			<button
				class="hero-card"
				class:active={selectedModel === model.id}
				class:loading
				disabled={loading}
				onclick={() => onModelChange(model.id)}
				style:transform="rotate({index === 0 ? 0.5 : index === 1 ? -0.3 : 0.3}deg)"
			>
				{#if model.badge || model.recommended}
					<div class="recommended-badge">{model.badge || defaultBadgeText}</div>
				{/if}
				<div class="hero-icon">
					<model.icon />
				</div>
				<div class="hero-info">
					<h4>{model.title}</h4>
					<p>{model.description}</p>
				</div>
			</button>
		{/each}
	</div>
</div>

<style>
	.hero-selector {
		background: var(--color-background-main);
		border: var(--border-brutalist-extra-thick);
		padding: 1.5rem;
		box-shadow: var(--shadow-brutalist-large);
		margin-bottom: 1.5rem;
		position: relative;
	}

	h3 {
		margin: 0 0 1.25rem 0;
		font-family: var(--font-family-display);
		font-size: 1.75rem;
		color: var(--color-text-primary);
		text-align: center;
		letter-spacing: 2px;
		text-transform: uppercase;
		background: var(--color-primary-dark);
		padding: 0.5rem 1rem;
		border: var(--border-brutalist-thick);
		box-shadow: var(--shadow-brutalist-medium);
		transform: rotate(1deg);
		width: fit-content;
		margin-left: auto;
		margin-right: auto;
	}

	.step-number {
		background: var(--color-text-primary);
		color: var(--color-text-inverse);
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.875rem;
		font-weight: 700;
		margin-right: 0.5rem;
		display: inline-block;
	}

	.hero-cards {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}

	.hero-cards.single-column {
		grid-template-columns: 1fr;
		max-width: 300px;
		margin: 0 auto;
	}

	.hero-cards.two-column {
		grid-template-columns: repeat(2, 1fr);
	}

	.hero-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		padding: 1.25rem 1rem;
		background: var(--color-background-tertiary);
		border: var(--border-brutalist-thick);
		cursor: pointer;
		transition: all 0.2s;
		font-family: var(--font-family-primary);
		box-shadow: var(--shadow-brutalist-medium);
		text-align: center;
		position: relative;
		overflow: hidden;
	}

	.hero-card:hover {
		transform: translate(-2px, -2px) rotate(0deg) !important;
		box-shadow: var(--shadow-brutalist-large);
		background: var(--color-background-pattern);
	}

	.hero-card.active {
		background: var(--color-success);
		transform: translate(-2px, -2px) rotate(0deg) !important;
		box-shadow: var(--shadow-brutalist-large);
		border-color: var(--color-text-primary);
	}

	.hero-card.loading {
		opacity: 0.5;
		cursor: not-allowed;
		pointer-events: none;
	}

	.hero-card.loading:hover {
		transform: inherit !important;
		box-shadow: var(--shadow-brutalist-medium);
		background: var(--color-background-tertiary);
	}

	.hero-icon {
		font-size: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-text-primary);
		background: var(--color-background-main);
		border: var(--border-brutalist-thick);
		border-radius: 8px;
		padding: 0.75rem;
		box-shadow: var(--shadow-brutalist-small);
	}

	.hero-icon :global(svg) {
		width: 2rem;
		height: 2rem;
	}

	.hero-info h4 {
		margin: 0 0 0.25rem 0;
		font-size: 1rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: var(--color-text-primary);
	}

	.hero-info p {
		margin: 0;
		font-size: 0.75rem;
		color: var(--color-text-tertiary);
		font-weight: 500;
		line-height: 1.2;
	}

	.recommended-badge {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		background: black;
		color: white;
		font-size: 0.625rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		padding: 0.25rem 0.5rem;
		border: var(--border-brutalist-thin);
		box-shadow: var(--shadow-brutalist-small);
		transform: rotate(-2deg);
		z-index: 1;
	}

	@media (max-width: 768px) {
		.hero-cards {
			grid-template-columns: 1fr;
			gap: 0.75rem;
		}

		.hero-card {
			flex-direction: row;
			justify-content: flex-start;
			text-align: left;
		}

		.hero-icon {
			padding: 0.5rem;
		}

		.hero-info {
			text-align: left;
		}

		.recommended-badge {
			top: 0.25rem;
			right: 0.25rem;
			font-size: 0.55rem;
			padding: 0.2rem 0.4rem;
		}
	}

	@media (max-width: 600px) {
		.hero-selector {
			padding: 1rem;
		}

		h3 {
			font-size: 1.5rem;
		}
	}
</style>
