<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
		size?: 'small' | 'medium' | 'large';
		outlined?: boolean;
		removable?: boolean;
		Icon?: any;
		onRemove?: () => void;
	}

	let {
		children,
		variant = 'default',
		size = 'medium',
		outlined = false,
		removable = false,
		Icon,
		onRemove
	}: Props = $props();

	const variantStyles = {
		default: {
			bg: 'var(--color-background-tertiary)',
			color: 'var(--color-text-primary)',
			border: 'var(--color-border-primary)'
		},
		primary: {
			bg: 'var(--color-primary)',
			color: 'var(--color-text-primary)',
			border: 'var(--color-text-primary)'
		},
		success: {
			bg: 'var(--color-success)',
			color: 'var(--color-text-primary)',
			border: 'var(--color-text-primary)'
		},
		warning: {
			bg: 'var(--color-warning)',
			color: 'var(--color-text-primary)',
			border: 'var(--color-text-primary)'
		},
		danger: {
			bg: 'var(--color-danger)',
			color: 'var(--color-text-primary)',
			border: 'var(--color-text-primary)'
		}
	};

	const sizeStyles = {
		small: { padding: '0.25rem 0.5rem', fontSize: '0.75rem', iconSize: '0.875rem' },
		medium: { padding: '0.375rem 0.75rem', fontSize: '0.875rem', iconSize: '1rem' },
		large: { padding: '0.5rem 1rem', fontSize: '1rem', iconSize: '1.25rem' }
	};

	const currentStyle = variantStyles[variant];
	const currentSize = sizeStyles[size];
</script>

<span
	class="brutalist-badge"
	class:outlined
	class:removable
	style="
		background: {outlined ? 'transparent' : currentStyle.bg};
		color: {currentStyle.color};
		border-color: {currentStyle.border};
		padding: {currentSize.padding};
		font-size: {currentSize.fontSize};
	"
>
	{#if Icon}
		<span class="badge-icon" style="font-size: {currentSize.iconSize}">
			<Icon />
		</span>
	{/if}

	<span class="badge-content">
		{@render children?.()}
	</span>

	{#if removable && onRemove}
		<button class="remove-btn" onclick={onRemove} type="button" aria-label="Remove"> × </button>
	{/if}
</span>

<style>
	.brutalist-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		background: var(--color-background-tertiary);
		color: var(--color-text-primary);
		border: var(--border-brutalist-thick);
		border-radius: 6px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-family: var(--font-family-primary);
		white-space: nowrap;
		box-shadow: var(--shadow-brutalist-small);
		transform: rotate(-1deg);
		transition: all 0.2s ease;
		position: relative;
	}

	.brutalist-badge:hover {
		transform: rotate(0deg) translate(-1px, -1px);
		box-shadow: var(--shadow-brutalist-medium);
	}

	.brutalist-badge.outlined {
		background: transparent;
		border-style: dashed;
	}

	.brutalist-badge.removable {
		padding-right: 1.5rem;
	}

	.badge-icon {
		display: flex;
		align-items: center;
		color: currentColor;
	}

	.badge-icon :global(svg) {
		width: 1em;
		height: 1em;
	}

	.badge-content {
		line-height: 1;
	}

	.remove-btn {
		position: absolute;
		right: 0.25rem;
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: none;
		color: currentColor;
		font-size: 1.25em;
		font-weight: 700;
		cursor: pointer;
		padding: 0;
		width: 1rem;
		height: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		transition: all 0.2s ease;
		line-height: 1;
	}

	.remove-btn:hover {
		background: rgba(0, 0, 0, 0.1);
		transform: translateY(-50%) scale(1.1);
	}

	@media (max-width: 600px) {
		.brutalist-badge {
			font-size: 0.75rem;
		}
	}
</style>
