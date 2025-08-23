<script lang="ts">
	import DicesIcon from 'virtual:icons/lucide/dices';
	import CopyIcon from 'virtual:icons/lucide/copy';
	import CheckIcon from 'virtual:icons/lucide/check';
	import TrashIcon from 'virtual:icons/lucide/trash';
	import { toast } from 'svelte-sonner';

	interface Props {
		text: string;
		exampleTexts: string[];
		placeholder?: string;
	}

	let {
		text = $bindable(),
		exampleTexts,
		placeholder = 'Enter or paste your text here to count tokens...'
	}: Props = $props();

	let copied = $state(false);

	function handleRandomExample() {
		const randomText = exampleTexts[Math.floor(Math.random() * exampleTexts.length)];
		text = randomText;
	}

	function handleClear() {
		text = '';
	}

	async function handleCopy() {
		if (!text) return;

		try {
			await navigator.clipboard.writeText(text);
			copied = true;
			toast.success('Text copied to clipboard!');
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch (error) {
			console.error('Failed to copy text:', error);
			toast.error('Failed to copy text');
		}
	}
</script>

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

	<textarea bind:value={text} {placeholder} class="text-input"></textarea>
</div>

<style>
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
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		background: var(--color-background-secondary);
		border: var(--border-brutalist-thin);
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s;
		color: var(--color-text-primary);
		font-size: 1rem;
	}

	.icon-button:hover:not(:disabled) {
		background: var(--color-background-tertiary);
		transform: translate(-1px, -1px);
		box-shadow: var(--shadow-brutalist-small);
	}

	.icon-button:active {
		transform: translate(1px, 1px);
		box-shadow: none;
	}

	.icon-button :global(svg) {
		width: 1rem;
		height: 1rem;
	}

	.text-input {
		width: 100%;
		height: 200px;
		background: var(--color-background-secondary);
		border: var(--border-brutalist-thin);
		border-radius: 6px;
		padding: 1rem;
		font-family: var(--font-family-mono);
		font-size: 0.9rem;
		color: var(--color-text-primary);
		resize: vertical;
		min-height: 120px;
		max-height: 400px;
		transition: all 0.2s;
		box-sizing: border-box;
	}

	.text-input:focus {
		outline: none;
		border-color: var(--color-accent-primary);
		box-shadow: 0 0 0 2px var(--color-accent-primary-alpha);
	}

	.text-input::placeholder {
		color: var(--color-text-tertiary);
		opacity: 1;
	}
</style>
