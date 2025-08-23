<!-- Shared Statistics Display Component -->
<script lang="ts">
	interface Stat {
		label: string;
		value: string | number;
		icon?: any;
		color?: 'primary' | 'success' | 'warning' | 'info' | 'danger';
	}

	interface Props {
		stats: Stat[];
		layout?: 'horizontal' | 'grid';
		size?: 'small' | 'medium' | 'large';
	}

	let { stats, layout = 'horizontal', size = 'medium' }: Props = $props();

	function formatNumber(num: number): string {
		return new Intl.NumberFormat().format(num);
	}

	function formatValue(value: string | number): string {
		if (typeof value === 'number') {
			return formatNumber(value);
		}
		return value;
	}

	const colorMap = {
		primary: 'var(--color-primary)',
		success: 'var(--color-success)',
		warning: 'var(--color-warning)',
		info: 'var(--color-accent-blue)',
		danger: 'var(--color-danger)'
	};
</script>

<div
	class="stats-display"
	class:horizontal={layout === 'horizontal'}
	class:grid={layout === 'grid'}
	class:size-{size}
>
	{#each stats as stat (stat.label)}
		<div
			class="stat-item"
			style="background: {stat.color ? colorMap[stat.color] : 'var(--color-background-secondary)'};"
		>
			{#if stat.icon}
				<span class="stat-icon">
					<stat.icon />
				</span>
			{/if}
			<div class="stat-content">
				<span class="stat-label">{stat.label}</span>
				<span class="stat-value">{formatValue(stat.value)}</span>
			</div>
		</div>
	{/each}
</div>

<style>
	.stats-display {
		display: flex;
		gap: 1rem;
	}

	.stats-display.horizontal {
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
	}

	.stats-display.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
	}

	.stat-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		background: var(--color-background-secondary);
		border: var(--border-brutalist-thin);
		box-shadow: var(--shadow-brutalist-small);
		border-radius: 6px;
		transition: all 0.2s;
	}

	.stats-display.grid .stat-item {
		flex-direction: column;
		text-align: center;
		padding: 1rem;
	}

	.stat-item:hover {
		transform: translate(-1px, -1px);
		box-shadow: var(--shadow-brutalist-medium);
	}

	.stat-icon {
		display: flex;
		align-items: center;
		color: var(--color-text-primary);
	}

	.stat-icon :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}

	.stat-content {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.stats-display.horizontal .stat-content {
		flex-direction: row;
		align-items: baseline;
		gap: 0.375rem;
	}

	.stat-label {
		font-size: 0.875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: var(--color-text-primary);
		opacity: 0.9;
	}

	.stat-value {
		font-weight: 700;
		color: var(--color-text-primary);
	}

	/* Size variations */
	.size-small .stat-item {
		padding: 0.5rem 0.75rem;
	}

	.size-small .stat-label {
		font-size: 0.75rem;
	}

	.size-small .stat-value {
		font-size: 0.875rem;
	}

	.size-small .stat-icon :global(svg) {
		width: 1rem;
		height: 1rem;
	}

	.size-medium .stat-value {
		font-size: 1rem;
	}

	.size-large .stat-item {
		padding: 1rem 1.25rem;
	}

	.size-large .stat-label {
		font-size: 1rem;
	}

	.size-large .stat-value {
		font-size: 1.75rem;
		font-family: var(--font-family-display);
	}

	.size-large .stat-icon :global(svg) {
		width: 1.5rem;
		height: 1.5rem;
	}

	.stats-display.grid.size-large .stat-item {
		padding: 1.5rem;
	}

	@media (max-width: 600px) {
		.stats-display.horizontal {
			flex-direction: column;
			align-items: stretch;
		}

		.stat-item {
			justify-content: space-between;
		}
	}
</style>
