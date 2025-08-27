<script lang="ts">
	import type { ComponentType } from 'svelte';

	interface Props {
		title: string;
		description?: string;
		Icon?: ComponentType;
		selected?: boolean;
		disabled?: boolean;
		onClick?: () => void;
		name?: string;
		value?: string;
		size?: 'normal' | 'compact';
		rotation?: number;
	}

	let {
		title,
		description,
		Icon,
		selected = false,
		disabled = false,
		onClick,
		name,
		value,
		size = 'normal',
		rotation = -0.5
	}: Props = $props();
</script>

<label
	class="option-button"
	class:selected
	class:compact={size === 'compact'}
	style="transform: rotate({rotation}deg);"
>
	<input type="radio" {name} {value} checked={selected} onchange={onClick} {disabled} />
	<div class="option-content">
		{#if size === 'compact'}
			<strong>{title}</strong>
			{#if description}
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				<small>{@html description}</small>
			{/if}
		{:else}
			<div class="option-header">
				{#if Icon}
					<span class="option-icon"><Icon /></span>
				{/if}
				<strong>{title}</strong>
			</div>
			{#if description}
				<small>{description}</small>
			{/if}
		{/if}
	</div>
</label>

<style>
	.option-button {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.25rem;
		border: var(--border-brutalist-thick);
		background: var(--color-background-main);
		cursor: pointer;
		transition: all 0.15s ease;
		box-shadow: var(--shadow-brutalist-medium);
		position: relative;
		transform: rotate(-0.5deg);
	}

	.option-button:nth-child(2) {
		transform: rotate(0.5deg);
	}

	.option-button:hover {
		transform: translate(-2px, -2px) rotate(0deg);
		box-shadow: var(--shadow-brutalist-large);
		background: var(--color-background-cream);
	}

	.option-button.selected {
		background: var(--color-success);
		transform: translate(-3px, -3px) rotate(0deg);
		box-shadow: 7px 7px 0 var(--color-text-primary);
	}

	.option-button input[type='radio'] {
		width: 20px;
		height: 20px;
		margin: 0;
		accent-color: var(--color-text-primary);
		cursor: pointer;
		border: var(--border-brutalist-thin);
	}

	.option-content {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
		flex: 1;
	}

	.option-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.option-icon {
		font-size: 1.5rem;
		display: flex;
		align-items: center;
		color: var(--color-text-primary);
	}

	.option-icon :global(svg) {
		width: 1.5rem;
		height: 1.5rem;
	}

	.option-content strong {
		font-size: 1.125rem;
		color: var(--color-text-primary);
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.option-content small {
		font-size: 0.9375rem;
		color: var(--color-text-secondary);
		font-weight: 500;
		margin-left: 2rem;
	}

	.option-content small :global(a) {
		color: var(--color-text-primary);
		font-weight: 700;
		text-decoration: none;
		padding: 2px 6px;
		background: var(--color-primary-dark);
		border: var(--border-brutalist-thin);
		transition: all 0.15s;
		display: inline-block;
		box-shadow: var(--shadow-brutalist-small);
	}

	.option-content small :global(a:hover) {
		transform: translate(-1px, -1px);
		box-shadow: var(--shadow-brutalist-small);
		background: var(--color-accent-pink);
	}

	/* Compact version */
	.option-button.compact {
		padding: 0.75rem 1rem !important;
	}

	.option-button.compact .option-content {
		flex-direction: row !important;
		align-items: center;
		gap: 0.5rem !important;
	}

	.option-button.compact strong {
		font-size: 1rem !important;
	}

	.option-button.compact small {
		margin-left: 0 !important;
		font-size: 0.875rem !important;
	}

	@media (max-width: 600px) {
		.option-button {
			padding: 1rem;
			flex-direction: column;
			align-items: flex-start;
			gap: 0.75rem;
		}

		.option-content small {
			margin-left: 0;
		}
	}
</style>
