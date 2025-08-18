<script lang="ts">
	import { onMount } from 'svelte';
	import { detectWebGPU } from '$lib/utils';

	interface Props {
		modelValue: boolean;
		onUpdate: (value: boolean) => void;
	}

	let { modelValue = false, onUpdate }: Props = $props();

	let webGPUSupported = $state(false);

	onMount(async () => {
		webGPUSupported = await detectWebGPU();
	});

	function handleToggle(event: Event) {
		const target = event.target as HTMLInputElement;
		onUpdate(target.checked);
	}
</script>

<div class="webgpu-toggle">
	<input
		id="webgpu-toggle"
		type="checkbox"
		checked={modelValue}
		disabled={!webGPUSupported}
		onchange={handleToggle}
	/>
	<label for="webgpu-toggle" class:disabled={!webGPUSupported}>
		Try WebGPU (experimental)
		{#if !webGPUSupported}
			<span class="not-supported">(not supported)</span>
		{/if}
	</label>
</div>

<style>
	.webgpu-toggle {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem;
		background: var(--color-background-tertiary);
		border: var(--border-brutalist-thick);
		box-shadow: var(--shadow-brutalist-small);
	}

	input[type='checkbox'] {
		width: 20px;
		height: 20px;
		accent-color: var(--color-primary);
		cursor: pointer;
		border: var(--border-brutalist-thick);
	}

	input[type='checkbox']:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	label {
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--color-text-primary);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		cursor: pointer;
		user-select: none;
	}

	label.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.not-supported {
		font-size: 0.75rem;
		color: var(--color-text-tertiary);
		text-transform: none;
		letter-spacing: 0;
		font-weight: 500;
	}
</style>
