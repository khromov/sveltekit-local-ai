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
	<div class="selector-decoration"></div>
	<h2>
		<span class="title-main">ON-DEVICE</span>
		<span class="title-sub">LOCAL CHAT</span>
	</h2>
	<p class="subtitle">Select a model to start your private AI experience</p>

	<div class="select-wrapper">
		<label class="select-label">CHOOSE MODEL</label>
		<select bind:value={modelSelection}>
			{#each AVAILABLE_MODELS as model}
				<option value={model.url}>
					{model.name} ({formatFileSize(model.size)})
				</option>
			{/each}
		</select>
	</div>

	<div class="inference-params">
		<h3>⚙️ INFERENCE PARAMETERS</h3>
		<div class="params-grid">
			<label class="param-item">
				<span class="param-label">THREADS <span class="param-hint">(-1 auto)</span></span>
				<input type="number" bind:value={$inferenceParams.nThreads} min="-1" max="32" />
			</label>
			<label class="param-item">
				<span class="param-label">CONTEXT SIZE</span>
				<input type="number" bind:value={$inferenceParams.nContext} min="512" max="8192" />
			</label>
			<label class="param-item">
				<span class="param-label">TEMPERATURE</span>
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

	<button onclick={onLoadModel} class="load-button" disabled={isLoading}>
		{#if isLoading}
			<span class="loading-spinner">◐</span>
			LOADING MODEL...
		{:else}
			<span class="button-icon">🚀</span>
			LOAD MODEL
		{/if}
	</button>
	
	<p class="model-note">
		<span class="note-icon">💾</span>
		Model will be downloaded and run locally in your browser
	</p>
</div>

<style>
	.model-selector {
		width: 100%;
		max-width: 600px;
		display: flex;
		flex-direction: column;
		gap: 1.75rem;
		padding: 2.5rem;
		background: #FFF;
		border: 4px solid #000;
		box-shadow: 10px 10px 0 #000;
		margin: 0 auto;
		position: relative;
		transform: rotate(-1deg);
		animation: selectorPop 0.5s ease-out;
	}

	@keyframes selectorPop {
		from {
			transform: scale(0.9) rotate(-3deg);
			opacity: 0;
		}
		to {
			transform: scale(1) rotate(-1deg);
			opacity: 1;
		}
	}

	.selector-decoration {
		position: absolute;
		top: -15px;
		left: -15px;
		right: -15px;
		bottom: -15px;
		background: linear-gradient(135deg, #FFD93D 0%, #FF69B4 50%, #98FB98 100%);
		z-index: -1;
		border-radius: 30% 70% 70% 30% / 60% 40% 60% 40%;
		opacity: 0.3;
		transform: rotate(2deg);
	}

	.model-selector h2 {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 0;
		line-height: 0.9;
	}

	.title-main {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 3rem;
		color: #000;
		background: #FFD93D;
		padding: 0.25rem 1.5rem;
		border: 3px solid #000;
		box-shadow: 4px 4px 0 #000;
		letter-spacing: 3px;
		transform: rotate(-2deg);
		display: inline-block;
	}

	.title-sub {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 2.5rem;
		color: #FFD93D;
		background: #000;
		padding: 0.25rem 1.5rem;
		margin-top: -3px;
		border: 3px solid #000;
		box-shadow: 4px 4px 0 #FF69B4;
		letter-spacing: 2px;
		transform: rotate(1deg);
		display: inline-block;
	}

	.subtitle {
		text-align: center;
		font-size: 1.125rem;
		font-weight: 600;
		color: #000;
		margin: 0;
	}

	.select-wrapper {
		position: relative;
	}

	.select-label {
		position: absolute;
		top: -12px;
		left: 15px;
		background: #98FB98;
		padding: 2px 10px;
		font-size: 0.875rem;
		font-weight: 700;
		letter-spacing: 1px;
		border: 2px solid #000;
		z-index: 1;
	}

	.model-selector select {
		width: 100%;
		padding: 1rem;
		border: 3px solid #000;
		font-size: 1.0625rem;
		font-weight: 600;
		background: #FFF;
		box-shadow: 5px 5px 0 #000;
		appearance: none;
		background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
		background-repeat: no-repeat;
		background-position: right 1rem center;
		background-size: 1.5em;
		padding-right: 3rem;
		transition: all 0.15s;
		cursor: pointer;
		font-family: 'Space Grotesk', monospace;
	}

	.model-selector select:hover {
		transform: translate(-2px, -2px);
		box-shadow: 7px 7px 0 #000;
	}

	.model-selector select:focus {
		outline: none;
		background-color: #FFFACD;
	}

	.inference-params {
		background: linear-gradient(135deg, rgba(255, 217, 61, 0.1) 0%, rgba(255, 105, 180, 0.1) 100%);
		padding: 1.75rem;
		border: 3px solid #000;
		box-shadow: 5px 5px 0 #000;
		position: relative;
		transform: rotate(0.5deg);
	}

	.inference-params h3 {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 1.75rem;
		margin: 0 0 1.25rem 0;
		color: #000;
		text-align: center;
		letter-spacing: 2px;
	}

	.params-grid {
		display: grid;
		gap: 1.25rem;
	}

	.param-item {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		position: relative;
	}

	.param-label {
		font-size: 0.875rem;
		font-weight: 700;
		color: #000;
		text-transform: uppercase;
		letter-spacing: 1px;
		background: #FFD93D;
		padding: 4px 8px;
		border: 2px solid #000;
		width: fit-content;
		box-shadow: 3px 3px 0 #000;
	}

	.param-hint {
		font-size: 0.75rem;
		color: #000;
		font-weight: 500;
		text-transform: none;
		letter-spacing: 0;
	}

	.inference-params input {
		padding: 0.875rem;
		border: 3px solid #000;
		font-size: 1.0625rem;
		font-weight: 600;
		background: #FFF;
		box-shadow: 4px 4px 0 #000;
		transition: all 0.15s;
		font-family: 'Space Grotesk', monospace;
	}

	.inference-params input:hover {
		transform: translate(-2px, -2px);
		box-shadow: 6px 6px 0 #000;
	}

	.inference-params input:focus {
		outline: none;
		background: #FFFACD;
	}

	.load-button {
		padding: 1.25rem 2rem;
		background: #98FB98;
		color: #000;
		border: 4px solid #000;
		cursor: pointer;
		font-size: 1.5rem;
		font-weight: 700;
		transition: all 0.15s;
		box-shadow: 8px 8px 0 #000;
		text-transform: uppercase;
		letter-spacing: 2px;
		font-family: 'Space Grotesk', monospace;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		position: relative;
		overflow: hidden;
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
		transform: translate(-4px, -4px);
		box-shadow: 12px 12px 0 #000;
		background: #FFD93D;
	}

	.load-button:active:not(:disabled) {
		transform: translate(0);
		box-shadow: 4px 4px 0 #000;
	}

	.load-button:disabled {
		background: #E0E0E0;
		cursor: not-allowed;
		animation: loading-pulse 1.5s ease-in-out infinite;
	}

	@keyframes loading-pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.7; }
	}

	.button-icon {
		font-size: 1.75rem;
	}

	.loading-spinner {
		font-size: 1.75rem;
		animation: spin 1s linear infinite;
		display: inline-block;
	}

	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}

	.model-note {
		font-size: 1rem;
		font-weight: 600;
		color: #000;
		text-align: center;
		margin: 0;
		padding: 0.75rem;
		background: #FF69B4;
		border: 3px solid #000;
		box-shadow: 4px 4px 0 #000;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		transform: rotate(-0.5deg);
	}

	.note-icon {
		font-size: 1.25rem;
	}

	@media (max-width: 600px) {
		.model-selector {
			padding: 1.75rem;
		}

		.title-main {
			font-size: 2.25rem;
		}

		.title-sub {
			font-size: 1.875rem;
		}

		.load-button {
			font-size: 1.25rem;
			padding: 1rem 1.5rem;
		}
	}
</style>
