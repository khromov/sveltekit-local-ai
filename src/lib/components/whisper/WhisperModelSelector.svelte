<script lang="ts">
	import LoadingProgress from '$lib/components/common/LoadingProgress.svelte';
	import ErrorDisplay from '$lib/components/common/ErrorDisplay.svelte';
	import { isOPFSSupported } from '$lib/download-utils';
	import { PUBLIC_DISABLE_OPFS } from '$env/static/public';
	import CheckIcon from 'virtual:icons/lucide/check';
	import ChevronDownIcon from 'virtual:icons/lucide/chevron-down';

	interface Props {
		selectedModel: string;
		availableModels: Array<{ path: string; name: string }>;
		isLoading?: boolean;
		isReady?: boolean;
		loadedModel?: string;
		error?: boolean;
		downloadProgress?: number;
		previousDownloadProgress?: number;
		usingCachedModel?: boolean;
		hasProgressTracking?: boolean;
		onLoadModel: () => void;
		onChangeModel: () => void;
		onRetry: () => void;
	}

	let {
		selectedModel = $bindable(),
		availableModels,
		isLoading = false,
		isReady = false,
		loadedModel = '',
		error = false,
		downloadProgress = 0,
		previousDownloadProgress = 0,
		usingCachedModel = false,
		hasProgressTracking = true,
		onLoadModel,
		onChangeModel,
		onRetry
	}: Props = $props();

	let opfsSupported = isOPFSSupported(PUBLIC_DISABLE_OPFS === 'true');

	const isCurrentModelReady = $derived.by(() => {
		if (!isReady || !loadedModel) return false;
		const selectedModelObj = availableModels.find((m) => m.path === selectedModel);
		return selectedModelObj?.name === loadedModel;
	});
</script>

<div class="model-selection">
	<h3>Select Model</h3>
	<div class="model-controls">
		<div class="select-container">
			<select bind:value={selectedModel} disabled={isLoading}>
				{#each availableModels as model (model.path)}
					<option value={model.path}>{model.name}</option>
				{/each}
			</select>
			<span class="select-arrow"><ChevronDownIcon /></span>
		</div>

		{#if !isReady}
			<button onclick={onLoadModel} disabled={isLoading} class="load-model-btn primary-button">
				{isLoading ? 'Loading Model...' : 'Load Model'}
			</button>
		{:else}
			<div class="model-controls-loaded">
				{#if isCurrentModelReady}
					<div class="model-ready">
						<span class="checkmark"><CheckIcon /></span>
						<span>Model Ready</span>
					</div>
				{/if}
				<button onclick={onChangeModel} disabled={isLoading} class="change-model-btn">
					{isLoading ? 'Changing...' : 'Change Model'}
				</button>
			</div>
		{/if}
	</div>

	{#if error}
		<ErrorDisplay
			message="Failed to load transcription model. Please try again."
			buttonText="Retry"
			{onRetry}
			isRetrying={isLoading}
		/>
	{:else if isLoading}
		<LoadingProgress
			topMargin={true}
			title={usingCachedModel
				? 'Loading Cached Model'
				: opfsSupported
					? 'Downloading Model'
					: 'Loading Model'}
			progress={downloadProgress}
			previousProgress={previousDownloadProgress}
			percentageText={/* @wc-include */ hasProgressTracking
				? `${downloadProgress}% Complete`
				: 'Loading...'}
			showPercentage={true}
			message={usingCachedModel
				? 'Loading model from local cache...'
				: opfsSupported
					? 'The transcription model is being downloaded to your browser.'
					: 'Loading model... Progress tracking not available in this browser.'}
		/>
	{/if}
</div>

<style>
	.model-selection {
		background: var(--color-background-main);
		border: var(--border-brutalist-thick);
		padding: 1.5rem;
		box-shadow: 5px 5px 0 var(--color-text-primary);
		margin-bottom: 1.5rem;
		border-radius: 12px;
	}

	.model-selection h3 {
		margin-top: 0;
		margin-bottom: 1rem;
		font-size: 1.25rem;
		color: var(--color-text-primary);
		text-align: center;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.model-controls {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
	}

	.select-container {
		position: relative;
		width: 100%;
		max-width: 400px;
	}

	.model-controls select {
		width: 100%;
		padding: 0.75rem;
		padding-right: 2.5rem;
		border: var(--border-brutalist-thin);
		border-radius: 6px;
		font-size: 0.9375rem;
		font-weight: 500;
		background: var(--color-background-main);
		text-align: center;
		box-shadow: var(--shadow-brutalist-small);
		font-family: var(--font-family-primary);
		cursor: pointer;
		transition: all 0.2s;
		appearance: none;
	}

	.select-arrow {
		position: absolute;
		right: 0.75rem;
		top: 50%;
		transform: translateY(-50%);
		pointer-events: none;
		display: flex;
		align-items: center;
		color: var(--color-text-primary);
	}

	.select-arrow :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}

	.model-controls select:hover:not(:disabled) {
		box-shadow: var(--shadow-brutalist-medium);
	}

	.model-controls select:focus {
		outline: none;
		border-color: #ffd700;
	}

	.model-controls select:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.load-model-btn {
		min-width: 180px;
	}

	.model-ready {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--color-text-primary);
		font-weight: 600;
		font-size: 1rem;
		background: var(--color-accent-light-green);
		padding: 0.5rem 1rem;
		border: var(--border-brutalist-thin);
		border-radius: 6px;
		text-transform: uppercase;
	}

	.checkmark {
		font-size: 1.25rem;
		color: var(--color-text-primary);
		display: flex;
		align-items: center;
	}

	.checkmark :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}

	.model-controls-loaded {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		align-items: center;
	}

	.change-model-btn {
		padding: 0.5rem 1rem;
		background: var(--color-background-tertiary);
		color: var(--color-text-primary);
		border: var(--border-brutalist-thin);
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 600;
		transition: all 0.2s;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-family: var(--font-family-primary);
	}

	.change-model-btn:hover {
		background: var(--color-background-pattern);
		box-shadow: var(--shadow-brutalist-small);
	}

	.change-model-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.primary-button {
		padding: 0.875rem 1.75rem;
		background: #ffd700;
		color: var(--color-text-primary);
		border: var(--border-brutalist-thick);
		border-radius: 8px;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 700;
		transition: all 0.2s;
		box-shadow: var(--shadow-brutalist-medium);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-family: var(--font-family-primary);
	}

	.primary-button:hover:not(:disabled) {
		transform: translate(-2px, -2px);
		box-shadow: var(--shadow-brutalist-large);
	}

	.primary-button:active:not(:disabled) {
		transform: translate(0);
		box-shadow: var(--shadow-brutalist-small);
	}

	.primary-button:disabled {
		background: var(--color-background-disabled);
		color: var(--color-text-disabled);
		cursor: not-allowed;
	}

	@media (max-width: 600px) {
		.model-controls {
			align-items: stretch;
		}

		.select-container {
			max-width: none;
		}
	}
</style>
