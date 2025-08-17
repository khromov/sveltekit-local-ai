<script lang="ts">
	import { AVAILABLE_MODELS, formatFileSize } from '$lib/wllama-config';
	import { inferenceParams } from '$lib/stores';
	import AdvancedSection from '../common/AdvancedSection.svelte';
	import RocketIcon from 'virtual:icons/lucide/rocket';
	import ZapIcon from 'virtual:icons/lucide/zap';
	import HourglassIcon from 'virtual:icons/lucide/hourglass';
	import BrainIcon from 'virtual:icons/lucide/brain';
	import SmartphoneIcon from 'virtual:icons/lucide/smartphone';
	import SparklesIcon from 'virtual:icons/lucide/sparkles';

	interface Props {
		modelSelection: string;
		onLoadModel: () => void;
		isLoading?: boolean;
	}

	let { modelSelection = $bindable(), onLoadModel, isLoading = false }: Props = $props();

	// Get model pros
	function getModelPros(modelUrl: string) {
		const model = AVAILABLE_MODELS.find((m) => m.url === modelUrl);
		if (model?.name.includes('Gemma')) {
			return { icon: BrainIcon, text: 'Smarter AI responses' };
		} else if (model?.name.includes('SmolLM2')) {
			return { icon: SmartphoneIcon, text: 'Runs on most computers and phones' };
		}
		return { icon: SparklesIcon, text: 'High quality responses' };
	}
</script>

