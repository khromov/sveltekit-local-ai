<script lang="ts">
	interface Props {
		title?: string;
		rotation?: number;
		animationDelay?: number;
		elevation?: 'small' | 'medium' | 'large' | 'xlarge';
		children?: import('svelte').Snippet;
	}

	let {
		title,
		rotation = 0.5,
		animationDelay = 0,
		elevation = 'large',
		children
	}: Props = $props();

	const elevationStyles = {
		small: 'var(--shadow-brutalist-small)',
		medium: 'var(--shadow-brutalist-medium)',
		large: 'var(--shadow-brutalist-large)',
		xlarge: 'var(--shadow-brutalist-xlarge)'
	};
</script>

<div
	class="card"
	style="transform: rotate({rotation}deg); animation-delay: {animationDelay}s; box-shadow: {elevationStyles[
		elevation
	]};"
>
	{#if title}
		<div class="card-header">
			<h3>{title}</h3>
		</div>
	{/if}
	<div class="card-content">
		{@render children?.()}
	</div>
</div>

<style>
	.card {
		background: var(--color-background-main);
		border: var(--border-brutalist-thick);
		padding: 0;
		position: relative;
		animation: slideIn 0.4s ease-out;
		animation-fill-mode: both;
		overflow: hidden;
		border-radius: 8px;
	}

	@keyframes slideIn {
		from {
			transform: translateY(10px) rotate(var(--rotation, 0.5deg));
			opacity: 0;
		}
		to {
			transform: translateY(0) rotate(var(--rotation, 0.5deg));
			opacity: 1;
		}
	}

	.card-header {
		background: var(--color-primary-dark);
		border-bottom: var(--border-brutalist-thick);
		padding: 1rem 1.5rem;
	}

	.card-header h3 {
		margin: 0;
		font-family: var(--font-family-display);
		font-size: 1.5rem;
		color: var(--color-text-primary);
		text-transform: uppercase;
		letter-spacing: 2px;
	}

	.card-content {
		padding: 1.5rem;
	}

	@media (max-width: 600px) {
		.card-content {
			padding: 1rem;
		}

		.card-header {
			padding: 0.75rem 1rem;
		}

		.card-header h3 {
			font-size: 1.25rem;
		}
	}
</style>
