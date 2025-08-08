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
	<div class="selector-decoration"></div>
	<h2>
		<span class="title-icon">🚀</span>
		Local Chat
	</h2>

	<div class="select-wrapper">
		<label class="select-label" for="model-select">
			<span class="label-icon">📦</span>
			Choose Model
		</label>
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
			<span class="toggle-emoji">⚙️</span>
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
			<span class="loading-icon">⏳</span>
			Loading Model...
		{:else}
			<span class="button-icon">⚡</span>
			Load Model
		{/if}
	</button>
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
		border: 4px solid #000;
		box-shadow: 8px 8px 0 #000;
		margin: 0 auto;
		border-radius: 12px;
		animation: bounceIn 0.6s ease-out;
		box-sizing: border-box;
		position: relative;
		transform: rotate(0.5deg);
	}

	@keyframes bounceIn {
		0% {
			opacity: 0;
			transform: scale(0.9) rotate(-1deg);
		}
		50% {
			transform: scale(1.05) rotate(1deg);
		}
		100% {
			opacity: 1;
			transform: scale(1) rotate(0.5deg);
		}
	}

	.selector-decoration {
		position: absolute;
		top: -15px;
		left: -15px;
		width: 100px;
		height: 100px;
		background: linear-gradient(135deg, #ffd93d 0%, #98fb98 100%);
		border: 3px solid #000;
		border-radius: 30% 70% 70% 30% / 60% 40% 60% 40%;
		opacity: 0.3;
		z-index: -1;
		animation: spin 15s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.model-selector h2 {
		font-size: 2rem;
		font-weight: 700;
		margin: 0;
		color: #000;
		text-align: center;
		text-transform: uppercase;
		letter-spacing: 2px;
		font-family: 'Bebas Neue', sans-serif;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		background: linear-gradient(135deg, #ffd93d 0%, #98fb98 100%);
		padding: 0.75rem 1.5rem;
		border: 3px solid #000;
		box-shadow: 5px 5px 0 #000;
		transform: rotate(-1deg);
		width: fit-content;
		margin-left: auto;
		margin-right: auto;
	}

	.title-icon {
		font-size: 1.75rem;
		animation: bounce 2s ease-in-out infinite;
	}

	@keyframes bounce {
		0%, 100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-5px);
		}
	}

	.select-wrapper {
		margin-top: 1rem;	
		position: relative;
		transform: rotate(-0.5deg);
	}

	.select-label {
		position: absolute;
		top: -10px;
		left: 12px;
		background: #98fb98;
		padding: 0 8px;
		font-size: 0.8125rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: #000;
		z-index: 1;
		border: 2px solid #000;
		border-radius: 4px;
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.label-icon {
		font-size: 0.875rem;
	}

	.model-selector select {
		width: 100%;
		padding: 0.875rem 2.5rem 0.875rem 1rem;
		border: 3px solid #000;
		border-radius: 6px;
		font-size: 0.9375rem;
		font-weight: 600;
		background: #fff;
		box-shadow: 5px 5px 0 #000;
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
		transform: translate(-2px, -2px);
		box-shadow: 7px 7px 0 #000;
		background: #fffacd;
	}

	.model-selector select:focus {
		outline: none;
		border-color: #ffd700;
		background: #fffacd;
	}

	.inference-params {
		background: linear-gradient(135deg, rgba(255, 217, 61, 0.1) 0%, rgba(152, 251, 152, 0.1) 100%);
		padding: 1.25rem;
		border: 3px solid #000;
		border-radius: 8px;
		box-sizing: border-box;
		transform: rotate(0.5deg);
		box-shadow: 3px 3px 0 #000;
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
		font-weight: 700;
		color: #000;
		cursor: pointer;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		transition: color 0.2s;
	}

	.toggle-emoji {
		font-size: 1.25rem;
		margin-right: 0.5rem;
		animation: rotate 3s linear infinite;
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.params-toggle:hover .toggle-emoji {
		animation-duration: 1s;
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
		font-weight: 700;
		color: #000;
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
		font-weight: 600;
		background: #fff;
		transition: all 0.2s;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		box-sizing: border-box;
		width: 100%;
		box-shadow: 2px 2px 0 #000;
	}

	.inference-params input:hover {
		transform: translate(-1px, -1px);
		box-shadow: 3px 3px 0 #000;
	}

	.inference-params input:focus {
		outline: none;
		border-color: #ffd700;
		background: #fffacd;
	}

	.load-button {
		padding: 1rem 1.5rem;
		font-size: 1.125rem;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		margin: 0 auto;
		background: #98fb98;
		transform: rotate(-1deg);
	}

	.load-button:hover:not(:disabled) {
		background: #ffd93d;
		transform: translate(-3px, -3px) rotate(0deg);
		box-shadow: 8px 8px 0 #000;
	}

	.load-button:disabled {
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% {
			opacity: 1;
		}
		50% {
			opacity: 0.7;
		}
	}

	.button-icon, .loading-icon {
		font-size: 1.5rem;
	}

	.loading-icon {
		animation: spin 1s linear infinite;
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

		.selector-decoration {
			display: none;
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
