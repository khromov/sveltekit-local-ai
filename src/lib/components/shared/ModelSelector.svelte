<!-- Shared Model Selector Component -->
<script lang="ts">
	import ChevronDownIcon from 'virtual:icons/lucide/chevron-down';
	import CheckIcon from 'virtual:icons/lucide/check';
	import type { ComponentType } from 'svelte';

	interface ModelOption {
		id: string;
		name: string;
		description?: string;
		size?: string;
		icon?: ComponentType;
	}

	interface Props {
		models: ModelOption[];
		selectedModel: string | null;
		onModelSelect: (modelId: string) => void;
		onLoadModel?: () => void;
		isLoading?: boolean;
		isReady?: boolean;
		showAsCards?: boolean;
		showDropdown?: boolean;
		title?: string;
		stepNumber?: number;
	}

	let {
		models,
		selectedModel,
		onModelSelect,
		onLoadModel,
		isLoading = false,
		isReady = false,
		showAsCards = true,
		showDropdown = false,
		title = 'Select Model',
		stepNumber
	}: Props = $props();
</script>

<div class="model-selector">
	{#if title}
		<h3>
			{#if stepNumber}
				<span class="step-number">Step {stepNumber}:</span>
			{/if}
			{title}
		</h3>
	{/if}

	{#if showDropdown}
		<!-- Dropdown mode -->
		<div class="model-controls">
			<div class="select-container">
				<select
					value={selectedModel}
					onchange={(e) => onModelSelect(e.currentTarget.value)}
					disabled={isLoading}
				>
					{#each models as model (model.id)}
						<option value={model.id}>{model.name}</option>
					{/each}
				</select>
				<span class="select-arrow"><ChevronDownIcon /></span>
			</div>

			{#if onLoadModel}
				{#if !isReady}
					<button onclick={onLoadModel} disabled={isLoading} class="load-model-btn">
						{isLoading ? 'Loading Model...' : 'Load Model'}
					</button>
				{:else}
					<div class="model-ready">
						<span class="checkmark"><CheckIcon /></span>
						<span>Model Ready</span>
					</div>
				{/if}
			{/if}
		</div>
	{:else if showAsCards}
		<!-- Card mode -->
		<div class="model-cards">
			{#each models as model (model.id)}
				<button
					class="model-card"
					class:active={selectedModel === model.id}
					onclick={() => onModelSelect(model.id)}
					disabled={isLoading}
				>
					{#if model.icon}
						<div class="model-icon">
							<model.icon />
						</div>
					{/if}

					<div class="model-info">
						<h4>{model.name}</h4>
						{#if model.size}
							<div class="model-size">{model.size}</div>
						{/if}
						{#if model.description}
							<p class="model-description">{model.description}</p>
						{/if}
					</div>

					{#if selectedModel === model.id && isReady}
						<div class="model-badge">
							<CheckIcon />
							Ready
						</div>
					{/if}
				</button>
			{/each}
		</div>

		{#if onLoadModel && selectedModel && !isReady}
			<div class="load-button-container">
				<button onclick={onLoadModel} disabled={isLoading} class="load-model-btn primary">
					{isLoading ? 'Loading Model...' : 'Load Selected Model'}
				</button>
			</div>
		{/if}
	{/if}
</div>

<style>
	.model-selector {
		background: var(--color-background-main);
		border: var(--border-brutalist-thick);
		padding: 1.5rem;
		box-shadow: var(--shadow-brutalist-large);
		margin-bottom: 1.5rem;
		position: relative;
		transform: rotate(-0.2deg);
		animation: slideIn 0.4s ease-out;
	}

	@keyframes slideIn {
		from {
			transform: translateY(10px) rotate(-0.2deg);
			opacity: 0;
		}
		to {
			transform: translateY(0) rotate(-0.2deg);
			opacity: 1;
		}
	}

	.model-selector h3 {
		margin-top: 0;
		margin-bottom: 1.25rem;
		font-family: var(--font-family-display);
		font-size: 1.75rem;
		color: var(--color-text-primary);
		text-align: center;
		letter-spacing: 2px;
		text-transform: uppercase;
		background: var(--color-primary-dark);
		padding: 0.5rem 1rem;
		border: var(--border-brutalist-thick);
		box-shadow: var(--shadow-brutalist-medium);
		transform: rotate(1deg);
		width: fit-content;
		margin-left: auto;
		margin-right: auto;
	}

	.step-number {
		background: var(--color-text-primary);
		color: var(--color-text-inverse);
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.875rem;
		font-weight: 700;
		margin-right: 0.5rem;
		display: inline-block;
		transform: rotate(0deg);
	}

	/* Dropdown mode styles */
	.model-controls {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
	}

	.select-container {
		position: relative;
		width: 100%;
		max-width: 400px;
	}

	.model-controls select {
		width: 100%;
		padding: 0.75rem;
		padding-right: 2.5rem;
		border: var(--border-brutalist-thin);
		border-radius: 6px;
		font-size: 0.9375rem;
		font-weight: 500;
		background: var(--color-background-main);
		text-align: center;
		box-shadow: var(--shadow-brutalist-small);
		font-family: var(--font-family-primary);
		cursor: pointer;
		transition: all 0.2s;
		appearance: none;
	}

	.select-arrow {
		position: absolute;
		right: 0.75rem;
		top: 50%;
		transform: translateY(-50%);
		pointer-events: none;
		display: flex;
		align-items: center;
		color: var(--color-text-primary);
	}

	.select-arrow :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}

	.model-controls select:hover:not(:disabled) {
		box-shadow: var(--shadow-brutalist-medium);
	}

	.model-controls select:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.model-controls select:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	/* Card mode styles */
	.model-cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1rem;
	}

	.model-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		padding: 1.25rem 1rem;
		background: var(--color-background-tertiary);
		border: var(--border-brutalist-thick);
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.2s;
		font-family: var(--font-family-primary);
		box-shadow: var(--shadow-brutalist-medium);
		text-align: center;
		position: relative;
		overflow: hidden;
		transform: rotate(0.5deg);
	}

	.model-card:nth-child(even) {
		transform: rotate(-0.3deg);
	}

	.model-card:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.model-card:not(:disabled):hover {
		transform: translate(-2px, -2px) rotate(0deg);
		box-shadow: var(--shadow-brutalist-large);
		background: var(--color-background-pattern);
	}

	.model-card.active {
		background: var(--color-success);
		transform: translate(-2px, -2px) rotate(0deg);
		box-shadow: var(--shadow-brutalist-large);
		border-color: var(--color-text-primary);
	}

	.model-card.active:not(:disabled):hover {
		background: var(--color-success-hover);
	}

	.model-icon {
		font-size: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-text-primary);
		background: var(--color-background-main);
		border: var(--border-brutalist-thick);
		border-radius: 8px;
		padding: 0.75rem;
		box-shadow: var(--shadow-brutalist-small);
	}

	.model-icon :global(svg) {
		width: 2rem;
		height: 2rem;
	}

	.model-info {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.model-info h4 {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: var(--color-text-primary);
		line-height: 1.2;
	}

	.model-size {
		font-size: 0.75rem;
		color: var(--color-text-tertiary);
		background: var(--color-primary-dark);
		padding: 0.25rem 0.5rem;
		border: var(--border-brutalist-thin);
		border-radius: 4px;
		font-weight: 700;
		box-shadow: var(--shadow-brutalist-small);
		width: fit-content;
		margin: 0 auto;
	}

	.model-description {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		margin: 0.5rem 0 0 0;
		line-height: 1.3;
	}

	.model-badge {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		display: flex;
		align-items: center;
		gap: 0.25rem;
		background: var(--color-primary-dark);
		color: var(--color-text-primary);
		padding: 0.25rem 0.5rem;
		border: var(--border-brutalist-thin);
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
	}

	.model-badge :global(svg) {
		width: 0.875rem;
		height: 0.875rem;
	}

	/* Load button */
	.load-button-container {
		display: flex;
		justify-content: center;
		margin-top: 1.5rem;
	}

	.load-model-btn {
		padding: 0.875rem 1.75rem;
		background: var(--color-primary);
		color: var(--color-text-primary);
		border: var(--border-brutalist-thick);
		border-radius: 8px;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 700;
		transition: all 0.2s;
		box-shadow: var(--shadow-brutalist-medium);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-family: var(--font-family-primary);
		min-width: 180px;
	}

	.load-model-btn.primary {
		background: var(--color-success);
		transform: rotate(-0.5deg);
	}

	.load-model-btn:hover:not(:disabled) {
		transform: translate(-2px, -2px);
		box-shadow: var(--shadow-brutalist-large);
		background: var(--color-primary-dark);
	}

	.load-model-btn.primary:hover:not(:disabled) {
		background: var(--color-primary-dark);
		transform: translate(-3px, -3px) rotate(0deg);
		box-shadow: var(--shadow-brutalist-xlarge);
	}

	.load-model-btn:disabled {
		background: var(--color-background-disabled);
		color: var(--color-text-disabled);
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
		opacity: 0.7;
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.7;
		}
		50% {
			opacity: 1;
		}
	}

	.model-ready {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--color-text-primary);
		font-weight: 600;
		font-size: 1rem;
		background: var(--color-accent-light-green);
		padding: 0.5rem 1rem;
		border: var(--border-brutalist-thin);
		border-radius: 6px;
		text-transform: uppercase;
	}

	.checkmark {
		font-size: 1.25rem;
		color: var(--color-text-primary);
		display: flex;
		align-items: center;
	}

	.checkmark :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}

	@media (max-width: 768px) {
		.model-cards {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 600px) {
		.model-selector {
			padding: 1rem;
		}

		.model-selector h3 {
			font-size: 1.5rem;
		}

		.model-controls {
			align-items: stretch;
		}

		.select-container {
			max-width: none;
		}
	}
</style>
