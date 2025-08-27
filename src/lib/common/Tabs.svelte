<script lang="ts">
	interface Tab {
		id: string;
		label: string;
		icon?: any;
	}

	interface Props {
		tabs: Tab[];
		activeTab?: string;
		onTabChange?: (tabId: string) => void;
		children?: import('svelte').Snippet;
	}

	let { tabs, activeTab = $bindable(tabs[0]?.id), onTabChange, children }: Props = $props();

	function handleTabClick(tabId: string) {
		activeTab = tabId;
		if (onTabChange) {
			onTabChange(tabId);
		}
	}
</script>

<div class="tabs-container">
	<div class="tabs-header">
		{#each tabs as tab (tab.id)}
			<button
				class="tab-button"
				class:active={activeTab === tab.id}
				onclick={() => handleTabClick(tab.id)}
			>
				{#if tab.icon}
					<span class="tab-icon">
						<svelte:component this={tab.icon} />
					</span>
				{/if}
				{tab.label}
			</button>
		{/each}
	</div>

	<div class="tabs-content">
		{@render children?.()}
	</div>
</div>

<style>
	.tabs-container {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.tabs-header {
		display: flex;
		gap: 0;
		background: var(--color-background-main);
		border: var(--border-brutalist-thick);
		border-radius: 8px 8px 0 0;
		overflow: hidden;
		box-shadow: var(--shadow-brutalist-medium);
	}

	.tab-button {
		flex: 1;
		padding: 0.875rem 1rem;
		background: var(--color-background-tertiary);
		border: none;
		border-right: var(--border-brutalist-thick);
		cursor: pointer;
		font-size: 1rem;
		font-weight: 700;
		color: var(--color-text-primary);
		transition: all 0.2s;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-family: var(--font-family-primary);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}

	.tab-button:last-child {
		border-right: none;
	}

	.tab-button:hover:not(.active) {
		background: var(--color-background-secondary);
	}

	.tab-button.active {
		background: var(--color-primary);
		position: relative;
	}

	.tab-button.active::after {
		content: '';
		position: absolute;
		bottom: -3px;
		left: 0;
		right: 0;
		height: 3px;
		background: var(--color-text-primary);
	}

	.tab-icon {
		display: flex;
		align-items: center;
		color: var(--color-text-primary);
	}

	.tab-icon :global(svg) {
		width: 1.125rem;
		height: 1.125rem;
	}

	.tabs-content {
		background: var(--color-background-main);
		border: var(--border-brutalist-thick);
		border-top: none;
		padding: 1.5rem;
		border-radius: 0 0 8px 8px;
		box-shadow: var(--shadow-brutalist-medium);
	}

	@media (max-width: 600px) {
		.tab-button {
			padding: 0.75rem 0.5rem;
			font-size: 0.875rem;
		}

		.tabs-content {
			padding: 1rem;
		}
	}
</style>
