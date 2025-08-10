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
		Chat
	</h2>

	<div class="select-wrapper">
		<label class="select-label" for="model-select">
			<span class="label-icon">📦</span>
			Choose Model
		</label>
		<select id="model-select" bind:value={modelSelection}>
			{#each AVAILABLE_MODELS as model (model.url)}
				<option value={model.url}>
					{model.longName ?? model.name} ({formatFileSize(model.size)})
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
		width: calc(100% - 2rem);
		max-width: 500px;
		display: flex;
		flex-direction: column;
		gap: 2rem;
		padding: 2.5rem;
		background: rgba(255, 255, 255, 0.95);
		border: 1px solid rgba(82, 121, 82, 0.2);
		box-shadow: 0 16px 64px rgba(82, 121, 82, 0.15);
		margin: 0 auto;
		border-radius: 20px;
		animation: gentle-appear 0.8s ease-out;
		box-sizing: border-box;
		position: relative;
		backdrop-filter: blur(16px);
	}

	@keyframes gentle-appear {
		0% {
			opacity: 0;
			transform: translateY(20px) scale(0.95);
		}
		100% {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	.selector-decoration {
		position: absolute;
		top: -20px;
		left: -20px;
		width: 120px;
		height: 120px;
		background: radial-gradient(circle, rgba(82, 121, 82, 0.08) 0%, rgba(107, 142, 107, 0.04) 100%);
		border: 1px solid rgba(82, 121, 82, 0.1);
		border-radius: 50%;
		opacity: 0.6;
		z-index: -1;
		animation: gentle-pulse 8s ease-in-out infinite;
	}

	@keyframes gentle-pulse {
		0%,
		100% {
			transform: scale(1);
			opacity: 0.6;
		}
		50% {
			transform: scale(1.1);
			opacity: 0.3;
		}
	}

	.model-selector h2 {
		font-size: 1.75rem;
		font-weight: 600;
		margin: 0;
		color: #2e4a2e;
		text-align: center;
		text-transform: none;
		letter-spacing: 0.01em;
		font-family: 'Space Grotesk', sans-serif;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		background: linear-gradient(135deg, rgba(82, 121, 82, 0.1) 0%, rgba(107, 142, 107, 0.08) 100%);
		padding: 1rem 2rem;
		border: 1px solid rgba(82, 121, 82, 0.2);
		box-shadow: 0 8px 32px rgba(82, 121, 82, 0.1);
		width: fit-content;
		margin-left: auto;
		margin-right: auto;
		border-radius: 16px;
		backdrop-filter: blur(8px);
	}

	.title-icon {
		font-size: 1.5rem;
		animation: gentle-bob 3s ease-in-out infinite;
		filter: drop-shadow(0 2px 4px rgba(82, 121, 82, 0.3));
	}

	@keyframes gentle-bob {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-3px);
		}
	}

	.select-wrapper {
		margin-top: 0.5rem;
		position: relative;
	}

	.select-label {
		position: absolute;
		top: -12px;
		left: 16px;
		background: rgba(255, 255, 255, 0.95);
		padding: 0.25rem 0.75rem;
		font-size: 0.8rem;
		font-weight: 500;
		text-transform: none;
		letter-spacing: 0.01em;
		color: #527952;
		z-index: 1;
		border: 1px solid rgba(82, 121, 82, 0.2);
		border-radius: 8px;
		display: flex;
		align-items: center;
		gap: 0.375rem;
		backdrop-filter: blur(8px);
	}

	.label-icon {
		font-size: 0.875rem;
	}

	.model-selector select {
		width: 100%;
		padding: 1rem 3rem 1rem 1.25rem;
		border: 1px solid rgba(82, 121, 82, 0.3);
		border-radius: 12px;
		font-size: 0.9rem;
		font-weight: 500;
		background: rgba(255, 255, 255, 0.9);
		box-shadow: 0 4px 16px rgba(82, 121, 82, 0.1);
		appearance: none;
		background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23527952' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
		background-repeat: no-repeat;
		background-position: right 1rem center;
		background-size: 1.25em;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		cursor: pointer;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		box-sizing: border-box;
		color: #2e4a2e;
		backdrop-filter: blur(8px);
	}

	.model-selector select:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 32px rgba(82, 121, 82, 0.2);
		background: rgba(255, 255, 255, 1);
		border-color: rgba(82, 121, 82, 0.4);
	}

	.model-selector select:focus {
		outline: none;
		border-color: rgba(82, 121, 82, 0.6);
		background: rgba(255, 255, 255, 1);
		box-shadow: 0 0 0 3px rgba(82, 121, 82, 0.1);
	}

	.inference-params {
		background: rgba(82, 121, 82, 0.05);
		padding: 1.5rem;
		border: 1px solid rgba(82, 121, 82, 0.2);
		border-radius: 16px;
		box-sizing: border-box;
		box-shadow: 0 4px 16px rgba(82, 121, 82, 0.08);
		backdrop-filter: blur(8px);
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
		font-weight: 500;
		color: #527952;
		cursor: pointer;
		text-transform: none;
		letter-spacing: 0.01em;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.toggle-emoji {
		font-size: 1.125rem;
		margin-right: 0.75rem;
		animation: gentle-rotate 6s ease-in-out infinite;
		filter: drop-shadow(0 1px 3px rgba(82, 121, 82, 0.3));
	}

	@keyframes gentle-rotate {
		0%,
		100% {
			transform: rotate(0deg);
		}
		25% {
			transform: rotate(90deg);
		}
		50% {
			transform: rotate(180deg);
		}
		75% {
			transform: rotate(270deg);
		}
	}

	.params-toggle:hover .toggle-emoji {
		animation-duration: 2s;
	}

	.params-toggle:hover {
		color: #2e4a2e;
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
		padding: 0.75rem 1rem;
		border: 1px solid rgba(82, 121, 82, 0.3);
		border-radius: 8px;
		font-size: 0.9rem;
		font-weight: 500;
		background: rgba(255, 255, 255, 0.9);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		font-family: 'Space Grotesk', system-ui, sans-serif;
		box-sizing: border-box;
		width: 100%;
		box-shadow: 0 2px 8px rgba(82, 121, 82, 0.1);
		color: #2e4a2e;
		backdrop-filter: blur(4px);
	}

	.inference-params input:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 16px rgba(82, 121, 82, 0.15);
		border-color: rgba(82, 121, 82, 0.4);
		background: rgba(255, 255, 255, 1);
	}

	.inference-params input:focus {
		outline: none;
		border-color: rgba(82, 121, 82, 0.6);
		background: rgba(255, 255, 255, 1);
		box-shadow: 0 0 0 3px rgba(82, 121, 82, 0.1);
	}

	.load-button {
		padding: 1.25rem 2rem;
		font-size: 1.125rem;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		margin: 0 auto;
		background: linear-gradient(135deg, #527952 0%, #6b8e6b 100%);
		color: #ffffff;
		position: relative;
		overflow: hidden;
	}

	.load-button:hover:not(:disabled) {
		background: linear-gradient(135deg, #6b8e6b 0%, #7da47d 100%);
		transform: translateY(-3px);
		box-shadow: 0 12px 48px rgba(82, 121, 82, 0.3);
	}

	.load-button:disabled {
		animation: gentle-pulse-btn 2s ease-in-out infinite;
		background: linear-gradient(135deg, #a0a0a0 0%, #b0b0b0 100%);
		opacity: 0.7;
	}

	@keyframes gentle-pulse-btn {
		0%,
		100% {
			transform: scale(1);
			opacity: 0.7;
		}
		50% {
			transform: scale(1.02);
			opacity: 0.85;
		}
	}

	.button-icon,
	.loading-icon {
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
	}
</style>
