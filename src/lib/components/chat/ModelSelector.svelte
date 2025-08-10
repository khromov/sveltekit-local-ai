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
	<!-- Nature decoration -->
	<svg class="selector-decoration" width="80" height="80" viewBox="0 0 80 80">
		<g opacity="0.15">
			<circle
				cx="40"
				cy="40"
				r="35"
				fill="none"
				stroke="currentColor"
				stroke-width="1"
				stroke-dasharray="2 4"
			/>
			<path
				d="M40,10 Q30,25 30,40 Q30,55 40,70 Q50,55 50,40 Q50,25 40,10"
				fill="currentColor"
				opacity="0.3"
			/>
			<circle cx="20" cy="20" r="3" fill="currentColor" />
			<circle cx="60" cy="20" r="3" fill="currentColor" />
			<circle cx="20" cy="60" r="3" fill="currentColor" />
			<circle cx="60" cy="60" r="3" fill="currentColor" />
		</g>
	</svg>

	<h2>
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			style="display: inline-block; vertical-align: middle; margin-right: 8px;"
		>
			<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" />
			<path d="M12 6V12L16 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
		</svg>
		Select AI Model
	</h2>

	<div class="select-wrapper">
		<label class="select-label" for="model-select"> Choose your language model </label>
		<select id="model-select" bind:value={modelSelection}>
			{#each AVAILABLE_MODELS as model (model.url)}
				<option value={model.url}>
					{model.longName ?? model.name} ({formatFileSize(model.size)})
				</option>
			{/each}
		</select>
		<svg class="select-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
			<path
				d="M5 7L10 12L15 7"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	</div>

	<div class="inference-params">
		<button class="params-toggle" onclick={() => (showParams = !showParams)}>
			<svg
				class="toggle-icon"
				class:rotated={showParams}
				width="16"
				height="16"
				viewBox="0 0 16 16"
				fill="none"
			>
				<path
					d="M4 6L8 10L12 6"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			<span>Advanced Parameters</span>
		</button>

		{#if showParams}
			<div class="params-grid">
				<label class="param-item">
					<span class="param-label">
						Threads
						<span class="param-hint">(-1 for auto)</span>
					</span>
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
			<svg class="loading-spinner" width="20" height="20" viewBox="0 0 20 20" fill="none">
				<circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" opacity="0.3" />
				<path
					d="M10 2C14.4 2 18 5.6 18 10"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
				/>
			</svg>
			Loading Model...
		{:else}
			<svg
				width="20"
				height="20"
				viewBox="0 0 20 20"
				fill="none"
				style="display: inline-block; vertical-align: middle; margin-right: 8px;"
			>
				<path
					d="M10 2L12 8L18 8L13 12L15 18L10 14L5 18L7 12L2 8L8 8L10 2Z"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linejoin="round"
					fill="currentColor"
					fill-opacity="0.3"
				/>
			</svg>
			Load Model
		{/if}
	</button>
</div>

<style>
	.model-selector {
		width: 100%;
		max-width: 500px;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 2.5rem;
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.95) 0%,
			rgba(250, 248, 243, 0.98) 100%
		);
		border: 1px solid rgba(139, 111, 71, 0.2);
		box-shadow:
			0 8px 32px rgba(46, 90, 61, 0.1),
			0 2px 8px rgba(139, 111, 71, 0.08);
		margin: 0 auto;
		border-radius: 20px;
		animation: fadeIn 0.6s ease-out;
		box-sizing: border-box;
		position: relative;
		backdrop-filter: blur(10px);
		overflow: hidden;
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

	.selector-decoration {
		position: absolute;
		top: -10px;
		right: -10px;
		color: var(--forest-primary);
		animation: gentle-rotate 20s linear infinite;
		pointer-events: none;
	}

	@keyframes gentle-rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.model-selector h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin: 0;
		color: var(--forest-primary);
		text-align: center;
		letter-spacing: -0.01em;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.select-wrapper {
		position: relative;
	}

	.select-label {
		display: block;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-secondary);
		margin-bottom: 0.5rem;
		letter-spacing: 0.02em;
	}

	.model-selector select {
		width: 100%;
		padding: 0.875rem 2.5rem 0.875rem 1rem;
		border: 1px solid rgba(139, 111, 71, 0.2);
		border-radius: 12px;
		font-size: 0.9375rem;
		font-weight: 500;
		background: rgba(255, 255, 255, 0.8);
		appearance: none;
		transition: all 0.3s ease;
		cursor: pointer;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		box-sizing: border-box;
		color: var(--text-primary);
		box-shadow:
			0 2px 8px rgba(46, 90, 61, 0.05),
			inset 0 1px 0 rgba(255, 255, 255, 0.5);
	}

	.select-arrow {
		position: absolute;
		right: 1rem;
		bottom: 1rem;
		pointer-events: none;
		color: var(--forest-primary);
		opacity: 0.6;
	}

	.model-selector select:hover {
		border-color: rgba(46, 90, 61, 0.3);
		background: rgba(255, 255, 255, 0.95);
	}

	.model-selector select:focus {
		outline: none;
		border-color: var(--forest-primary);
		box-shadow:
			0 4px 16px rgba(46, 90, 61, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.5);
		background: white;
	}

	.inference-params {
		background: linear-gradient(
			135deg,
			rgba(136, 179, 120, 0.05) 0%,
			rgba(168, 185, 159, 0.08) 100%
		);
		padding: 1rem;
		border: 1px solid rgba(139, 111, 71, 0.1);
		border-radius: 12px;
		box-sizing: border-box;
	}

	.params-toggle {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0;
		background: none;
		border: none;
		font-size: 0.9375rem;
		font-weight: 500;
		color: var(--forest-primary);
		cursor: pointer;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		transition: color 0.3s ease;
		letter-spacing: 0.02em;
	}

	.params-toggle:hover {
		color: var(--forest-light);
	}

	.toggle-icon {
		transition: transform 0.3s ease;
		color: currentColor;
	}

	.toggle-icon.rotated {
		transform: rotate(180deg);
	}

	.params-grid {
		display: grid;
		gap: 1rem;
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid rgba(139, 111, 71, 0.1);
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
		font-weight: 500;
		color: var(--text-secondary);
		letter-spacing: 0.02em;
	}

	.param-hint {
		font-size: 0.75rem;
		color: var(--text-muted);
		font-weight: 400;
	}

	.inference-params input {
		padding: 0.625rem 0.875rem;
		border: 1px solid rgba(139, 111, 71, 0.2);
		border-radius: 8px;
		font-size: 0.9375rem;
		font-weight: 500;
		background: rgba(255, 255, 255, 0.8);
		transition: all 0.3s ease;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		box-sizing: border-box;
		width: 100%;
		color: var(--text-primary);
	}

	.inference-params input:hover {
		border-color: rgba(46, 90, 61, 0.3);
		background: rgba(255, 255, 255, 0.95);
	}

	.inference-params input:focus {
		outline: none;
		border-color: var(--forest-primary);
		background: white;
		box-shadow: 0 2px 8px rgba(46, 90, 61, 0.1);
	}

	.load-button {
		padding: 1rem 1.5rem;
		font-size: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		margin: 0 auto;
	}

	.loading-spinner {
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

	@media (max-width: 600px) {
		.model-selector {
			padding: 1.75rem 1.25rem;
			max-width: none;
		}

		.model-selector h2 {
			font-size: 1.25rem;
		}

		.model-selector select {
			font-size: 0.875rem;
			padding: 0.75rem 2.25rem 0.75rem 0.875rem;
		}

		.inference-params {
			padding: 0.875rem;
		}

		.param-label {
			font-size: 0.8125rem;
		}

		.inference-params input {
			padding: 0.5rem 0.625rem;
			font-size: 0.875rem;
		}

		.load-button {
			font-size: 0.9375rem;
			padding: 0.875rem 1.25rem;
		}

		.selector-decoration {
			width: 60px;
			height: 60px;
		}
	}
</style>
