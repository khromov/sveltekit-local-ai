<script lang="ts">
	interface Props {
		message?: string;
		icon?: any;
		action?: { label: string; onClick: () => void };
	}

	let { message = 'No data available', icon: Icon, action }: Props = $props();
</script>

<div class="empty-state">
	<div class="empty-state-content">
		{#if Icon}
			<div class="empty-state-icon">
				<Icon />
			</div>
		{:else}
			<div class="empty-state-icon">
				<span class="dots">⋯</span>
			</div>
		{/if}
		<p>{message}</p>
		{#if action}
			<button class="empty-state-action" onclick={action.onClick}>
				{action.label}
			</button>
		{/if}
	</div>
</div>

<style>
	.empty-state {
		background: var(--color-background-main);
		border: var(--border-brutalist-thick);
		box-shadow: var(--shadow-brutalist-large);
		padding: 3rem 2rem;
		transform: rotate(0.1deg);
		border-radius: 8px;
		text-align: center;
		transition: all 0.2s;
	}

	.empty-state:hover {
		transform: rotate(0deg) translate(-2px, -2px);
		box-shadow: var(--shadow-brutalist-xlarge);
	}

	.empty-state-content {
		max-width: 400px;
		margin: 0 auto;
	}

	.empty-state-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 4rem;
		height: 4rem;
		margin: 0 auto 1.5rem auto;
		background: var(--color-background-secondary);
		border: var(--border-brutalist-thick);
		border-radius: 50%;
		color: var(--color-text-secondary);
		font-size: 1.5rem;
		transform: rotate(-0.2deg);
		box-shadow: var(--shadow-brutalist-medium);
	}

	.empty-state-icon :global(svg) {
		width: 2rem;
		height: 2rem;
	}

	.dots {
		font-size: 2rem;
		font-weight: bold;
		line-height: 1;
	}

	.empty-state p {
		margin: 0 0 1.5rem 0;
		color: var(--color-text-secondary);
		font-size: 1rem;
		line-height: 1.6;
	}

	.empty-state-action {
		padding: 0.75rem 1.5rem;
		background: var(--color-primary);
		color: var(--color-text-primary);
		border: var(--border-brutalist-thick);
		border-radius: 6px;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 700;
		transition: all 0.2s;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-family: var(--font-family-primary);
		box-shadow: var(--shadow-brutalist-medium);
	}

	.empty-state-action:hover {
		transform: translate(-2px, -2px);
		box-shadow: var(--shadow-brutalist-large);
		background: var(--color-primary-dark);
	}

	@media (max-width: 600px) {
		.empty-state {
			padding: 2rem 1rem;
		}
	}
</style>
