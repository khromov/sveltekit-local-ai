<script lang="ts">
	interface Props {
		href: string;
		icon: any;
		title: string;
		description: string;
		actionText?: string;
		decorationColor?: string;
		decorationPosition?: 'left' | 'right';
		hoverColor?: string;
		rotation?: number;
	}

	let {
		href,
		icon: Icon,
		title,
		description,
		actionText = 'Open Tokenizer',
		decorationColor = 'var(--color-accent-pink)',
		decorationPosition = 'right',
		hoverColor = 'var(--color-accent-pink)',
		rotation = 0.5
	}: Props = $props();
</script>

<a {href} class="hero-card" style:transform="rotate({rotation}deg)">
	<div
		class="card-decoration"
		class:left-decoration={decorationPosition === 'left'}
		style:background={decorationColor}
	></div>
	<div class="card-content">
		<div class="card-icon" style:--hover-color={hoverColor}>
			<Icon />
		</div>
		<h2>{title}</h2>
		<p class="card-description">{description}</p>
		<div class="card-action">
			<span>{actionText}</span>
			<!-- Chevron right icon inline -->
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<polyline points="9,18 15,12 9,6"></polyline>
			</svg>
		</div>
	</div>
</a>

<style>
	.hero-card {
		display: block;
		text-decoration: none;
		color: var(--color-text-primary);
		background: var(--color-background-main);
		border: var(--border-brutalist-thick);
		padding: 0;
		box-shadow: var(--shadow-brutalist-large);
		transition: all 0.2s ease;
		position: relative;
		overflow: hidden;
		border-radius: 12px;
	}

	.hero-card:hover {
		transform: translate(-3px, -3px) rotate(0deg);
		box-shadow: 8px 8px 0 var(--color-border-primary);
	}

	.card-decoration {
		position: absolute;
		top: -10px;
		right: -10px;
		width: 80px;
		height: 80px;
		opacity: 0.3;
		border: var(--border-brutalist-thin);
		border-radius: 30% 70% 70% 30% / 60% 40% 60% 40%;
		z-index: 0;
	}

	.card-decoration.left-decoration {
		left: -10px;
		right: auto;
	}

	.card-content {
		padding: 2rem;
		position: relative;
		z-index: 1;
	}

	.card-icon {
		margin-bottom: 1.5rem;
		width: fit-content;
		padding: 1rem;
		background: var(--color-gradient-gold);
		border: var(--border-brutalist-thick);
		border-radius: 12px;
		box-shadow: var(--shadow-brutalist-small);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2.5rem;
		color: var(--color-text-primary);
		transition: background 0.2s ease;
	}

	.hero-card:hover .card-icon {
		background: var(--hover-color);
	}

	.card-icon :global(svg) {
		width: 2.5rem;
		height: 2.5rem;
	}

	.hero-card h2 {
		font-size: 1.75rem;
		font-weight: 700;
		margin: 0 0 1rem 0;
		color: var(--color-text-primary);
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.card-description {
		font-size: 1rem;
		color: var(--color-text-secondary);
		line-height: 1.5;
		margin: 0 0 1.5rem 0;
	}

	.card-action {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: var(--color-text-primary);
		padding: 0.75rem 1rem;
		background: var(--color-primary-dark);
		border: var(--border-brutalist-thin);
		border-radius: 6px;
		box-shadow: var(--shadow-brutalist-small);
		transition: all 0.2s ease;
	}

	.card-action svg {
		width: 1.25rem;
		height: 1.25rem;
	}

	.hero-card:hover .card-action {
		background: var(--color-primary);
		transform: translate(-1px, -1px);
		box-shadow: var(--shadow-brutalist-medium);
	}

	@media (max-width: 600px) {
		.card-content {
			padding: 1.5rem;
		}
	}
</style>
