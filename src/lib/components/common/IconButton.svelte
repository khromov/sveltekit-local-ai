<script lang="ts">
	interface Props {
		icon: any;
		variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
		size?: 'small' | 'medium' | 'large';
		disabled?: boolean;
		onClick?: () => void;
		title?: string;
	}

	let {
		icon: Icon,
		variant = 'default',
		size = 'medium',
		disabled = false,
		onClick,
		title
	}: Props = $props();

	const variantStyles = {
		default: 'var(--color-background-main)',
		primary: 'var(--color-primary)',
		success: 'var(--color-success)',
		warning: 'var(--color-warning)',
		danger: 'var(--color-danger)'
	};

	const sizeStyles = {
		small: { size: '32px', iconSize: '16px' },
		medium: { size: '40px', iconSize: '20px' },
		large: { size: '48px', iconSize: '24px' }
	};
</script>

<button
	class="icon-button icon-button-{variant} icon-button-{size}"
	style="
		background: {variantStyles[variant]}; 
		width: {sizeStyles[size].size}; 
		height: {sizeStyles[size].size};
		--icon-size: {sizeStyles[size].iconSize};
	"
	{disabled}
	onclick={onClick}
	{title}
	type="button"
>
	<Icon />
</button>

<style>
	.icon-button {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		border: var(--border-brutalist-thick);
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s;
		box-shadow: var(--shadow-brutalist-small);
		color: var(--color-text-primary);
		flex-shrink: 0;
	}

	.icon-button :global(svg) {
		width: var(--icon-size);
		height: var(--icon-size);
	}

	.icon-button:hover:not(:disabled) {
		transform: translate(-2px, -2px);
		box-shadow: var(--shadow-brutalist-medium);
	}

	.icon-button:active:not(:disabled) {
		transform: translate(0);
		box-shadow: var(--shadow-brutalist-small);
	}

	.icon-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		background: var(--color-background-disabled) !important;
	}

	/* Variant hover states */
	.icon-button-default:hover:not(:disabled) {
		background: var(--color-background-tertiary) !important;
	}

	.icon-button-primary:hover:not(:disabled) {
		background: var(--color-primary-dark) !important;
	}

	.icon-button-success:hover:not(:disabled) {
		background: var(--color-success-hover) !important;
	}

	.icon-button-warning:hover:not(:disabled) {
		background: var(--color-warning-hover) !important;
	}

	.icon-button-danger:hover:not(:disabled) {
		background: var(--color-danger-hover) !important;
	}
</style>
