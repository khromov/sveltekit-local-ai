<script lang="ts">
	import ChevronDownIcon from 'virtual:icons/lucide/chevron-down';
	import ChevronUpIcon from 'virtual:icons/lucide/chevron-up';

	interface Props {
		tokens: number[];
		decodedTokens: string[];
		showRawTokens?: boolean;
	}

	let { tokens, decodedTokens, showRawTokens = $bindable(false) }: Props = $props();

	const tokenCount = $derived(tokens.length);
</script>

<div class="tokens-section">
	<button class="toggle-button" onclick={() => (showRawTokens = !showRawTokens)}>
		{#if showRawTokens}
			<ChevronUpIcon />
		{:else}
			<ChevronDownIcon />
		{/if}
		Raw Tokens ({tokenCount})
	</button>

	{#if showRawTokens}
		<div class="tokens-display">
			<div class="tokens-grid">
				{#each decodedTokens as token, i}
					<div class="token-item" title={`Token ID: ${tokens[i]}`}>
						<span class="token-id">{tokens[i]}</span>
						<span class="token-text">{token}</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.tokens-section {
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

	.toggle-button :global(svg) {
		width: 1rem;
		height: 1rem;
		transition: transform 0.2s;
	}

	.tokens-display {
		padding: 1rem;
		background: var(--color-background-main);
		border-top: var(--border-brutalist-thin);
		max-height: 400px;
		overflow-y: auto;
	}

	.tokens-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
		gap: 0.5rem;
	}

	.token-item {
		display: flex;
		flex-direction: column;
		padding: 0.5rem;
		background: var(--color-background-secondary);
		border: var(--border-brutalist-thin);
		border-radius: 4px;
		font-family: var(--font-family-mono);
		font-size: 0.75rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.token-item:hover {
		background: var(--color-background-tertiary);
		transform: translate(-1px, -1px);
		box-shadow: var(--shadow-brutalist-small);
	}

	.token-id {
		font-weight: 700;
		color: var(--color-text-secondary);
		font-size: 0.7rem;
		margin-bottom: 0.25rem;
	}

	.token-text {
		color: var(--color-text-primary);
		word-break: break-all;
		white-space: pre-wrap;
		line-height: 1.2;
	}

	/* Custom scrollbar for tokens display */
	.tokens-display::-webkit-scrollbar {
		width: 8px;
	}

	.tokens-display::-webkit-scrollbar-track {
		background: var(--color-background-tertiary);
	}

	.tokens-display::-webkit-scrollbar-thumb {
		background: var(--color-text-secondary);
		border-radius: 4px;
	}

	.tokens-display::-webkit-scrollbar-thumb:hover {
		background: var(--color-text-primary);
	}
</style>
