<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		onClick?: () => void;
		disabled?: boolean;
		variant?: 'primary' | 'success' | 'warning' | 'danger';
		size?: 'small' | 'medium' | 'large';
		fullWidth?: boolean;
		loading?: boolean;
		Icon?: any;
	}

	let {
		children,
		onClick,
		disabled = false,
		variant = 'primary',
		size = 'medium',
		fullWidth = false,
		loading = false,
		Icon
	}: Props = $props();

	const variantStyles = {
		primary: 'var(--color-primary)',
		success: 'var(--color-success)',
		warning: 'var(--color-warning)',
		danger: 'var(--color-danger)'
	};

	const sizeStyles = {
		small: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
		medium: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
		large: { padding: '1rem 2rem', fontSize: '1.125rem' }
	};
</script>

<button
	class="brutalist-button"
	class:full-width={fullWidth}
	class:disabled
	class:loading
	style="background: {variantStyles[variant]}; padding: {sizeStyles[size]
		.padding}; font-size: {sizeStyles[size].fontSize};"
	onclick={onClick}
	{disabled}
>
	{#if Icon}
		<span class="btn-icon">
			<Icon />
		</span>
	{/if}

	{#if loading}
		<span class="loading-dots">
			<span class="dot"></span>
			<span class="dot"></span>
			<span class="dot"></span>
		</span>
	{:else}
		{@render children?.()}
	{/if}
</button>

<style>
	.brutalist-button {
		background: var(--color-primary);
		color: var(--color-text-primary);
		border: var(--border-brutalist-thick);
		border-radius: 8px;
		cursor: pointer;
		font-weight: 700;
		transition: all 0.2s;
		box-shadow: var(--shadow-brutalist-medium);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-family: var(--font-family-primary);
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		white-space: nowrap;
		position: relative;
		overflow: hidden;
		transform: rotate(-0.5deg);
	}

	.brutalist-button::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
		transition: left 0.5s;
	}

	.brutalist-button:hover:not(.disabled):not(.loading)::before {
		left: 100%;
	}

	.brutalist-button:hover:not(.disabled):not(.loading) {
		transform: translate(-2px, -2px) rotate(0deg);
		box-shadow: var(--shadow-brutalist-large);
	}

	.brutalist-button:active:not(.disabled):not(.loading) {
		transform: translate(0) rotate(-0.5deg);
		box-shadow: var(--shadow-brutalist-small);
	}

	.brutalist-button.disabled,
	.brutalist-button.loading {
		background: var(--color-background-disabled);
		color: var(--color-text-disabled);
		cursor: not-allowed;
		transform: rotate(-0.5deg);
		opacity: 0.7;
	}

	.brutalist-button.loading {
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

	.brutalist-button.full-width {
		width: 100%;
	}

	.btn-icon {
		font-size: 1.25rem;
		display: flex;
		align-items: center;
		color: var(--color-text-primary);
	}

	.btn-icon :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}

	.loading-dots {
		display: flex;
		gap: 0.25rem;
	}

	.dot {
		width: 4px;
		height: 4px;
		background: currentColor;
		border-radius: 50%;
		animation: bounce-dot 1.4s infinite ease-in-out both;
	}

	.dot:nth-child(1) {
		animation-delay: -0.32s;
	}
	.dot:nth-child(2) {
		animation-delay: -0.16s;
	}
	.dot:nth-child(3) {
		animation-delay: 0s;
	}

	@keyframes bounce-dot {
		0%,
		80%,
		100% {
			transform: scale(0.8);
			opacity: 0.5;
		}
		40% {
			transform: scale(1.2);
			opacity: 1;
		}
	}

	@media (max-width: 600px) {
		.brutalist-button {
			font-size: 0.875rem;
			padding: 0.75rem 1.25rem;
		}
	}
</style>
