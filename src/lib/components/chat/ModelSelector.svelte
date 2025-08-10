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
	<div class="selector-decoration">
		<svg viewBox="0 0 80 80" width="80" height="80">
			<circle
				cx="40"
				cy="40"
				r="25"
				fill="none"
				stroke="var(--sage)"
				stroke-width="2"
				opacity="0.3"
			/>
			<circle cx="30" cy="30" r="3" fill="var(--clay)" opacity="0.5" />
			<circle cx="50" cy="30" r="3" fill="var(--clay)" opacity="0.5" />
			<circle cx="40" cy="50" r="2" fill="var(--earth-dark)" opacity="0.6" />
		</svg>
	</div>
	<h2>
		<svg viewBox="0 0 20 20" width="20" height="20" class="title-icon">
			<circle cx="10" cy="10" r="6" fill="var(--mocha-mousse)" opacity="0.7" />
			<circle cx="10" cy="10" r="3" fill="var(--cream)" opacity="0.9" />
		</svg>
		Conversational AI
	</h2>

	<div class="select-wrapper">
		<label class="select-label" for="model-select">
			<svg viewBox="0 0 16 16" width="14" height="14" class="label-icon">
				<rect
					x="2"
					y="3"
					width="12"
					height="10"
					rx="2"
					fill="none"
					stroke="var(--earth-dark)"
					stroke-width="1.5"
				/>
				<rect x="4" y="6" width="8" height="1" fill="var(--earth-dark)" opacity="0.6" />
				<rect x="4" y="8" width="6" height="1" fill="var(--earth-dark)" opacity="0.6" />
				<rect x="4" y="10" width="4" height="1" fill="var(--earth-dark)" opacity="0.6" />
			</svg>
			Select Model
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
			<svg viewBox="0 0 16 16" width="16" height="16" class="toggle-emoji">
				<circle cx="4" cy="8" r="2" fill="var(--earth-dark)" opacity="0.6" />
				<circle cx="8" cy="8" r="2" fill="var(--earth-dark)" opacity="0.6" />
				<circle cx="12" cy="8" r="2" fill="var(--earth-dark)" opacity="0.6" />
			</svg>
			<span>Advanced Settings</span>
			<svg
				class="toggle-icon"
				class:rotated={showParams}
				viewBox="0 0 20 20"
				width="16"
				height="16"
				stroke="currentColor"
				stroke-width="2"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<polyline points="6 9 10 13 14 9"></polyline>
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
			<svg viewBox="0 0 20 20" width="18" height="18" class="loading-icon">
				<circle
					cx="10"
					cy="10"
					r="6"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					opacity="0.3"
				/>
				<path d="M10 4 A 6 6 0 0 1 16 10" stroke="currentColor" stroke-width="2" fill="none">
					<animateTransform
						attributeName="transform"
						type="rotate"
						values="0 10 10;360 10 10"
						dur="1s"
						repeatCount="indefinite"
					/>
				</path>
			</svg>
			Loading Model...
		{:else}
			<svg viewBox="0 0 20 20" width="18" height="18" class="button-icon">
				<path
					d="M4,10 L16,10 M12,6 L16,10 L12,14"
					stroke="currentColor"
					stroke-width="2"
					fill="none"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
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
		padding: 2.5rem;
		background: rgba(245, 241, 235, 0.9);
		backdrop-filter: blur(15px);
		border: 1px solid var(--earth-medium);
		box-shadow:
			0 8px 32px rgba(139, 111, 71, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
		margin: 0 auto;
		border-radius: 1.5rem;
		animation: fadeInUp 0.8s ease-out;
		box-sizing: border-box;
		position: relative;
	}

	@keyframes fadeInUp {
		0% {
			opacity: 0;
			transform: translateY(30px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.selector-decoration {
		position: absolute;
		top: -20px;
		left: -20px;
		opacity: 0.6;
		z-index: 0;
		animation: gentleRotate 20s linear infinite;
	}

	@keyframes gentleRotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.model-selector h2 {
		font-size: 1.75rem;
		font-weight: 600;
		margin: 0;
		color: var(--text-primary);
		text-align: center;
		letter-spacing: 0.02em;
		font-family: 'Bebas Neue', sans-serif;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		position: relative;
		z-index: 1;
	}

	.title-icon {
		filter: drop-shadow(0 2px 4px rgba(139, 111, 71, 0.2));
	}

	.select-wrapper {
		margin-top: 0.5rem;
		position: relative;
	}

	.select-label {
		position: absolute;
		top: -12px;
		left: 16px;
		background: rgba(245, 241, 235, 0.95);
		padding: 4px 8px;
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.03em;
		color: var(--text-secondary);
		z-index: 1;
		border: 1px solid var(--earth-medium);
		border-radius: 0.75rem;
		display: flex;
		align-items: center;
		gap: 0.375rem;
		backdrop-filter: blur(5px);
	}

	.label-icon {
		opacity: 0.7;
	}

	.model-selector select {
		width: 100%;
		padding: 1rem 3rem 1rem 1.25rem;
		border: 1px solid var(--earth-medium);
		border-radius: 1rem;
		font-size: 0.95rem;
		font-weight: 500;
		background: rgba(245, 241, 235, 0.8);
		backdrop-filter: blur(10px);
		box-shadow:
			0 4px 15px rgba(139, 111, 71, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
		appearance: none;
		background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%238b6f47' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 8 10 12 14 8'%3e%3c/polyline%3e%3c/svg%3e");
		background-repeat: no-repeat;
		background-position: right 1rem center;
		background-size: 1.25em;
		transition: all 0.3s ease;
		cursor: pointer;
		font-family: 'Space Grotesk', 'Georgia', serif;
		box-sizing: border-box;
		color: var(--text-primary);
	}

	.model-selector select:hover {
		transform: translateY(-1px);
		box-shadow:
			0 6px 20px rgba(139, 111, 71, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
		background: rgba(245, 241, 235, 0.95);
	}

	.model-selector select:focus {
		outline: none;
		border-color: var(--mocha-mousse);
		box-shadow:
			0 6px 20px rgba(139, 111, 71, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.9),
			0 0 0 3px rgba(167, 132, 106, 0.1);
	}

	.inference-params {
		background: linear-gradient(135deg, rgba(156, 175, 136, 0.1) 0%, rgba(193, 154, 107, 0.1) 100%);
		padding: 1.5rem;
		border: 1px solid var(--earth-medium);
		border-radius: 1rem;
		box-sizing: border-box;
		box-shadow:
			inset 0 2px 8px rgba(139, 111, 71, 0.05),
			0 2px 8px rgba(139, 111, 71, 0.05);
		backdrop-filter: blur(5px);
	}

	.params-toggle {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem 0;
		background: none;
		border: none;
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--text-primary);
		cursor: pointer;
		letter-spacing: 0.02em;
		font-family: 'Space Grotesk', 'Georgia', serif;
		transition: color 0.3s ease;
	}

	.toggle-emoji {
		margin-right: 0.75rem;
		opacity: 0.7;
	}

	.params-toggle:hover {
		color: var(--mocha-mousse);
	}

	.toggle-icon {
		transition: transform 0.3s ease;
		flex-shrink: 0;
		opacity: 0.7;
	}

	.toggle-icon.rotated {
		transform: rotate(180deg);
	}

	.params-grid {
		display: grid;
		gap: 1.25rem;
		margin-top: 1.25rem;
		animation: slideDown 0.4s ease-out;
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
		gap: 0.5rem;
	}

	.param-label {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--text-primary);
		letter-spacing: 0.02em;
	}

	.param-hint {
		font-size: 0.75rem;
		color: var(--text-light);
		font-weight: 400;
		font-style: italic;
	}

	.inference-params input {
		padding: 0.75rem 1rem;
		border: 1px solid var(--earth-medium);
		border-radius: 0.75rem;
		font-size: 0.95rem;
		font-weight: 500;
		background: rgba(245, 241, 235, 0.8);
		backdrop-filter: blur(5px);
		transition: all 0.3s ease;
		font-family: 'Space Grotesk', 'Georgia', serif;
		box-sizing: border-box;
		width: 100%;
		box-shadow:
			inset 0 2px 4px rgba(139, 111, 71, 0.05),
			0 1px 3px rgba(139, 111, 71, 0.1);
		color: var(--text-primary);
	}

	.inference-params input:hover {
		transform: translateY(-1px);
		box-shadow:
			inset 0 2px 4px rgba(139, 111, 71, 0.05),
			0 2px 8px rgba(139, 111, 71, 0.15);
		background: rgba(245, 241, 235, 0.95);
	}

	.inference-params input:focus {
		outline: none;
		border-color: var(--mocha-mousse);
		box-shadow:
			inset 0 2px 4px rgba(139, 111, 71, 0.05),
			0 2px 8px rgba(139, 111, 71, 0.2),
			0 0 0 3px rgba(167, 132, 106, 0.1);
	}

	.load-button {
		padding: 1.25rem 2rem;
		font-size: 1.1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		margin: 0.5rem auto 0;
		min-width: 200px;
	}

	.load-button:disabled {
		animation: gentlePulse 2s ease-in-out infinite;
	}

	@keyframes gentlePulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.8;
		}
	}

	.button-icon,
	.loading-icon {
		filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
	}

	@media (max-width: 600px) {
		.model-selector {
			width: calc(100% - 2rem);
			padding: 1.75rem 1.5rem;
			max-width: none;
			margin: 0 1rem;
		}

		.model-selector h2 {
			font-size: 1.5rem;
		}

		.model-selector select {
			font-size: 0.9rem;
			padding: 0.875rem 2.5rem 0.875rem 1rem;
		}

		.inference-params {
			padding: 1.25rem;
		}

		.param-label {
			font-size: 0.8rem;
		}

		.inference-params input {
			padding: 0.625rem 0.875rem;
			font-size: 0.9rem;
		}

		.load-button {
			font-size: 1rem;
			padding: 1rem 1.75rem;
			min-width: 180px;
		}

		.selector-decoration {
			display: none;
		}
	}

	@media (max-width: 400px) {
		.model-selector {
			width: calc(100% - 1rem);
			margin: 0 0.5rem;
			padding: 1.5rem 1rem;
		}

		.model-selector h2 {
			font-size: 1.25rem;
		}
	}
</style>
