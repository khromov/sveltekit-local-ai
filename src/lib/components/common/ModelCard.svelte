<script lang="ts">
	import type { ComponentType } from 'svelte';

	interface Props {
		name: string;
		size?: string;
		prosIcon?: ComponentType;
		prosText?: string;
		active?: boolean;
		disabled?: boolean;
		onClick?: () => void;
		rotation?: number;
	}

	let {
		name,
		size,
		prosIcon,
		prosText = 'High quality responses',
		active = false,
		disabled = false,
		onClick,
		rotation = 0.5
	}: Props = $props();
</script>

<button
	class="model-card"
	class:active
	class:rotate-positive={rotation > 0}
	class:rotate-negative={rotation < 0}
	style="transform: rotate({rotation}deg);"
	onclick={onClick}
	{disabled}
>
	<div class="card-decoration"></div>
	<div class="model-icon">
		{#if prosIcon}
			<prosIcon />
		{/if}
	</div>
	<div class="model-header">
		<h4>{name}</h4>
		{#if size}
			<div class="model-size">{size}</div>
		{/if}
	</div>
	<div class="model-pros">
		{#if prosIcon}
			<span class="pros-icon"><prosIcon /></span>
		{/if}
		<span class="pros-text">{prosText}</span>
	</div>
</button>

<style>
	.model-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		padding: 1.25rem 1rem;
		background: var(--color-background-tertiary);
		border: var(--border-brutalist-thick);
		border-radius: 12px;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 600;
		transition: all 0.2s;
		font-family: var(--font-family-primary);
		box-shadow: var(--shadow-brutalist-medium);
		text-align: center;
		position: relative;
		overflow: hidden;
		transform: rotate(0.5deg);
	}

	.model-card.rotate-negative {
		transform: rotate(-0.3deg);
	}

	.card-decoration {
		position: absolute;
		top: -6px;
		right: -6px;
		width: 30px;
		height: 30px;
		background: var(--color-success);
		border: var(--border-brutalist-thin);
		border-radius: 30% 70% 70% 30% / 60% 40% 60% 40%;
		opacity: 0.6;
		z-index: 0;
	}

	.model-card.rotate-negative .card-decoration {
		background: var(--color-accent-pink);
		left: -6px;
		right: auto;
	}

	.model-card:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.model-card:not(:disabled):hover {
		transform: translate(-2px, -2px) rotate(0deg);
		box-shadow: var(--shadow-brutalist-large);
		background: var(--color-background-pattern);
	}

	.model-card.active {
		background: var(--color-success);
		transform: translate(-2px, -2px) rotate(0deg);
		box-shadow: var(--shadow-brutalist-large);
		border-color: var(--color-text-primary);
	}

	.model-card.active:not(:disabled):hover {
		background: var(--color-success-hover);
	}

	.model-icon {
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
		position: relative;
		z-index: 1;
	}

	.model-icon :global(svg) {
		width: 2rem;
		height: 2rem;
	}

	.model-header {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
		position: relative;
		z-index: 1;
	}

	.model-header h4 {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: var(--color-text-primary);
		line-height: 1.2;
	}

	.model-size {
		font-size: 0.75rem;
		color: var(--color-text-tertiary);
		background: var(--color-primary-dark);
		padding: 0.25rem 0.5rem;
		border: var(--border-brutalist-thin);
		border-radius: 4px;
		font-weight: 700;
		box-shadow: var(--shadow-brutalist-small);
		width: fit-content;
		margin: 0 auto;
	}

	.model-pros {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		background: var(--color-background-main);
		padding: 0.5rem 0.75rem;
		border: var(--border-brutalist-thin);
		border-radius: 6px;
		box-shadow: var(--shadow-brutalist-small);
		position: relative;
		z-index: 1;
		width: 100%;
		box-sizing: border-box;
		justify-content: center;
	}

	.pros-icon {
		font-size: 1rem;
		display: flex;
		align-items: center;
		color: var(--color-text-primary);
		flex-shrink: 0;
	}

	.pros-icon :global(svg) {
		width: 1rem;
		height: 1rem;
	}

	.pros-text {
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--color-text-primary);
		text-transform: uppercase;
		letter-spacing: 0.25px;
		line-height: 1.2;
		text-align: center;
	}

	@media (max-width: 768px) {
		.model-card {
			padding: 1.25rem 1rem;
		}
	}

	@media (max-width: 600px) {
		.model-icon {
			font-size: 1.75rem;
			padding: 0.625rem;
		}

		.model-icon :global(svg) {
			width: 1.75rem;
			height: 1.75rem;
		}

		.model-header h4 {
			font-size: 1rem;
		}

		.pros-text {
			font-size: 0.6875rem;
		}
	}
</style>
