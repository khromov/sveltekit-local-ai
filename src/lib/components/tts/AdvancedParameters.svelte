<script lang="ts">
	import SettingsIcon from 'virtual:icons/lucide/settings';
	import ChevronDownIcon from 'virtual:icons/lucide/chevron-down';
	import WebGPUToggle from './WebGPUToggle.svelte';
	import SampleRateSelector from './SampleRateSelector.svelte';

	interface Props {
		selectedModel: 'kitten' | 'piper' | 'kokoro' | null;
		useWebGPU: boolean;
		onWebGPUToggle: (enabled: boolean) => void;
		onSampleRateChange: (sampleRate: number) => void;
	}

	let { selectedModel, useWebGPU, onWebGPUToggle, onSampleRateChange }: Props = $props();
	let showParams = $state(false);

	// Show advanced params if model supports WebGPU or other advanced features
	const hasAdvancedOptions = $derived(selectedModel === 'kitten' || selectedModel === 'kokoro');
</script>

{#if hasAdvancedOptions}
	<div class="advanced-section">
		<div class="advanced-params">
			<button class="params-toggle" onclick={() => (showParams = !showParams)}>
				<span class="toggle-emoji"><SettingsIcon /></span>
				<span>Advanced Parameters</span>
				<span class="toggle-icon" class:rotated={showParams}>
					<ChevronDownIcon />
				</span>
			</button>
			{#if showParams}
				<div class="params-grid">
					{#if selectedModel === 'kitten' || selectedModel === 'kokoro'}
						<div class="param-item">
							<WebGPUToggle modelValue={useWebGPU} onUpdate={onWebGPUToggle} />
						</div>
					{/if}

					{#if selectedModel === 'kitten'}
						<div class="param-item">
							<SampleRateSelector {onSampleRateChange} />
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.advanced-section {
		background: var(--color-background-main);
		border: var(--border-brutalist-thick);
		padding: 1.5rem;
		box-shadow: var(--shadow-brutalist-medium);
		margin-bottom: 1rem;
		transform: rotate(-0.1deg);
	}

	.advanced-params {
		background: linear-gradient(135deg, rgba(255, 217, 61, 0.1) 0%, rgba(152, 251, 152, 0.1) 100%);
		padding: 1.25rem;
		border: var(--border-brutalist-thick);
		border-radius: 8px;
		box-sizing: border-box;
		transform: rotate(0.2deg);
		box-shadow: var(--shadow-brutalist-small);
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
		color: var(--color-text-primary);
		cursor: pointer;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-family: var(--font-family-primary);
		transition: color 0.2s;
	}

	.toggle-emoji {
		font-size: 1.25rem;
		margin-right: 0.5rem;
		display: flex;
		align-items: center;
		color: var(--color-text-primary);
		animation: rotate 3s linear infinite;
	}

	.toggle-emoji :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
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
		color: var(--color-text-tertiary);
	}

	.toggle-icon {
		transition: transform 0.3s ease;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		color: var(--color-text-primary);
	}

	.toggle-icon :global(svg) {
		width: 20px;
		height: 20px;
	}

	.toggle-icon.rotated {
		transform: rotate(180deg);
	}

	.params-grid {
		display: flex;
		flex-direction: column;
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

	@media (max-width: 600px) {
		.advanced-section {
			padding: 1rem;
		}

		.advanced-params {
			padding: 1rem;
		}
	}
</style>
