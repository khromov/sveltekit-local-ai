<script lang="ts">
	interface Props {
		label: string;
		value: string | number;
		icon?: any;
		color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
	}

	let { label, value, icon: Icon, color = 'primary' }: Props = $props();

	const colorStyles = {
		primary: 'var(--color-primary-dark)',
		success: 'var(--color-success)',
		warning: 'var(--color-warning)',
		danger: 'var(--color-danger)',
		info: 'var(--color-accent-blue)'
	};
</script>

<div class="stat-card" style="background: {colorStyles[color]};">
	{#if Icon}
		<div class="stat-icon">
			<Icon />
		</div>
	{/if}
	<div class="stat-content">
		<div class="stat-label">{label}</div>
		<div class="stat-value">{value}</div>
	</div>
</div>

<style>
	.stat-card {
		background: var(--color-primary-dark);
		border: var(--border-brutalist-thick);
		padding: 1.25rem;
		text-align: center;
		box-shadow: var(--shadow-brutalist-medium);
		border-radius: 8px;
		transition: all 0.2s;
		transform: rotate(-0.5deg);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
	}

	.stat-card:hover {
		transform: translate(-2px, -2px) rotate(0deg);
		box-shadow: var(--shadow-brutalist-large);
	}

	.stat-icon {
		width: 48px;
		height: 48px;
		background: var(--color-background-main);
		border: var(--border-brutalist-thin);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
		color: var(--color-text-primary);
		box-shadow: var(--shadow-brutalist-small);
	}

	.stat-icon :global(svg) {
		width: 1.5rem;
		height: 1.5rem;
	}

	.stat-content {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.stat-label {
		font-size: 0.875rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: var(--color-text-primary);
	}

	.stat-value {
		font-size: 2rem;
		font-weight: 700;
		color: var(--color-text-primary);
		font-family: var(--font-family-display);
		line-height: 1;
	}

	@media (max-width: 600px) {
		.stat-card {
			padding: 1rem;
		}

		.stat-value {
			font-size: 1.5rem;
		}
	}
</style>
