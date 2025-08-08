<script lang="ts">
	import { AVAILABLE_MODELS, formatFileSize } from '$lib/wllama-config';
	import { inferenceParams } from '$lib/stores';

	interface Props {
		modelSelection: string;
		onLoadModel: () => void;
		isLoading?: boolean;
	}

	let { modelSelection = $bindable(), onLoadModel, isLoading = false }: Props = $props();
</script>

<div class="model-selector">
	<h2>On-device, local chat in your web browser. Select a model to start.</h2>

	<select bind:value={modelSelection}>
		{#each AVAILABLE_MODELS as model}
			<option value={model.url}>
				{model.name} ({formatFileSize(model.size)})
			</option>
		{/each}
	</select>

	<div class="inference-params">
		<h3>Inference Parameters</h3>
		<label>
			<span>Threads <span class="param-hint">(-1 for auto)</span></span>
			<input type="number" bind:value={$inferenceParams.nThreads} min="-1" max="32" />
		</label>
		<label>
			<span>Context Size</span>
			<input type="number" bind:value={$inferenceParams.nContext} min="512" max="8192" />
		</label>
		<label>
			<span>Temperature</span>
			<input type="number" bind:value={$inferenceParams.temperature} min="0" max="2" step="0.1" />
		</label>
	</div>

	<button onclick={onLoadModel} class="primary-button" disabled={isLoading}>
		{isLoading ? 'Loading Model...' : 'Load Model'}
	</button>
	<p class="model-note">Model will be downloaded and run locally in your browser</p>
</div>

<style>
	.model-selector {
		width: 100%;
		max-width: 500px;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 2rem;
		border-radius: 20px;
		background-color: white;
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
		margin: 0 auto;
	}

	.model-selector h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin: 0;
		color: #111;
		text-align: center;
	}

	.model-selector select {
		padding: 0.875rem;
		border-radius: 12px;
		border: 1px solid #e1e1e1;
		font-size: 1.0625rem;
		background-color: #f8f8f8;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
		appearance: none;
		background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
		background-repeat: no-repeat;
		background-position: right 0.875rem center;
		background-size: 1em;
		padding-right: 2.5rem;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}

	.model-selector select:focus {
		border-color: #0071e3;
		outline: none;
		box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.2);
	}

	.model-note {
		font-size: 0.875rem;
		color: #777;
		text-align: center;
		margin-top: 0.5rem;
	}

	.param-hint {
		font-size: 0.875rem;
		color: #777;
		font-weight: normal;
	}

	.inference-params {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin: 0.5rem 0;
		background-color: #f7f7f9;
		padding: 1.5rem;
		border-radius: 16px;
		box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
	}

	.inference-params h3 {
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0 0 0.75rem 0;
		color: #333;
		text-align: center;
	}

	.inference-params label {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		font-size: 1.0625rem;
		color: #444;
	}

	.inference-params input {
		padding: 0.75rem;
		border-radius: 10px;
		border: 1px solid #e1e1e1;
		font-size: 1.0625rem;
		background-color: white;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}

	.inference-params input:focus {
		border-color: #0071e3;
		outline: none;
		box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.2);
	}

	.primary-button {
		padding: 0.875rem 1.5rem;
		background-color: #0071e3;
		color: white;
		border: none;
		border-radius: 14px;
		cursor: pointer;
		font-size: 1.125rem;
		font-weight: 500;
		transition: all 0.2s;
		box-shadow: 0 2px 8px rgba(0, 113, 227, 0.3);
	}

	.primary-button:hover {
		background-color: #0062cc;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(0, 113, 227, 0.4);
	}

	.primary-button:active {
		transform: translateY(0);
		box-shadow: 0 1px 3px rgba(0, 113, 227, 0.3);
	}

	.primary-button:disabled {
		background-color: #b0b0b0;
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
	}

	@media (max-width: 600px) {
		.model-selector select {
			min-width: auto;
		}

		.inference-params {
			align-items: stretch;
		}
	}
</style>
