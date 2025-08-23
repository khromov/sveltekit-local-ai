<script lang="ts">
	import { onMount } from 'svelte';
	import type { Tiktoken } from 'js-tiktoken';
	import BrainIcon from 'virtual:icons/lucide/brain';
	import TokenizerHeader from '$lib/components/count-tokens/TokenizerHeader.svelte';
	import TextInputSection from '$lib/components/count-tokens/TextInputSection.svelte';
	import TokenStats from '$lib/components/count-tokens/TokenStats.svelte';
	import TokenCostEstimation from '$lib/components/count-tokens/TokenCostEstimation.svelte';
	import RawTokensDisplay from '$lib/components/count-tokens/RawTokensDisplay.svelte';
	import InfoBox from '$lib/components/count-tokens/InfoBox.svelte';

	const { data } = $props();

	let text = $state('');
	let showRawTokens = $state(false);
	let encoder: Tiktoken | null = $state(null);

	// Derived values from text and encoder
	let charCount = $derived(text.length);
	let tokens = $derived.by(() => {
		if (!encoder || !text) return [];
		try {
			return encoder.encode(text);
		} catch (error) {
			console.error('Error encoding text:', error);
			return [];
		}
	});
	let tokenCount = $derived(tokens.length);
	let decodedTokens = $derived.by(() => {
		if (!encoder || tokens.length === 0) return [];
		return tokens.map((tokenId: number) => {
			try {
				return encoder!.decode([tokenId]);
			} catch {
				return `[Token ${tokenId}]`;
			}
		});
	});

	// Example texts
	const exampleTexts = [
		"Hello! I'm Claude, an AI assistant created by Anthropic. I'm here to help with analysis, writing, math, coding, and many other tasks.",
		'The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once.',
		`function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`,
		'人工智能（Artificial Intelligence，简称AI）是计算机科学的一个分支，旨在创建能够执行通常需要人类智能的任务的系统。'
	];

	onMount(() => {
		if (data.encoder) {
			encoder = data.encoder;
			console.log('Encoder loaded successfully');
		}
	});

	// Cost calculation (approximate)
	function calculateCost(): { input: string; output: string } {
		// Claude 3 Opus pricing (as of 2024)
		const inputCostPer1M = 15.0; // $15 per 1M input tokens
		const outputCostPer1M = 75.0; // $75 per 1M output tokens

		const inputCost = (tokenCount / 1_000_000) * inputCostPer1M;
		const outputCost = (tokenCount / 1_000_000) * outputCostPer1M;

		return {
			input: inputCost < 0.01 ? '<$0.01' : `$${inputCost.toFixed(4)}`,
			output: outputCost < 0.01 ? '<$0.01' : `$${outputCost.toFixed(4)}`
		};
	}
</script>

