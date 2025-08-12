<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
		onClick?: () => void;
		disabled?: boolean;
		loading?: boolean;
		variant?: 'primary' | 'success' | 'warning';
		size?: 'small' | 'medium' | 'large';
		fullWidth?: boolean;
	}

	let {
		children,
		onClick,
		disabled = false,
		loading = false,
		variant = 'primary',
		size = 'medium',
		fullWidth = false
	}: Props = $props();

	const variantStyles = {
		primary: 'var(--color-primary)',
		success: 'var(--color-success)',
		warning: 'var(--color-primary-dark)'
	};

	const sizeStyles = {
		small: { padding: '0.75rem 1.25rem', fontSize: '0.875rem' },
		medium: { padding: '0.875rem 1.75rem', fontSize: '1rem' },
		large: { padding: '1.25rem 2rem', fontSize: '1.125rem' }
	};
</script>

<button
	class="primary-button"
	class:full-width={fullWidth}
	class:disabled
	class:loading
	style="background: {variantStyles[variant]}; padding: {sizeStyles[size]
		.padding}; font-size: {sizeStyles[size].fontSize};"
	onclick={onClick}
	{disabled}
>
	{@render children?.()}
</button>

<style>
	.primary-button {
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
	}

	.primary-button::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
		transition: left 0.5s;
	}

	.primary-button:hover:not(.disabled):not(.loading)::before {
		left: 100%;
	}

	.primary-button:hover:not(.disabled):not(.loading) {
		transform: translate(-2px, -2px);
		box-shadow: var(--shadow-brutalist-large);
	}

	.primary-button:active:not(.disabled):not(.loading) {
		transform: translate(0);
		box-shadow: var(--shadow-brutalist-small);
	}

	.primary-button.disabled,
	.primary-button.loading {
		background: var(--color-background-disabled);
		color: var(--color-text-disabled);
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
		opacity: 0.7;
	}

	.primary-button.loading {
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

	.primary-button.full-width {
		width: 100%;
	}

	@media (max-width: 600px) {
		.primary-button {
			font-size: 0.875rem;
			padding: 0.875rem 1.25rem;
		}
	}
</style>
