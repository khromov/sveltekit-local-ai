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
		primary: '#ffd700',
		success: '#98fb98',
		warning: '#ffd93d'
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
		background: #ffd700;
		color: #000;
		border: 3px solid #000;
		border-radius: 8px;
		cursor: pointer;
		font-weight: 700;
		transition: all 0.2s;
		box-shadow: 4px 4px 0 #000;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-family: 'Space Grotesk', system-ui, sans-serif;
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
		box-shadow: 6px 6px 0 #000;
	}

	.primary-button:active:not(.disabled):not(.loading) {
		transform: translate(0);
		box-shadow: 2px 2px 0 #000;
	}

	.primary-button.disabled,
	.primary-button.loading {
		background: #e0e0e0;
		color: #999;
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