<div class="card-interface" style="animation: fadeIn 0.5s ease-out;">
	<div class="toolbar">
		<span class="model-info">
			<span class="model-emoji"><RocketIcon /></span>
			Chat with AI Models
		</span>
		<div class="toolbar-decoration"></div>
	</div>

	<div class="content-area">
		<!-- Model Selection -->
		<div class="model-selection">
			<h3><span class="step-number">Step 1:</span> Choose Your AI Model</h3>
			<div class="model-cards">
				{#each AVAILABLE_MODELS as model (model.url)}
					{@const pros = getModelPros(model.url)}
					<button
						class="model-card"
						class:active={modelSelection === model.url}
						onclick={() => (modelSelection = model.url)}
						disabled={isLoading}
					>
						<div class="card-decoration"></div>
						<div class="model-icon">
							<pros.icon></pros.icon>
						</div>
						<div class="model-header">
							<h4>{model.name}</h4>
							<div class="model-size">{formatFileSize(model.size)}</div>
						</div>
						<div class="model-pros">
							<span class="pros-icon"><pros.icon></pros.icon></span>
							<span class="pros-text">{pros.text}</span>
						</div>
					</button>
				{/each}
			</div>
		</div>

		<!-- Advanced Parameters -->
		<div class="advanced-section">
			<h3><span class="step-number">Step 2:</span> Advanced Settings</h3>
			<AdvancedSection>
				<label class="param-item">
					<span class="param-label">Threads <span class="param-hint">(-1 auto)</span></span>
					<input type="number" bind:value={$inferenceParams.nThreads} min="-1" max="32" />
				</label>
				<label class="param-item">
					<span class="param-label">Context Size</span>
					<input type="number" bind:value={$inferenceParams.nContext} min="512" max="8192" />
				</label>
				<label class="param-item">
					<span class="param-label">Temperature</span>
					<input
						type="number"
						bind:value={$inferenceParams.temperature}
						min="0"
						max="2"
						step="0.1"
					/>
				</label>
			</AdvancedSection>
		</div>
	</div>

	<!-- Load Model Button -->
	<div class="input-area">
		<button onclick={onLoadModel} class="load-button primary-button" disabled={isLoading}>
			{#if isLoading}
				<span class="loading-icon"><HourglassIcon /></span>
				Loading Model...
			{:else}
				<span class="button-icon"><ZapIcon /></span>
				Load Selected Model
			{/if}
		</button>

		<div class="disclaimer">
			<span class="disclaimer-icon"><RocketIcon /></span>
			Models run locally in your browser. No data is sent to external servers.
		</div>
	</div>
</div>

<style>
	.model-selection {
		background: var(--color-background-main);
		border: var(--border-brutalist-extra-thick);
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

	.model-selection h3 {
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

	.model-cards {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
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
		font-size: 0.875rem;
		font-weight: 600;
		transition: all 0.2s;
		font-family: var(--font-family-primary);
		box-shadow: var(--shadow-brutalist-medium);
		text-align: center;
		position: relative;
		overflow: hidden;
		transform: rotate(0.5deg);
	}

	.model-card:nth-child(2) {
		transform: rotate(-0.3deg);
	}

	.card-decoration {
		position: absolute;
		top: -6px;
		right: -6px;
		width: 30px;
		height: 30px;
		background: var(--color-success);
		border: var(--border-brutalist-thin);
		border-radius: 30% 70% 70% 30% / 60% 40% 60% 40%;
		opacity: 0.6;
		z-index: 0;
	}

	.model-card:nth-child(2) .card-decoration {
		background: var(--color-accent-pink);
		left: -6px;
		right: auto;
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
		position: relative;
		z-index: 1;
	}

	.model-icon :global(svg) {
		width: 2rem;
		height: 2rem;
	}

	.model-header {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
		position: relative;
		z-index: 1;
	}

	.model-header h4 {
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

	.model-pros {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		background: var(--color-background-main);
		padding: 0.5rem 0.75rem;
		border: var(--border-brutalist-thin);
		border-radius: 6px;
		box-shadow: var(--shadow-brutalist-small);
		position: relative;
		z-index: 1;
		width: 100%;
		box-sizing: border-box;
		justify-content: center;
	}

	.pros-icon {
		font-size: 1rem;
		display: flex;
		align-items: center;
		color: var(--color-text-primary);
		flex-shrink: 0;
	}

	.pros-icon :global(svg) {
		width: 1rem;
		height: 1rem;
	}

	.pros-text {
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--color-text-primary);
		text-transform: uppercase;
		letter-spacing: 0.25px;
		line-height: 1.2;
		text-align: center;
	}

	/* Advanced Section */
	.advanced-section {
		background: var(--color-background-main);
		border: var(--border-brutalist-extra-thick);
		padding: 1.5rem;
		box-shadow: var(--shadow-brutalist-large);
		margin-bottom: 1.5rem;
		position: relative;
		transform: rotate(0.1deg);
		animation: slideIn 0.4s ease-out;
		animation-delay: 0.1s;
		animation-fill-mode: both;
	}

	.advanced-section h3 {
		margin-top: 0;
		margin-bottom: 1rem;
		font-family: var(--font-family-display);
		font-size: 1.75rem;
		color: var(--color-text-primary);
		text-align: center;
		letter-spacing: 2px;
		text-transform: uppercase;
		background: var(--color-accent-pink);
		padding: 0.5rem 1rem;
		border: var(--border-brutalist-thick);
		box-shadow: var(--shadow-brutalist-medium);
		transform: rotate(-0.5deg);
		width: fit-content;
		margin-left: auto;
		margin-right: auto;
	}


	.param-item {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.param-label {
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--color-text-primary);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.param-hint {
		font-size: 0.75rem;
		color: var(--color-text-tertiary);
		font-weight: 400;
		text-transform: none;
		letter-spacing: 0;
	}

	.param-item input {
		padding: 0.625rem 0.75rem;
		border: var(--border-brutalist-thin);
		border-radius: 4px;
		font-size: 0.9375rem;
		font-weight: 600;
		background: var(--color-background-main);
		transition: all 0.2s;
		font-family: var(--font-family-primary);
		box-sizing: border-box;
		width: 100%;
		box-shadow: var(--shadow-brutalist-small);
	}

	.param-item input:hover {
		transform: translate(-1px, -1px);
		box-shadow: var(--shadow-brutalist-small);
	}

	.param-item input:focus {
		outline: none;
		border-color: #ffd700;
		background: var(--color-background-cream);
	}

	.load-button {
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		min-width: 280px;
		text-align: center;
		position: relative;
		overflow: hidden;
		text-transform: uppercase;
		padding: 1.25rem 2rem;
		font-size: 1.125rem;
		background: var(--color-success);
		transform: rotate(-0.5deg);
	}

	.load-button::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
		transition: left 0.5s;
	}

	.load-button:hover:not(:disabled)::before {
		left: 100%;
	}

	.load-button:hover:not(:disabled) {
		background: var(--color-primary-dark);
		transform: translate(-3px, -3px) rotate(0deg);
		box-shadow: var(--shadow-brutalist-xlarge);
	}

	.load-button:disabled {
		background: var(--color-background-disabled);
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

	.button-icon,
	.loading-icon {
		font-size: 1.5rem;
		display: flex;
		align-items: center;
		color: var(--color-text-primary);
	}

	.button-icon :global(svg),
	.loading-icon :global(svg) {
		width: 1.5rem;
		height: 1.5rem;
	}

	.loading-icon {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.disclaimer {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		margin-top: 1rem;
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--color-text-primary);
		text-align: center;
		background: var(--color-accent-blue);
		padding: 0.75rem 1rem;
		border: var(--border-brutalist-thick);
		box-shadow: 5px 5px 0 var(--color-text-primary);
		transform: rotate(0.5deg);
		width: fit-content;
		margin-left: auto;
		margin-right: auto;
	}

	.disclaimer-icon {
		font-size: 1.25rem;
		display: flex;
		align-items: center;
		color: var(--color-text-primary);
	}

	.disclaimer-icon :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}

	.toolbar-decoration {
		position: absolute;
		bottom: -8px;
		left: 0;
		right: 0;
		height: 4px;
		background: repeating-linear-gradient(
			90deg,
			var(--color-text-primary),
			var(--color-text-primary) 10px,
			var(--color-success) 10px,
			var(--color-success) 20px
		);
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px) rotate(-1deg);
		}
		to {
			opacity: 1;
			transform: translateY(0) rotate(-0.5deg);
		}
	}

	@media (max-width: 768px) {
		.model-cards {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.model-card {
			padding: 1.25rem 1rem;
		}

		.advanced-section {
			padding: 1.25rem;
		}

		.load-button {
			min-width: auto;
			width: 100%;
			justify-content: center;
			font-size: 1rem;
			padding: 1rem 1.5rem;
		}

		.disclaimer {
			font-size: 0.875rem;
			padding: 0.625rem 0.875rem;
		}
	}

	@media (max-width: 600px) {
		.model-selection,
		.advanced-section {
			padding: 1rem;
		}

		.model-selection h3,
		.advanced-section h3 {
			font-size: 1.5rem;
		}

		.model-icon {
			font-size: 1.75rem;
			padding: 0.625rem;
		}

		.model-icon :global(svg) {
			width: 1.75rem;
			height: 1.75rem;
		}

		.model-header h4 {
			font-size: 1rem;
		}

		.load-button {
			font-size: 0.875rem;
			padding: 0.875rem 1.25rem;
		}

		.pros-text {
			font-size: 0.6875rem;
		}
	}
</style>
