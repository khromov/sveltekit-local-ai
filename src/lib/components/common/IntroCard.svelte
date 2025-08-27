<script lang="ts">
	interface Props {
		icon?: any;
		title: string;
		description: string;
		rotation?: number;
		backgroundColor?: string;
		animateIcon?: boolean;
	}

	let {
		icon: Icon,
		title,
		description,
		rotation = -0.5,
		backgroundColor = 'var(--color-background-secondary)',
		animateIcon = false
	}: Props = $props();
</script>

<div class="intro-card" style:transform="rotate({rotation}deg)" style:background={backgroundColor}>
	<h2>
		{#if Icon}
			<span class="title-icon" class:animated={animateIcon}>
				<Icon />
			</span>
		{/if}
		{title}
	</h2>
	<p>{description}</p>
</div>

<style>
	.intro-card {
		text-align: center;
		padding: 2rem;
		background: var(--color-background-secondary);
		border: var(--border-brutalist-thick);
		box-shadow: var(--shadow-brutalist-medium);
		margin-bottom: 1rem;
	}

	.intro-card h2 {
		margin: 0 0 1rem 0;
		font-family: var(--font-family-display);
		font-size: 2rem;
		color: var(--color-text-primary);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		text-transform: uppercase;
		letter-spacing: 2px;
	}

	.title-icon {
		display: flex;
		align-items: center;
		color: var(--color-text-primary);
	}

	.title-icon.animated {
		animation: sparkle 2s ease-in-out infinite;
	}

	.title-icon :global(svg) {
		width: 2rem;
		height: 2rem;
	}

	@keyframes sparkle {
		0%,
		100% {
			transform: scale(1) rotate(0deg);
		}
		50% {
			transform: scale(1.1) rotate(180deg);
		}
	}

	.intro-card p {
		margin: 0;
		font-size: 1.125rem;
		color: var(--color-text-secondary);
		line-height: 1.5;
	}

	@media (max-width: 600px) {
		.intro-card {
			padding: 1.5rem;
		}

		.intro-card h2 {
			font-size: 1.5rem;
			flex-direction: column;
			gap: 0.75rem;
		}

		.intro-card p {
			font-size: 1rem;
		}
	}
</style>
