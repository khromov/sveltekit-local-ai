<script lang="ts">
	import SettingsIcon from 'virtual:icons/lucide/settings';
	import ChevronDownIcon from 'virtual:icons/lucide/chevron-down';
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		icon?: typeof SettingsIcon;
		initialOpen?: boolean;
		children: Snippet;
	}

	let { title = 'Advanced Parameters', icon = SettingsIcon, initialOpen = false, children }: Props = $props();
	let showParams = $state(initialOpen);
</script>

<div class="advanced-params">
		<button class="params-toggle" onclick={() => (showParams = !showParams)}>
			<span class="toggle-emoji"><icon></icon></span>
			<span>{title}</span>
			<span class="toggle-icon" class:rotated={showParams}>
				<ChevronDownIcon />
			</span>
		</button>
		{#if showParams}
			<div class="params-grid">
				{@render children()}
			</div>
		{/if}
</div>

<style>

	.advanced-params {
		background: linear-gradient(135deg, rgba(255, 217, 61, 0.1) 0%, rgba(152, 251, 152, 0.1) 100%);
		padding: 1.25rem;
		border: var(--border-brutalist-thick);
		border-radius: 8px;
		box-sizing: border-box;
		transform: rotate(0.2deg);
		box-shadow: var(--shadow-brutalist-small);
	}

	.params-toggle {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem 0;
		background: none;
		border: none;
		font-size: 1rem;
		font-weight: 700;
		color: var(--color-text-primary);
		cursor: pointer;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-family: var(--font-family-primary);
		transition: color 0.2s;
	}

	.toggle-emoji {
		font-size: 1.25rem;
		margin-right: 0.5rem;
		display: flex;
		align-items: center;
		color: var(--color-text-primary);
		animation: rotate 3s linear infinite;
	}

	.toggle-emoji :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.params-toggle:hover .toggle-emoji {
		animation-duration: 1s;
	}

	.params-toggle:hover {
		color: var(--color-text-tertiary);
	}

	.toggle-icon {
		transition: transform 0.3s ease;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		color: var(--color-text-primary);
	}

	.toggle-icon :global(svg) {
		width: 20px;
		height: 20px;
	}

	.toggle-icon.rotated {
		transform: rotate(180deg);
	}

	.params-grid {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-top: 1rem;
		animation: slideDown 0.3s ease-out;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 600px) {
		.advanced-params {
			padding: 1rem;
		}
	}
</style>