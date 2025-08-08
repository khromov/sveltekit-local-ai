<script lang="ts">
	import { AVAILABLE_MODELS, formatFileSize } from '$lib/wllama-config';
	import { inferenceParams } from '$lib/stores';

	interface Props {
		modelSelection: string;
		onLoadModel: () => void;
		isLoading?: boolean;
	}

	let { modelSelection = $bindable(), onLoadModel, isLoading = false }: Props = $props();
	let showParams = $state(false);
</script>

<div class="model-selector">
	<h2>On-device Local Chat</h2>
	<p class="subtitle">Select a model to start your private AI experience</p>

	<div class="select-wrapper">
		<label class="select-label" for="model-select">Choose Model</label>
		<select id="model-select" bind:value={modelSelection}>
			{#each AVAILABLE_MODELS as model (model.url)}
				<option value={model.url}>
					{model.name} ({formatFileSize(model.size)})
				</option>
			{/each}
		</select>
	</div>

	<div class="inference-params">
		<button class="params-toggle" onclick={() => (showParams = !showParams)}>
			<span>Advanced Parameters</span>
			<svg
				class="toggle-icon"
				class:rotated={showParams}
				viewBox="0 0 24 24"
				width="20"
				height="20"
				stroke="currentColor"
				stroke-width="2"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<polyline points="6 9 12 15 18 9"></polyline>
			</svg>
		</button>
		{#if showParams}
			<div class="params-grid">
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
			</div>
		{/if}
	</div>

	<button onclick={onLoadModel} class="load-button primary-button" disabled={isLoading}>
		{#if isLoading}
			Loading Model...
		{:else}
			Load Model
		{/if}
	</button>

	<p class="model-note">Model will be downloaded and run locally in your browser</p>
</div>

<style>
	.model-selector {
		width: calc(100% - 4rem);
		max-width: 500px;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 2rem;
		background: #fff;
		border: 3px solid #000;
		box-shadow: 6px 6px 0 #000;
		margin: 0 auto;
		border-radius: 12px;
		animation: fadeIn 0.4s ease-out;
		box-sizing: border-box;
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

	.model-selector h2 {
		font-size: 2rem;
		font-weight: 700;
		margin: 0;
		color: #000;
		text-align: center;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.subtitle {
		text-align: center;
		font-size: 1rem;
		color: #666;
		margin: -0.5rem 0 0 0;
	}

	.select-wrapper {
		position: relative;
	}

	.select-label {
		position: absolute;
		top: -10px;
		left: 12px;
		background: #fff;
		padding: 0 6px;
		font-size: 0.8125rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: #666;
		z-index: 1;
	}

	.model-selector select {
		width: 100%;
		padding: 0.875rem 2.5rem 0.875rem 1rem;
		border: 2px solid #000;
		border-radius: 6px;
		font-size: 0.9375rem;
		font-weight: 500;
		background: #fff;
		box-shadow: 3px 3px 0 #000;
		appearance: none;
		background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
		background-repeat: no-repeat;
		background-position: right 0.875rem center;
		background-size: 1.25em;
		transition: all 0.2s;
		cursor: pointer;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		box-sizing: border-box;
	}

	.model-selector select:hover {
		box-shadow: 4px 4px 0 #000;
	}

	.model-selector select:focus {
		outline: none;
		border-color: #ffd700;
	}

	.inference-params {
		background: #f8f8f8;
		padding: 1.25rem;
		border: 2px solid #000;
		border-radius: 8px;
		box-sizing: border-box;
	}

	.params-toggle {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem 0;
		background: none;
		border: none;
		font-size: 1rem;
		font-weight: 600;
		color: #000;
		cursor: pointer;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		transition: color 0.2s;
	}

	.params-toggle:hover {
		color: #666;
	}

	.toggle-icon {
		transition: transform 0.3s ease;
		flex-shrink: 0;
	}

	.toggle-icon.rotated {
		transform: rotate(180deg);
	}

	.params-grid {
		display: grid;
		gap: 1rem;
		margin-top: 1rem;
		animation: slideDown 0.3s ease-out;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.param-item {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.param-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: #333;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.param-hint {
		font-size: 0.75rem;
		color: #666;
		font-weight: 400;
		text-transform: none;
		letter-spacing: 0;
	}

	.inference-params input {
		padding: 0.625rem 0.75rem;
		border: 2px solid #000;
		border-radius: 4px;
		font-size: 0.9375rem;
		font-weight: 500;
		background: #fff;
		transition: all 0.2s;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		box-sizing: border-box;
		width: 100%;
	}

	.inference-params input:focus {
		outline: none;
		border-color: #ffd700;
	}

	.load-button {
		padding: 1rem 1.5rem;
		font-size: 1.125rem;
	}

	.load-button:disabled {
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.7;
		}
	}

	.model-note {
		font-size: 0.875rem;
		color: #666;
		text-align: center;
		margin: 0;
	}

	@media (max-width: 600px) {
		.model-selector {
			width: calc(100% - 2rem);
			padding: 1.5rem 1rem;
			max-width: none;
			margin: 0 1rem;
		}

		.model-selector h2 {
			font-size: 1.5rem;
		}

		.model-selector select {
			font-size: 0.875rem;
			padding: 0.75rem 2.25rem 0.75rem 0.875rem;
		}

		.inference-params {
			padding: 1rem;
		}

		.param-label {
			font-size: 0.8125rem;
		}

		.inference-params input {
			padding: 0.5rem 0.625rem;
			font-size: 0.875rem;
		}

		.load-button {
			font-size: 1rem;
			padding: 0.875rem 1.25rem;
		}
	}

	@media (max-width: 400px) {
		.model-selector {
			width: calc(100% - 1rem);
			margin: 0 0.5rem;
			padding: 1.25rem 0.75rem;
		}

		.model-selector h2 {
			font-size: 1.25rem;
		}

		.subtitle {
			font-size: 0.875rem;
		}
	}
</style>
