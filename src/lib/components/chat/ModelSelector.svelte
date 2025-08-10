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
		<svg viewBox="0 0 80 80" width="60" height="60">
			<!-- Natural tree growth pattern -->
			<path d="M40,70 Q35,50 40,30 Q45,50 40,70" stroke="#4a7c59" stroke-width="3" fill="none" />
			<circle cx="40" cy="30" r="12" fill="#5a8c69" opacity="0.6" />
			<circle cx="32" cy="27" r="8" fill="#3a6e4a" opacity="0.5" />
			<circle cx="48" cy="33" r="6" fill="#6b9d7a" opacity="0.4" />
			<path
				d="M35,70 Q30,75 25,73 M45,70 Q50,75 55,73"
				stroke="#8b5a3c"
				stroke-width="2"
				opacity="0.5"
			/>
		</svg>
	</div>
	<h2>
		<svg viewBox="0 0 20 20" width="24" height="24" class="title-icon">
			<circle cx="10" cy="8" r="6" fill="#3a6e4a" opacity="0.8" />
			<path d="M10,2 Q8,8 10,14" stroke="#2d5d3a" stroke-width="1.5" opacity="0.6" />
			<circle cx="6" cy="6" r="1.5" fill="#faf8f5" />
			<circle cx="10" cy="8" r="1.5" fill="#faf8f5" />
			<circle cx="14" cy="6" r="1.5" fill="#faf8f5" />
		</svg>
		Garden Chat
	</h2>

	<div class="select-wrapper">
		<label class="select-label" for="model-select">
			<svg viewBox="0 0 16 16" width="14" height="14" class="label-icon">
				<rect x="3" y="4" width="10" height="8" rx="2" fill="#4a7c59" opacity="0.7" />
				<path d="M8,4 Q6,2 4,4" stroke="#3a6e4a" stroke-width="1" opacity="0.5" />
				<circle cx="6" cy="7" r="1" fill="#faf8f5" />
				<circle cx="10" cy="7" r="1" fill="#faf8f5" />
			</svg>
			Choose Growth Model
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
			<svg viewBox="0 0 20 20" width="20" height="20" class="toggle-emoji">
				<circle cx="10" cy="10" r="3" fill="none" stroke="#4a7c59" stroke-width="2" />
				<path
					d="M10,1 L10,4 M10,16 L10,19 M19,10 L16,10 M4,10 L1,10 M17,3 L15,5 M5,15 L3,17 M17,17 L15,15 M5,5 L3,3"
					stroke="#3a6e4a"
					stroke-width="1.5"
					opacity="0.7"
				/>
			</svg>
			<span>Natural Parameters</span>
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
			<svg viewBox="0 0 20 20" width="20" height="20" class="loading-icon">
				<circle cx="10" cy="10" r="8" fill="none" stroke="#faf8f5" stroke-width="2" opacity="0.3" />
				<path
					d="M18,10 A8,8 0 0,1 10,18"
					stroke="#faf8f5"
					stroke-width="2"
					stroke-linecap="round"
				/>
			</svg>
			Growing Model...
		{:else}
			<svg viewBox="0 0 20 20" width="20" height="20" class="button-icon">
				<path d="M10,2 Q8,10 10,18" stroke="#faf8f5" stroke-width="2" />
				<circle cx="10" cy="6" r="3" fill="#faf8f5" opacity="0.8" />
				<circle cx="10" cy="14" r="2" fill="#faf8f5" opacity="0.6" />
			</svg>
			Plant Model
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
		background: rgba(250, 248, 245, 0.95);
		border: 1px solid rgba(74, 124, 89, 0.2);
		box-shadow:
			0 20px 40px rgba(45, 93, 58, 0.1),
			0 8px 16px rgba(45, 93, 58, 0.05),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
		margin: 0 auto;
		border-radius: 24px;
		animation: naturalFadeIn 0.8s ease-out;
		box-sizing: border-box;
		position: relative;
		backdrop-filter: blur(10px);
		overflow: hidden;
	}

	@keyframes naturalFadeIn {
		from {
			opacity: 0;
			transform: translateY(20px) scale(0.95);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	.selector-decoration {
		position: absolute;
		top: -20px;
		right: -20px;
		opacity: 0.6;
		z-index: -1;
		animation: gentleFloat 8s ease-in-out infinite;
	}

	@keyframes gentleFloat {
		0%,
		100% {
			transform: translateY(0) rotate(-5deg) scale(1);
			opacity: 0.6;
		}
		50% {
			transform: translateY(-8px) rotate(5deg) scale(1.05);
			opacity: 0.8;
		}
	}

	.model-selector h2 {
		font-size: 1.75rem;
		font-weight: 700;
		margin: 0;
		color: #3a6e4a;
		text-align: center;
		letter-spacing: 0.5px;
		font-family: 'Caveat', cursive;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		background: rgba(90, 140, 105, 0.1);
		padding: 0.75rem 2rem;
		border: 1px solid rgba(74, 124, 89, 0.3);
		box-shadow:
			0 8px 20px rgba(58, 110, 74, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.7);
		border-radius: 20px;
		width: fit-content;
		margin-left: auto;
		margin-right: auto;
		backdrop-filter: blur(5px);
	}

	.title-icon {
		animation: gentleRotate 6s ease-in-out infinite;
	}

	@keyframes gentleRotate {
		0%,
		100% {
			transform: rotate(0deg);
		}
		50% {
			transform: rotate(10deg);
		}
	}

	.select-wrapper {
		margin-top: 1rem;
		position: relative;
	}

	.select-label {
		position: absolute;
		top: -12px;
		left: 16px;
		background: rgba(139, 90, 60, 0.1);
		padding: 0.25rem 0.75rem;
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.3px;
		color: #4a7c59;
		z-index: 1;
		border: 1px solid rgba(74, 124, 89, 0.2);
		border-radius: 12px;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-family: 'Caveat', cursive;
		backdrop-filter: blur(3px);
		box-shadow:
			0 2px 6px rgba(58, 110, 74, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.6);
	}

	.label-icon {
		font-size: 0.875rem;
	}

	.model-selector select {
		width: 100%;
		padding: 1rem 2.5rem 1rem 1.25rem;
		border: 1px solid rgba(74, 124, 89, 0.2);
		border-radius: 16px;
		font-size: 0.95rem;
		font-weight: 500;
		background: rgba(250, 248, 245, 0.95);
		box-shadow:
			0 4px 12px rgba(58, 110, 74, 0.08),
			inset 0 1px 0 rgba(255, 255, 255, 0.6);
		appearance: none;
		background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234a7c59' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
		background-repeat: no-repeat;
		background-position: right 1rem center;
		background-size: 1.2em;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		cursor: pointer;
		font-family: 'Inter', system-ui, sans-serif;
		box-sizing: border-box;
		color: #2a2a2a;
		backdrop-filter: blur(5px);
	}

	.model-selector select:hover {
		transform: translateY(-1px);
		box-shadow:
			0 6px 16px rgba(58, 110, 74, 0.12),
			inset 0 2px 0 rgba(255, 255, 255, 0.8);
		border-color: rgba(90, 140, 105, 0.3);
	}

	.model-selector select:focus {
		outline: none;
		border-color: rgba(90, 140, 105, 0.4);
		box-shadow:
			0 8px 20px rgba(58, 110, 74, 0.15),
			inset 0 2px 0 rgba(255, 255, 255, 0.9);
	}

	.inference-params {
		background: linear-gradient(135deg, rgba(139, 90, 60, 0.05) 0%, rgba(107, 76, 58, 0.03) 100%);
		padding: 1.5rem;
		border: 1px solid rgba(74, 124, 89, 0.15);
		border-radius: 18px;
		box-sizing: border-box;
		backdrop-filter: blur(5px);
		box-shadow:
			0 4px 12px rgba(58, 110, 74, 0.06),
			inset 0 1px 0 rgba(255, 255, 255, 0.5);
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
		color: #4a7c59;
		cursor: pointer;
		letter-spacing: 0.3px;
		font-family: 'Caveat', cursive;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.toggle-emoji {
		margin-right: 0.5rem;
		animation: naturalRotate 8s ease-in-out infinite;
	}

	@keyframes naturalRotate {
		0%,
		100% {
			transform: rotate(0deg);
		}
		25% {
			transform: rotate(5deg);
		}
		75% {
			transform: rotate(-5deg);
		}
	}

	.params-toggle:hover .toggle-emoji {
		animation-duration: 2s;
	}

	.params-toggle:hover {
		color: #3a6e4a;
		transform: translateY(-1px);
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
			transform: translateY(-10px) scale(0.98);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	@keyframes naturalSpin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
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
		color: #4a7c59;
		letter-spacing: 0.2px;
		font-family: 'Inter', sans-serif;
	}

	.param-hint {
		font-size: 0.75rem;
		color: rgba(107, 76, 58, 0.7);
		font-weight: 400;
		letter-spacing: 0;
		font-style: italic;
	}

	.inference-params input {
		padding: 0.75rem 1rem;
		border: 1px solid rgba(74, 124, 89, 0.2);
		border-radius: 12px;
		font-size: 0.95rem;
		font-weight: 500;
		background: rgba(250, 248, 245, 0.9);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		font-family: 'Inter', system-ui, sans-serif;
		box-sizing: border-box;
		width: 100%;
		color: #2a2a2a;
		box-shadow:
			0 2px 6px rgba(58, 110, 74, 0.06),
			inset 0 1px 0 rgba(255, 255, 255, 0.5);
		backdrop-filter: blur(3px);
	}

	.inference-params input:hover {
		transform: translateY(-1px);
		box-shadow:
			0 4px 12px rgba(58, 110, 74, 0.1),
			inset 0 2px 0 rgba(255, 255, 255, 0.7);
		border-color: rgba(90, 140, 105, 0.3);
	}

	.inference-params input:focus {
		outline: none;
		border-color: rgba(90, 140, 105, 0.4);
		box-shadow:
			0 6px 16px rgba(58, 110, 74, 0.12),
			inset 0 2px 0 rgba(255, 255, 255, 0.8);
	}

	.load-button {
		padding: 1rem 2rem;
		font-size: 1.1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		margin: 0.5rem auto 0;
		font-family: 'Caveat', cursive;
		font-weight: 600;
		letter-spacing: 0.3px;
	}

	.load-button:disabled {
		animation: naturalPulse 2s ease-in-out infinite;
	}

	@keyframes naturalPulse {
		0%,
		100% {
			opacity: 1;
			transform: scale(1);
		}
		50% {
			opacity: 0.8;
			transform: scale(1.02);
		}
	}

	.button-icon,
	.loading-icon {
		font-size: 1.5rem;
	}

	.loading-icon {
		animation: naturalSpin 2s linear infinite;
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
	}
</style>
