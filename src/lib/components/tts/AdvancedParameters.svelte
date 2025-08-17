<script lang="ts">
	import AdvancedSection from '../common/AdvancedSection.svelte';
	import WebGPUToggle from './WebGPUToggle.svelte';
	import SampleRateSelector from './SampleRateSelector.svelte';

	interface Props {
		selectedModel: 'kitten' | 'piper' | 'kokoro' | null;
		useWebGPU: boolean;
		onWebGPUToggle: (enabled: boolean) => void;
		onSampleRateChange: (sampleRate: number) => void;
	}

	let { selectedModel, useWebGPU, onWebGPUToggle, onSampleRateChange }: Props = $props();

	// Show advanced params if model supports WebGPU or other advanced features
	const hasAdvancedOptions = $derived(selectedModel === 'kitten' || selectedModel === 'kokoro');
</script>

{#if hasAdvancedOptions}
	<div class="advanced-section">
		<AdvancedSection>
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
	</AdvancedSection>
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

	.param-item {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	@media (max-width: 600px) {
		.advanced-section {
			padding: 1rem;
		}
	}
</style>
