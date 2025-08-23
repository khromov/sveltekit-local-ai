<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import type { Tiktoken } from 'js-tiktoken';
	import MessageSquareIcon from 'virtual:icons/lucide/message-square';
	import SparklesIcon from 'virtual:icons/lucide/sparkles';
	import ChevronDownIcon from 'virtual:icons/lucide/chevron-down';
	import ChevronUpIcon from 'virtual:icons/lucide/chevron-up';
	import CopyIcon from 'virtual:icons/lucide/copy';
	import CheckIcon from 'virtual:icons/lucide/check';
	import TrashIcon from 'virtual:icons/lucide/trash';
	import DicesIcon from 'virtual:icons/lucide/dices';
	import { toast } from 'svelte-sonner';

	const { data } = $props();

	let text = $state('');
	let tokens: number[] = $state([]);
	let tokenCount = $state(0);
	let charCount = $state(0);
	let showRawTokens = $state(false);
	let copied = $state(false);
	let encoder: Tiktoken | null = $state(null);
	let isProcessing = $state(false);
	let decodedTokens: string[] = $state([]);

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

	// Calculate character count
	$effect(() => {
		charCount = text.length;
	});

	// Auto-calculate for small texts
	$effect(() => {
		if (encoder && text && text.length < 2000) {
			untrack(() => calculateTokens());
		} else if (!text) {
			untrack(() => {
				tokens = [];
				tokenCount = 0;
				decodedTokens = [];
			});
		}
	});

	onMount(() => {
		if (data.encoder) {
			encoder = data.encoder;
			console.log('Encoder loaded successfully');
		}
	});

	function calculateTokens() {
		if (!encoder || !text) {
			tokens = [];
			tokenCount = 0;
			decodedTokens = [];
			return;
		}

		isProcessing = true;
		try {
			// Encode the text to get token IDs
			tokens = encoder.encode(text);
			tokenCount = tokens.length;

			// Decode each token individually to show what it represents
			decodedTokens = tokens.map((tokenId) => {
				try {
					return encoder!.decode([tokenId]);
				} catch {
					return `[Token ${tokenId}]`;
				}
			});
		} catch (error) {
			console.error('Error encoding text:', error);
			toast.error('Failed to tokenize text');
			tokens = [];
			tokenCount = 0;
			decodedTokens = [];
		} finally {
			isProcessing = false;
		}
	}

	function handleRandomExample() {
		const randomText = exampleTexts[Math.floor(Math.random() * exampleTexts.length)];
		text = randomText;
	}

	function handleClear() {
		text = '';
		tokens = [];
		tokenCount = 0;
		decodedTokens = [];
		showRawTokens = false;
	}

	async function handleCopy() {
		try {
			await navigator.clipboard.writeText(text);
			copied = true;
			toast.success('Text copied to clipboard!');
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch {
			toast.error('Failed to copy text');
		}
	}

	function formatNumber(num: number): string {
		return new Intl.NumberFormat().format(num);
	}

	// Cost calculation (approximate)
	function calculateCost(): {
		gpt4o: { input: string; output: string };
		gpt4: { input: string; output: string };
		gpt35: { input: string; output: string };
	} {
		// OpenAI pricing (as of 2024)
		const pricing = {
			gpt4o: { input: 2.5, output: 10.0 }, // per 1M tokens
			gpt4: { input: 10.0, output: 30.0 }, // per 1M tokens
			gpt35: { input: 0.5, output: 1.5 } // per 1M tokens
		};

		const calculateForModel = (model: keyof typeof pricing) => {
			const inputCost = (tokenCount / 1_000_000) * pricing[model].input;
			const outputCost = (tokenCount / 1_000_000) * pricing[model].output;
			return {
				input: inputCost < 0.01 ? '<$0.01' : `$${inputCost.toFixed(4)}`,
				output: outputCost < 0.01 ? '<$0.01' : `$${outputCost.toFixed(4)}`
			};
		};

		return {
			gpt4o: calculateForModel('gpt4o'),
			gpt4: calculateForModel('gpt4'),
			gpt35: calculateForModel('gpt35')
		};
	}
</script>

<div class="tokenizer-container">
	<div class="tokenizer-header">
		<div class="header-content">
			<div class="header-title">
				<span class="header-icon"><MessageSquareIcon /></span>
				<h1>OpenAI ChatGPT Tokenizer</h1>
			</div>
			<p class="header-description">
				Count tokens for GPT-4, GPT-4o, GPT-3.5 Turbo and other OpenAI models
			</p>
		</div>
	</div>

	<div class="tokenizer-main">
		<!-- Text Input Section -->
		<div class="input-section">
			<div class="section-header">
				<h3>Input Text</h3>
				<div class="header-actions">
					<button class="icon-button" onclick={handleRandomExample} title="Load example">
						<DicesIcon />
					</button>
					<button class="icon-button" onclick={handleCopy} title={copied ? 'Copied!' : 'Copy text'}>
						{#if copied}
							<CheckIcon />
						{:else}
							<CopyIcon />
						{/if}
					</button>
					<button class="icon-button" onclick={handleClear} title="Clear text">
						<TrashIcon />
					</button>
				</div>
			</div>

			<textarea
				bind:value={text}
				placeholder="Enter or paste your text here to count tokens..."
				class="text-input"
				disabled={isProcessing}
			></textarea>

			{#if text.length >= 2000 && encoder}
				<button class="calculate-button" onclick={calculateTokens} disabled={isProcessing}>
					<SparklesIcon />
					{isProcessing ? 'Calculating...' : 'Calculate Tokens'}
				</button>
			{/if}
		</div>

		<!-- Results Section -->
		{#if tokenCount > 0}
			{@const costs = calculateCost()}
			<div class="results-section">
				<div class="stats-grid">
					<div class="stat-card tokens">
						<div class="stat-label">Tokens</div>
						<div class="stat-value">{formatNumber(tokenCount)}</div>
					</div>
					<div class="stat-card chars">
						<div class="stat-label">Characters</div>
						<div class="stat-value">{formatNumber(charCount)}</div>
					</div>
					<div class="stat-card ratio">
						<div class="stat-label">Chars/Token</div>
						<div class="stat-value">{(charCount / tokenCount).toFixed(2)}</div>
					</div>
				</div>

				<!-- Cost Estimation -->
				<div class="cost-section">
					<h4>Estimated API Costs</h4>
					<div class="model-costs">
						<div class="model-cost-card">
							<h5>GPT-4o</h5>
							<div class="cost-row">
								<span class="cost-label">Input:</span>
								<span class="cost-value">{costs.gpt4o.input}</span>
							</div>
							<div class="cost-row">
								<span class="cost-label">Output:</span>
								<span class="cost-value">{costs.gpt4o.output}</span>
							</div>
						</div>
						<div class="model-cost-card">
							<h5>GPT-4</h5>
							<div class="cost-row">
								<span class="cost-label">Input:</span>
								<span class="cost-value">{costs.gpt4.input}</span>
							</div>
							<div class="cost-row">
								<span class="cost-label">Output:</span>
								<span class="cost-value">{costs.gpt4.output}</span>
							</div>
						</div>
						<div class="model-cost-card">
							<h5>GPT-3.5 Turbo</h5>
							<div class="cost-row">
								<span class="cost-label">Input:</span>
								<span class="cost-value">{costs.gpt35.input}</span>
							</div>
							<div class="cost-row">
								<span class="cost-label">Output:</span>
								<span class="cost-value">{costs.gpt35.output}</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Raw Tokens Display -->
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
			</div>
		{:else if encoder && text.length === 0}
			<div class="empty-state">
				<p>Enter some text above to see the token count</p>
			</div>
		{/if}
	</div>

	<!-- Info Section -->
	<div class="info-box">
		<h4>About OpenAI's Tokenizer</h4>
		<ul>
			<li>Uses o200k_base encoding for GPT-4o and newer models</li>
			<li>Average token length: ~4 characters for English text</li>
			<li>Context windows: 128K tokens (GPT-4o), 8K-32K (GPT-4), 16K (GPT-3.5)</li>
			<li>Code and special characters typically use more tokens</li>
		</ul>
	</div>
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
		background: var(--color-warning);
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
		margin: 0 0 1rem 0;
		font-size: 1rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: var(--color-text-primary);
	}

	.model-costs {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}

	.model-cost-card {
		background: var(--color-background-main);
		border: var(--border-brutalist-thin);
		padding: 0.75rem;
		border-radius: 4px;
	}

	.model-cost-card h5 {
		margin: 0 0 0.5rem 0;
		font-size: 0.875rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: var(--color-text-primary);
		text-align: center;
		padding-bottom: 0.5rem;
		border-bottom: var(--border-brutalist-thin);
	}

	.cost-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.25rem 0;
	}

	.cost-label {
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--color-text-secondary);
	}

	.cost-value {
		font-size: 0.875rem;
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

		.model-costs {
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