<div class="tokenizer-container">
	<TokenizerHeader
		icon={BrainIcon}
		title="Anthropic Claude Tokenizer"
		description="Count tokens for Claude 3 models (Opus, Sonnet, Haiku) using the official tokenizer"
	/>

	<div class="tokenizer-main">
		<TextInputSection bind:text {exampleTexts} />

		<!-- Results Section -->
		{#if tokenCount > 0}
			{@const cost = calculateCost()}
			<div class="results-section">
				<TokenStats {tokenCount} {charCount} />
				<TokenCostEstimation costs={cost} title="Estimated Cost (Claude 3 Opus)" />
				<RawTokensDisplay {tokens} {decodedTokens} bind:showRawTokens />
			</div>
		{:else if encoder && text.length === 0}
			<div class="empty-state">
				<p>Enter some text above to see the token count</p>
			</div>
		{/if}
	</div>

	<InfoBox
		title="About Claude's Tokenizer"
		items={[
			'Claude uses a BPE (Byte Pair Encoding) tokenizer similar to GPT models',
			'Average token length: ~4 characters for English text',
			'Context window: 200K tokens (Claude 3)',
			'Special characters and code may use more tokens'
		]}
	/>
</div>

<style>
	.tokenizer-container {
		max-width: 900px;
		margin: 0 auto;
		padding: 1rem;
		animation: fadeIn 0.5s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.tokenizer-header {
		background: var(--color-background-main);
		border: var(--border-brutalist-thick);
		box-shadow: var(--shadow-brutalist-large);
		padding: 1.5rem;
		margin-bottom: 2rem;
		transform: rotate(-0.3deg);
	}

	.header-content {
		text-align: center;
	}

	.header-title {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.header-icon {
		display: flex;
		align-items: center;
		color: var(--color-text-primary);
		font-size: 2rem;
	}

	.header-icon :global(svg) {
		width: 2rem;
		height: 2rem;
	}

	.tokenizer-header h1 {
		margin: 0;
		font-family: var(--font-family-display);
		font-size: 2rem;
		color: var(--color-text-primary);
		text-transform: uppercase;
		letter-spacing: 2px;
	}

	.header-description {
		margin: 0;
		font-size: 1rem;
		color: var(--color-text-secondary);
	}

	.tokenizer-main {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.input-section {
		background: var(--color-background-main);
		border: var(--border-brutalist-thick);
		box-shadow: var(--shadow-brutalist-large);
		padding: 1.5rem;
		transform: rotate(0.2deg);
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
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

	.header-actions {
		display: flex;
		gap: 0.5rem;
	}

	.icon-button {
		width: 36px;
		height: 36px;
		background: var(--color-background-main);
		border: var(--border-brutalist-thin);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
		color: var(--color-text-primary);
		border-radius: 6px;
	}

	.icon-button :global(svg) {
		width: 18px;
		height: 18px;
	}

	.icon-button:hover {
		background: var(--color-primary);
		transform: translate(-1px, -1px);
		box-shadow: var(--shadow-brutalist-small);
	}

	.text-input {
		width: 100%;
		min-height: 200px;
		padding: 1rem;
		border: var(--border-brutalist-thin);
		font-family: var(--font-family-primary);
		font-size: 1rem;
		resize: vertical;
		box-sizing: border-box;
		background: var(--color-background-main);
		transition: all 0.2s;
		border-radius: 6px;
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

	.calculate-button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		width: 100%;
		margin-top: 1rem;
		padding: 0.875rem;
		background: var(--color-success);
		color: var(--color-text-primary);
		border: var(--border-brutalist-thick);
		cursor: pointer;
		font-size: 1rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-family: var(--font-family-primary);
		box-shadow: var(--shadow-brutalist-medium);
		transition: all 0.2s;
		border-radius: 6px;
	}

	.calculate-button :global(svg) {
		width: 20px;
		height: 20px;
	}

	.calculate-button:hover:not(:disabled) {
		transform: translate(-2px, -2px);
		box-shadow: var(--shadow-brutalist-large);
		background: var(--color-success-hover);
	}

	.calculate-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.results-section {
		background: var(--color-background-main);
		border: var(--border-brutalist-thick);
		box-shadow: var(--shadow-brutalist-large);
		padding: 1.5rem;
		transform: rotate(-0.2deg);
		animation: slideIn 0.3s ease-out;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(10px) rotate(-0.2deg);
		}
		to {
			opacity: 1;
			transform: translateY(0) rotate(-0.2deg);
		}
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.stat-card {
		background: var(--color-background-secondary);
		border: var(--border-brutalist-thin);
		padding: 1rem;
		text-align: center;
		box-shadow: var(--shadow-brutalist-small);
		border-radius: 6px;
		transition: all 0.2s;
	}

	.stat-card.tokens {
		background: var(--color-success);
	}

	.stat-card.chars {
		background: var(--color-accent-blue);
	}

	.stat-card.ratio {
		background: var(--color-accent-pink);
	}

	.stat-card:hover {
		transform: translate(-1px, -1px);
		box-shadow: var(--shadow-brutalist-medium);
	}

	.stat-label {
		font-size: 0.875rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: var(--color-text-primary);
		margin-bottom: 0.5rem;
	}

	.stat-value {
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--color-text-primary);
		font-family: var(--font-family-display);
	}

	.cost-section {
		background: var(--color-background-tertiary);
		border: var(--border-brutalist-thin);
		padding: 1rem;
		border-radius: 6px;
		margin-bottom: 1.5rem;
	}

	.cost-section h4 {
		margin: 0 0 0.75rem 0;
		font-size: 1rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: var(--color-text-primary);
	}

	.cost-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.cost-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem;
		background: var(--color-background-main);
		border: var(--border-brutalist-thin);
		border-radius: 4px;
	}

	.cost-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text-secondary);
	}

	.cost-value {
		font-size: 1rem;
		font-weight: 700;
		color: var(--color-text-primary);
	}

	.tokens-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.toggle-button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.75rem;
		background: var(--color-primary-dark);
		color: var(--color-text-primary);
		border: var(--border-brutalist-thick);
		cursor: pointer;
		font-size: 1rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-family: var(--font-family-primary);
		box-shadow: var(--shadow-brutalist-small);
		transition: all 0.2s;
		border-radius: 6px;
	}

	.toggle-button :global(svg) {
		width: 20px;
		height: 20px;
	}

	.toggle-button:hover {
		background: var(--color-warning);
		transform: translate(-1px, -1px);
		box-shadow: var(--shadow-brutalist-medium);
	}

	.tokens-display {
		background: var(--color-background-tertiary);
		border: var(--border-brutalist-thin);
		padding: 1rem;
		border-radius: 6px;
		max-height: 400px;
		overflow-y: auto;
		animation: expand 0.3s ease-out;
	}

	@keyframes expand {
		from {
			opacity: 0;
			max-height: 0;
		}
		to {
			opacity: 1;
			max-height: 400px;
		}
	}

	.tokens-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.token-item {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		padding: 0.5rem;
		background: var(--color-background-main);
		border: var(--border-brutalist-thin);
		border-radius: 4px;
		font-size: 0.875rem;
		transition: all 0.2s;
	}

	.token-item:hover {
		background: var(--color-primary);
		transform: translate(-1px, -1px);
		box-shadow: var(--shadow-brutalist-small);
	}

	.token-id {
		font-size: 0.625rem;
		color: var(--color-text-tertiary);
		font-weight: 600;
		margin-bottom: 0.25rem;
	}

	.token-text {
		font-family: monospace;
		color: var(--color-text-primary);
		font-weight: 600;
		white-space: pre;
	}

	.empty-state {
		text-align: center;
		padding: 3rem;
		color: var(--color-text-tertiary);
		font-size: 1.125rem;
	}

	.info-box {
		background: var(--color-background-secondary);
		border: var(--border-brutalist-thick);
		padding: 1.5rem;
		box-shadow: var(--shadow-brutalist-medium);
		transform: rotate(0.1deg);
	}

	.info-box h4 {
		margin: 0 0 1rem 0;
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-text-primary);
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.info-box ul {
		margin: 0;
		padding-left: 1.5rem;
	}

	.info-box li {
		font-size: 0.9375rem;
		color: var(--color-text-secondary);
		line-height: 1.5;
		margin: 0.5rem 0;
	}

	/* Scrollbar styles */
	.tokens-display::-webkit-scrollbar {
		width: 8px;
	}

	.tokens-display::-webkit-scrollbar-track {
		background: var(--color-background-tertiary);
		border-radius: 4px;
	}

	.tokens-display::-webkit-scrollbar-thumb {
		background: var(--color-text-primary);
		border-radius: 4px;
	}

	.tokens-display::-webkit-scrollbar-thumb:hover {
		background: var(--color-text-secondary);
	}

	@media (max-width: 768px) {
		.tokenizer-header h1 {
			font-size: 1.5rem;
		}

		.stats-grid {
			grid-template-columns: 1fr;
		}

		.cost-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 600px) {
		.tokenizer-container {
			padding: 0.75rem;
		}

		.tokenizer-header,
		.input-section,
		.results-section,
		.info-box {
			padding: 1rem;
		}

		.header-title {
			flex-direction: column;
			gap: 0.5rem;
		}

		.section-header {
			flex-direction: column;
			gap: 0.75rem;
			align-items: stretch;
		}

		.header-actions {
			justify-content: center;
		}
	}
</style>
