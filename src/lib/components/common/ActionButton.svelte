<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		onClick?: () => void;
		disabled?: boolean;
		variant?: 'default' | 'success' | 'warning' | 'danger';
		Icon?: any;
	}

	let { children, onClick, disabled = false, variant = 'default', Icon }: Props = $props();

	const variantStyles = {
		default: 'var(--color-success)',
		success: 'var(--color-success)',
		warning: 'var(--color-primary-dark)',
		danger: 'var(--color-danger)'
	};

	const hoverStyles = {
		default: 'var(--color-primary-dark)',
		success: 'var(--color-success-hover)',
		warning: 'var(--color-warning)',
		danger: 'var(--color-danger-hover)'
	};
</script>

<button
	class="action-button"
	class:disabled
	style="background: {variantStyles[variant]}; --hover-color: {hoverStyles[variant]};"
	onclick={onClick}
	{disabled}
>
	{#if Icon}
		<span class="btn-icon">
			<Icon></Icon>
		</span>
	{/if}
	{@render children?.()}
</button>

<style>
	.action-button {
		padding: 0.5rem 1rem;
		background: var(--color-success);
		color: var(--color-text-primary);
		border: var(--border-brutalist-thin);
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 700;
		transition: all 0.2s;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-family: var(--font-family-primary);
		white-space: nowrap;
		box-shadow: var(--shadow-brutalist-medium);
		display: flex;
		align-items: center;
		gap: 0.375rem;
		transform: rotate(0deg);
	}

	.action-button:hover:not(.disabled) {
		transform: translate(-2px, -2px) rotate(0deg);
		box-shadow: 5px 5px 0 var(--color-border-primary);
		background: var(--hover-color);
	}

	.action-button.disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn-icon {
		font-size: 1rem;
		display: flex;
		align-items: center;
		color: var(--color-text-primary);
	}

	.btn-icon :global(svg) {
		width: 1rem;
		height: 1rem;
	}

	@media (max-width: 600px) {
		.action-button {
			padding: 0.375rem 0.75rem;
			font-size: 0.8125rem;
		}
	}
</style>
