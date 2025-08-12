<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
		onClick?: () => void;
		disabled?: boolean;
		variant?: 'default' | 'success' | 'warning' | 'danger';
		icon?: import('svelte').Component;
	}

	let { children, onClick, disabled = false, variant = 'default', icon }: Props = $props();

	const variantStyles = {
		default: '#98fb98',
		success: '#98fb98',
		warning: '#ffd93d',
		danger: '#ff6b6b'
	};

	const hoverStyles = {
		default: '#ffd93d',
		success: '#90ee90',
		warning: '#ffa500',
		danger: '#ff5252'
	};
</script>

<button
	class="action-button"
	class:disabled
	style="background: {variantStyles[variant]}; --hover-color: {hoverStyles[variant]};"
	onclick={onClick}
	{disabled}
>
	{#if icon}
		<span class="btn-icon">
			<svelte:component this={icon} />
		</span>
	{/if}
	{@render children?.()}
</button>

<style>
	.action-button {
		padding: 0.5rem 1rem;
		background: #98fb98;
		color: #000;
		border: 2px solid #000;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 700;
		transition: all 0.2s;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		white-space: nowrap;
		box-shadow: 3px 3px 0 #000;
		display: flex;
		align-items: center;
		gap: 0.375rem;
		transform: rotate(0deg);
	}

	.action-button:hover:not(.disabled) {
		transform: translate(-2px, -2px) rotate(0deg);
		box-shadow: 5px 5px 0 #000;
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
		color: #000;
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
