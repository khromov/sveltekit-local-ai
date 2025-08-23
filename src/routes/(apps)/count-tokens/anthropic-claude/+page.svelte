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

	.tokenizer-main {
		display: flex;
		flex-direction: column;
		gap: 2rem;
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

	.empty-state {
		text-align: center;
		padding: 3rem;
		color: var(--color-text-tertiary);
		font-size: 1.125rem;
	}

	@media (max-width: 600px) {
		.tokenizer-container {
			padding: 0.75rem;
		}

		.results-section {
			padding: 1rem;
		}
	}
</style>
