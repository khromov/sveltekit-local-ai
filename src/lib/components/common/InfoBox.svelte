<script lang="ts">
	import type { ComponentType } from 'svelte';

	interface Props {
		message: string;
		Icon?: ComponentType;
		variant?: 'blue' | 'pink' | 'success' | 'warning' | 'primary';
		rotation?: number;
	}

	let { message, Icon, variant = 'blue', rotation = 0.5 }: Props = $props();

	const variantStyles = {
		blue: 'var(--color-accent-blue)',
		pink: 'var(--color-accent-pink)',
		success: 'var(--color-success)',
		warning: 'var(--color-primary-dark)',
		primary: 'var(--color-primary)'
	};
</script>

<div
	class="info-box"
	style="background: {variantStyles[variant]}; transform: rotate({rotation}deg);"
>
	{#if Icon}
		<span class="info-icon"><Icon /></span>
	{/if}
	{message}
</div>

<style>
	.info-box {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		margin-top: 1rem;
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--color-text-primary);
		text-align: center;
		background: var(--color-accent-blue);
		padding: 0.75rem 1rem;
		border: var(--border-brutalist-thick);
		box-shadow: 5px 5px 0 var(--color-text-primary);
		transform: rotate(0.5deg);
		width: fit-content;
		margin-left: auto;
		margin-right: auto;
		line-height: 1.4;
	}

	.info-icon {
		font-size: 1.25rem;
		display: flex;
		align-items: center;
		color: var(--color-text-primary);
		flex-shrink: 0;
	}

	.info-icon :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}

	@media (max-width: 600px) {
		.info-box {
			font-size: 0.875rem;
			padding: 0.625rem 0.875rem;
		}
	}
</style>
