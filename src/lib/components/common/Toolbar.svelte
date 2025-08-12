<script lang="ts">
	interface Props {
		modelInfo: string;
		modelIcon?: import('svelte').Component;
		children?: import('svelte').Snippet;
	}

	let { modelInfo, modelIcon, children }: Props = $props();
</script>

<div class="toolbar">
	<span class="model-info">
		{#if modelIcon}
			<span class="model-emoji"><svelte:component this={modelIcon} /></span>
		{/if}
		{modelInfo}
	</span>

	<div class="toolbar-actions">
		{@render children?.()}
	</div>

	<div class="toolbar-decoration"></div>
</div>

<style>
	.toolbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.25rem;
		background: linear-gradient(90deg, #ffd700 0%, #ffa500 100%);
		border-bottom: 3px solid #000;
		flex-wrap: wrap;
		gap: 0.5rem;
		position: relative;
	}

	.model-info {
		font-size: 0.875rem;
		font-weight: 700;
		color: #000;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		word-break: break-word;
		max-width: 100%;
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.model-emoji {
		font-size: 1.125rem;
		display: flex;
		align-items: center;
		color: #000;
	}

	.model-emoji :global(svg) {
		width: 1.125rem;
		height: 1.125rem;
	}

	.toolbar-actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.toolbar-decoration {
		position: absolute;
		bottom: -6px;
		left: 0;
		right: 0;
		height: 3px;
		background: repeating-linear-gradient(90deg, #000, #000 8px, #98fb98 8px, #98fb98 16px);
	}

	@media (max-width: 600px) {
		.toolbar {
			padding: 0.875rem 1rem;
		}

		.model-info {
			font-size: 0.75rem;
		}
	}
</style>
