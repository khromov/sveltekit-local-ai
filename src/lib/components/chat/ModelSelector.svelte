<script lang="ts">
	import { AVAILABLE_MODELS, formatFileSize } from '$lib/wllama-config';
	import { inferenceParams } from '$lib/stores';

	interface Props {
		modelSelection: string;
		onLoadModel: () => void;
		isLoading?: boolean;
	}

	let {
		modelSelection = $bindable(),
		onLoadModel,
		isLoading = false
	}: Props = $props();
</script>

<div class="model-selector">
	<h2>On-device Local Chat</h2>
	<p class="subtitle">Select a model to start your private AI experience</p>

	<div class="select-wrapper">
		<label class="select-label">Choose Model</label>
		<select bind:value={modelSelection}>
			{#each AVAILABLE_MODELS as model}
				<option value={model.url}>
					{model.name} ({formatFileSize(model.size)})
				</option>
			{/each}
		</select>
	</div>

	<div class="inference-params">
		<h3>Inference Parameters</h3>
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
	</div>

	<button onclick={onLoadModel} class="load-button primary-button" disabled={isLoading}>
		{#if isLoading}
			Loading Model...
		{:else}
			Load Model
		{/if}
	</button>
	
	<p class="model-note">
		Model will be downloaded and run locally in your browser
	</p>
</div>

<style>
	.model-selector {
		width: 100%;
		max-width: 500px;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 2rem;
		background: #FFF;
		border: 3px solid #000;
		box-shadow: 6px 6px 0 #000;
		margin: 0 auto;
		border-radius: 12px;
		animation: fadeIn 0.4s ease-out;
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
		background: #FFF;
		padding: 0 6px;
		font-size: 0.8125rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: #666;
	}

	.model-selector select {
		width: 100%;
		padding: 0.875rem 1rem;
		border: 2px solid #000;
		border-radius: 6px;
		font-size: 0.9375rem;
		font-weight: 500;
		background: #FFF;
		box-shadow: 3px 3px 0 #000;
		appearance: none;
		background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
		background-repeat: no-repeat;
		background-position: right 0.875rem center;
		background-size: 1.25em;
		padding-right: 2.5rem;
		transition: all 0.2s;
		cursor: pointer;
		font-family: 'Space Grotesk', system-ui, sans-serif;
	}

	.model-selector select:hover {
		box-shadow: 4px 4px 0 #000;
	}

	.model-selector select:focus {
		outline: none;
		border-color: #FFD700;
	}

	.inference-params {
		background: #F8F8F8;
		padding: 1.25rem;
		border: 2px solid #000;
		border-radius: 8px;
	}

	.inference-params h3 {
		font-size: 1.125rem;
		margin: 0 0 1rem 0;
		color: #000;
		text-align: center;
		font-weight: 600;
	}

	.params-grid {
		display: grid;
		gap: 1rem;
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
		background: #FFF;
		transition: all 0.2s;
		font-family: 'Space Grotesk', system-ui, sans-serif;
	}

	.inference-params input:focus {
		outline: none;
		border-color: #FFD700;
	}

	.load-button {
		padding: 1rem 1.5rem;
		font-size: 1.125rem;
	}

	.load-button:disabled {
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.7; }
	}

	.model-note {
		font-size: 0.875rem;
		color: #666;
		text-align: center;
		margin: 0;
	}

	@media (max-width: 600px) {
		.model-selector {
			padding: 1.5rem;
			max-width: none;
		}

		.model-selector h2 {
			font-size: 1.5rem;
		}
	}
</style>
