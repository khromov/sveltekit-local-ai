<script lang="ts">
	interface CostData {
		input: string;
		output: string;
	}

	interface SingleModelCost extends CostData {}

	interface MultiModelCost {
		[modelName: string]: CostData;
	}

	interface Props {
		costs: SingleModelCost | MultiModelCost;
		title: string;
	}

	let { costs, title }: Props = $props();

	// Determine if costs is single model or multi-model
	const isMultiModel = $derived(() => {
		return 'input' in costs ? false : true;
	});

	const singleCost = $derived(() => {
		return isMultiModel() ? null : (costs as SingleModelCost);
	});

	const multiCosts = $derived(() => {
		return isMultiModel() ? (costs as MultiModelCost) : null;
	});
</script>

<div class="cost-section">
	<h4>{title}</h4>

	{#if singleCost()}
		<!-- Single model cost display (Anthropic) -->
		<div class="cost-grid">
			<div class="cost-item">
				<span class="cost-label">Input:</span>
				<span class="cost-value">{singleCost().input}</span>
			</div>
			<div class="cost-item">
				<span class="cost-label">Output:</span>
				<span class="cost-value">{singleCost().output}</span>
			</div>
		</div>
	{:else if multiCosts}
		<!-- Multiple model cost display (OpenAI) -->
		<div class="model-costs">
			{#each Object.entries(multiCosts) as [modelName, modelCosts]}
				<div class="model-cost-card">
					<h5>{modelName.toUpperCase().replace('GPT', 'GPT-').replace('35', '3.5')}</h5>
					<div class="cost-row">
						<span class="cost-label">Input:</span>
						<span class="cost-value">{modelCosts.input}</span>
					</div>
					<div class="cost-row">
						<span class="cost-label">Output:</span>
						<span class="cost-value">{modelCosts.output}</span>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
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

	/* Single model cost styles */
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
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--color-text-primary);
		font-family: var(--font-family-mono);
	}

	/* Multi-model cost styles */
	.model-costs {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}

	.model-cost-card {
		background: var(--color-background-main);
		border: var(--border-brutalist-thin);
		border-radius: 6px;
		padding: 1rem;
		box-shadow: var(--shadow-brutalist-small);
	}

	.model-cost-card h5 {
		margin: 0 0 0.75rem 0;
		font-size: 1rem;
		font-weight: 700;
		color: var(--color-text-primary);
		text-align: center;
		font-family: var(--font-family-display);
	}

	.cost-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.cost-row:last-child {
		margin-bottom: 0;
	}
</style>
