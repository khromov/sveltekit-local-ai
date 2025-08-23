<script lang="ts">
	interface Props {
		tokenCount: number;
		charCount: number;
	}

	let { tokenCount, charCount }: Props = $props();

	function formatNumber(num: number): string {
		return new Intl.NumberFormat().format(num);
	}
</script>

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

<style>
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
</style>
