<script lang="ts">
	import type { ComponentType } from 'svelte';

	interface Props {
		children?: import('svelte').Snippet;
		onClick?: () => void;
		disabled?: boolean;
		loading?: boolean;
		variant?: 'primary' | 'success' | 'warning';
		icon?: ComponentType;
		loadingIcon?: ComponentType;
		minWidth?: string;
		fullWidth?: boolean;
		rotation?: number;
	}

	let {
		children,
		onClick,
		disabled = false,
		loading = false,
		variant = 'success',
		icon,
		loadingIcon,
		minWidth = '280px',
		fullWidth = false,
		rotation = -0.5
	}: Props = $props();

	const variantStyles = {
		primary: 'var(--color-primary)',
		success: 'var(--color-success)',
		warning: 'var(--color-primary-dark)'
	};
</script>

<button
	class="load-model-button"
	class:full-width={fullWidth}
	class:disabled
	class:loading
	style="background: {variantStyles[
		variant
	]}; min-width: {minWidth}; transform: rotate({rotation}deg);"
	onclick={onClick}
	{disabled}
>
	{#if loading && loadingIcon}
		<span class="loading-icon"><loadingIcon /></span>
	{:else if icon}
		<span class="button-icon"><icon /></span>
	{/if}
	{@render children?.()}
</button>

<style>
	.load-model-button {
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		text-align: center;
		position: relative;
		overflow: hidden;
		text-transform: uppercase;
		padding: 1.25rem 2rem;
		font-size: 1.125rem;
		color: var(--color-text-primary);
		border: var(--border-brutalist-thick);
		border-radius: 8px;
		cursor: pointer;
		font-weight: 700;
		transition: all 0.2s;
		box-shadow: var(--shadow-brutalist-medium);
		letter-spacing: 0.5px;
		font-family: var(--font-family-primary);
		box-sizing: border-box;
		white-space: nowrap;
		background: var(--color-success);
		transform: rotate(-0.5deg);
	}

	.load-model-button::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
		transition: left 0.5s;
	}

	.load-model-button:hover:not(.disabled)::before {
		left: 100%;
	}

	.load-model-button:hover:not(.disabled) {
		background: var(--color-primary-dark);
		transform: translate(-3px, -3px) rotate(0deg);
		box-shadow: var(--shadow-brutalist-xlarge);
	}

	.load-model-button:disabled,
	.load-model-button.disabled {
		background: var(--color-background-disabled);
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
		opacity: 0.7;
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.7;
		}
		50% {
			opacity: 1;
		}
	}

	.button-icon,
	.loading-icon {
		font-size: 1.5rem;
		display: flex;
		align-items: center;
		color: var(--color-text-primary);
	}

	.button-icon :global(svg),
	.loading-icon :global(svg) {
		width: 1.5rem;
		height: 1.5rem;
	}

	.loading-icon {
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

	.load-model-button.full-width {
		width: 100%;
	}

	@media (max-width: 768px) {
		.load-model-button {
			min-width: auto;
			width: 100%;
			justify-content: center;
			font-size: 1rem;
			padding: 1rem 1.5rem;
		}
	}

	@media (max-width: 600px) {
		.load-model-button {
			font-size: 0.875rem;
			padding: 0.875rem 1.25rem;
		}
	}
</style>
