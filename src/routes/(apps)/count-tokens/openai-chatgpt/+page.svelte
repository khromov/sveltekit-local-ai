<script lang="ts">
	import { onMount } from 'svelte';
	import type { Tiktoken } from 'js-tiktoken';
	import MessageSquareIcon from 'virtual:icons/lucide/message-square';
	import TokenizerHeader from '$lib/components/count-tokens/TokenizerHeader.svelte';
	import TextInputSection from '$lib/components/count-tokens/TextInputSection.svelte';
	import TokenStats from '$lib/components/count-tokens/TokenStats.svelte';
	import RawTokensDisplay from '$lib/components/count-tokens/RawTokensDisplay.svelte';
	import InfoBox from '$lib/components/count-tokens/InfoBox.svelte';
	import EmptyState from '$lib/components/count-tokens/EmptyState.svelte';

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
		"Hello! I'm ChatGPT, an AI language model created by OpenAI. I can help you with questions, creative writing, analysis, and problem-solving.",
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
</script>

<div class="tokenizer-container">
	<TokenizerHeader
		icon={MessageSquareIcon}
		title="OpenAI ChatGPT Tokenizer"
		description="Count tokens for GPT-4, GPT-4o, GPT-3.5 Turbo and other OpenAI models"
	/>

	<div class="tokenizer-main">
		<TextInputSection bind:text {exampleTexts} />

		<!-- Results Section -->
		{#if tokenCount > 0}
			<div class="results-section">
				<TokenStats {tokenCount} {charCount} />
				<RawTokensDisplay {tokens} {decodedTokens} bind:showRawTokens />
			</div>
		{:else if encoder && text.length === 0}
			<EmptyState />
		{/if}
	</div>

	<InfoBox
		title="About OpenAI's Tokenizer"
		items={[
			'Uses o200k_base encoding for GPT-4o and newer models',
			'Average token length: ~4 characters for English text',
			'Context windows: 128K tokens (GPT-4o), 8K-32K (GPT-4), 16K (GPT-3.5)',
			'Code and special characters typically use more tokens'
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

	@media (max-width: 600px) {
		.tokenizer-container {
			padding: 0.75rem;
		}

		.results-section {
			padding: 1rem;
		}
	}
</style>
