<script lang="ts">
	interface Props {
		title: string;
		count?: number;
		expanded?: boolean;
		backgroundColor?: string;
		contentBackgroundColor?: string;
		children?: import('svelte').Snippet;
	}

	let {
		title,
		count,
		expanded = $bindable(false),
		backgroundColor = 'var(--color-background-tertiary)',
		contentBackgroundColor = 'var(--color-background-main)',
		children
	}: Props = $props();
</script>

<div class="expandable-section" style:background={backgroundColor}>
	<button
		class="toggle-button"
		onclick={() => (expanded = !expanded)}
		style:background={backgroundColor}
	>
		<!-- Chevron icon inline -->
		{#if expanded}
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<polyline points="18,15 12,9 6,15"></polyline>
			</svg>
		{:else}
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<polyline points="6,9 12,15 18,9"></polyline>
			</svg>
		{/if}
		{title}
		{#if count !== undefined}
			({count})
		{/if}
	</button>

	{#if expanded}
		<div class="content-area" style:background={contentBackgroundColor}>
			{@render children?.()}
		</div>
	{/if}
</div>

<style>
	.expandable-section {
		background: var(--color-background-tertiary);
		border: var(--border-brutalist-thin);
		border-radius: 6px;
		overflow: hidden;
	}

	.toggle-button {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem;
		background: var(--color-background-tertiary);
		border: none;
		color: var(--color-text-primary);
		cursor: pointer;
		font-size: 1rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		transition: all 0.2s;
	}

	.toggle-button:hover {
		background: var(--color-background-secondary);
	}

	.toggle-button svg {
		transition: transform 0.2s;
		flex-shrink: 0;
	}

	.content-area {
		padding: 1rem;
		background: var(--color-background-main);
		border-top: var(--border-brutalist-thin);
		animation: slideDown 0.2s ease-out;
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

	/* Scrollbar styling for content that might overflow */
	.content-area::-webkit-scrollbar {
		width: 8px;
	}

	.content-area::-webkit-scrollbar-track {
		background: var(--color-background-tertiary);
	}

	.content-area::-webkit-scrollbar-thumb {
		background: var(--color-text-secondary);
		border-radius: 4px;
	}

	.content-area::-webkit-scrollbar-thumb:hover {
		background: var(--color-text-primary);
	}
</style>
