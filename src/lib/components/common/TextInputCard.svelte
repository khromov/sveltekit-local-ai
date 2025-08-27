<script lang="ts">
	interface ActionButton {
		icon: any;
		title: string;
		onClick: () => void;
		disabled?: boolean;
		variant?: 'dice' | 'copy' | 'clear';
	}

	interface Props {
		title: string;
		text: string;
		placeholder?: string;
		disabled?: boolean;
		actionButtons: ActionButton[];
		showStats?: boolean;
		rotation?: number;
		minHeight?: string;
	}

	let {
		title,
		text = $bindable(),
		placeholder = 'Type or paste your text here...',
		disabled = false,
		actionButtons = [],
		showStats = true,
		rotation = 0.2,
		minHeight = '180px'
	}: Props = $props();

	// Calculate stats
	let charCount = $derived(text.length);
	let wordCount = $derived(text.trim() ? text.trim().split(/\s+/).length : 0);
</script>

<div class="text-input-section" style:transform="rotate({rotation}deg)">
	<div class="section-header">
		<div class="title-and-icons">
			<h3>{title}</h3>
			<div class="button-group mobile-icons">
				{#each actionButtons as button (button.title)}
					<button
						class="{button.variant || 'action'}-button"
						onclick={button.onClick}
						title={button.title}
						disabled={button.disabled}
					>
						<button.icon />
					</button>
				{/each}
			</div>
		</div>
		{#if showStats}
			<div class="stats-and-buttons desktop-only">
				<div class="text-stats">
					<span class="stat">
						<strong>{charCount.toLocaleString()}</strong> chars
					</span>
					<span class="stat-divider">•</span>
					<span class="stat">
						<strong>{wordCount.toLocaleString()}</strong> words
					</span>
				</div>
				<div class="button-group">
					{#each actionButtons as button (button.title)}
						<button
							class="{button.variant || 'action'}-button"
							onclick={button.onClick}
							title={button.title}
							disabled={button.disabled}
						>
							<button.icon />
						</button>
					{/each}
				</div>
			</div>
		{/if}
	</div>
	{#if showStats}
		<div class="mobile-stats">
			<div class="text-stats">
				<span class="stat">
					<strong>{charCount.toLocaleString()}</strong> characters
				</span>
				<span class="stat-divider">•</span>
				<span class="stat">
					<strong>{wordCount.toLocaleString()}</strong> words
				</span>
			</div>
		</div>
	{/if}

	<div class="text-input-wrapper">
		<textarea
			bind:value={text}
			{placeholder}
			class="text-input"
			{disabled}
			style:min-height={minHeight}
		></textarea>
	</div>
</div>

<style>
	.text-input-section {
		background: var(--color-background-main);
		border: var(--border-brutalist-thick);
		padding: 1.5rem;
		box-shadow: var(--shadow-brutalist-large);
		overflow: hidden;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.title-and-icons {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.button-group.mobile-icons {
		display: none;
	}

	.desktop-only {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.mobile-stats {
		display: none;
		margin-bottom: 1rem;
	}

	.section-header h3 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-text-primary);
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.text-input-wrapper {
		position: relative;
	}

	.text-input {
		width: 100%;
		min-height: 180px;
		padding: 1rem;
		border: var(--border-brutalist-thin);
		font-family: var(--font-family-primary);
		font-size: 1rem;
		resize: vertical;
		box-sizing: border-box;
		background: var(--color-background-main);
		transition: all 0.2s;
	}

	.text-input:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: var(--shadow-brutalist-small);
	}

	.text-input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.text-stats {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		flex-shrink: 0;
	}

	.stat {
		white-space: nowrap;
	}

	.stat-divider {
		color: var(--color-text-tertiary);
	}

	.stats-and-buttons {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-shrink: 0;
		min-width: 0;
	}

	.button-group {
		display: flex;
		gap: 0.5rem;
		flex-shrink: 0;
	}

	.dice-button,
	.copy-button,
	.clear-button,
	.action-button {
		width: 32px;
		height: 32px;
		background: var(--color-background-main);
		border: var(--border-brutalist-thin);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
		color: var(--color-text-primary);
	}

	.dice-button :global(svg),
	.copy-button :global(svg),
	.clear-button :global(svg),
	.action-button :global(svg) {
		width: 16px;
		height: 16px;
	}

	.copy-button:disabled,
	.action-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.dice-button:hover,
	.copy-button:hover:not(:disabled),
	.clear-button:hover,
	.action-button:hover:not(:disabled) {
		background: var(--color-primary);
		transform: translate(-1px, -1px);
		box-shadow: var(--shadow-brutalist-small);
	}

	@media (max-width: 600px) {
		.text-input-section {
			padding: 1rem;
		}

		.section-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}

		.title-and-icons {
			width: 100%;
			justify-content: space-between;
		}

		.button-group.mobile-icons {
			display: flex;
		}

		.desktop-only {
			display: none;
		}

		.mobile-stats {
			display: block;
		}
	}
</style>
