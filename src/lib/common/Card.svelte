<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		rotation?: number;
		padding?: 'small' | 'medium' | 'large';
		variant?: 'default' | 'primary' | 'success' | 'warning';
		animated?: boolean;
		decorative?: boolean;
	}

	let {
		children,
		rotation = 0.5,
		padding = 'medium',
		variant = 'default',
		animated = true,
		decorative = false
	}: Props = $props();

	const paddingMap = {
		small: '1rem',
		medium: '1.5rem',
		large: '2rem'
	};

	const variantStyles = {
		default: 'var(--color-background-main)',
		primary: 'var(--color-primary)',
		success: 'var(--color-success)',
		warning: 'var(--color-warning)'
	};
</script>

<div
	class="brutalist-card"
	class:animated
	class:decorative
	style="transform: rotate({rotation}deg); padding: {paddingMap[
		padding
	]}; background: {variantStyles[variant]};"
>
	{#if decorative}
		<div class="card-decoration"></div>
	{/if}

	<div class="card-content">
		{@render children?.()}
	</div>
</div>

<style>
	.brutalist-card {
		background: var(--color-background-main);
		border: var(--border-brutalist-thick);
		box-shadow: var(--shadow-brutalist-large);
		border-radius: 12px;
		position: relative;
		transition: all 0.2s ease;
	}

	.brutalist-card.animated {
		animation: slideIn 0.4s ease-out;
	}

	@keyframes slideIn {
		from {
			transform: translateY(10px) rotate(0deg);
			opacity: 0;
		}
		to {
			transform: translateY(0) rotate(var(--rotation, 0.5deg));
			opacity: 1;
		}
	}

	.brutalist-card:hover {
		transform: translate(-1px, -1px) rotate(0deg) !important;
		box-shadow: var(--shadow-brutalist-xlarge);
	}

	.brutalist-card.decorative .card-decoration {
		position: absolute;
		top: -8px;
		right: -8px;
		width: 40px;
		height: 40px;
		background: var(--color-accent-pink);
		border: var(--border-brutalist-thin);
		border-radius: 30% 70% 70% 30% / 60% 40% 60% 40%;
		opacity: 0.6;
		z-index: 0;
		animation: float 4s ease-in-out infinite;
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0) rotate(0deg);
		}
		50% {
			transform: translateY(-5px) rotate(180deg);
		}
	}

	.card-content {
		position: relative;
		z-index: 1;
	}

	@media (max-width: 600px) {
		.brutalist-card {
			padding: 1rem;
		}
	}
</style>
