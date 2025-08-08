<script lang="ts">
	import LoadingProgress from '../LoadingProgress.svelte';
	import ErrorDisplay from '../ErrorDisplay.svelte';
	import { isOPFSSupported } from '$lib/download-utils';

	interface Props {
		selectedModel: string;
		availableModels: Array<{ path: string; name: string }>;
		isLoading?: boolean;
		isReady?: boolean;
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
		error = false,
		downloadProgress = 0,
		previousDownloadProgress = 0,
		usingCachedModel = false,
		hasProgressTracking = true,
		onLoadModel,
		onChangeModel,
		onRetry
	}: Props = $props();

	let opfsSupported = $state(true);

	$effect(() => {
		opfsSupported = isOPFSSupported();
	});
</script>

<div class="model-selection">
	<h3>Select Model</h3>
	<div class="model-controls">
		<select bind:value={selectedModel} disabled={isLoading}>
			{#each availableModels as model (model.path)}
				<option value={model.path}>{model.name}</option>
			{/each}
		</select>

		{#if !isReady}
			<button onclick={onLoadModel} disabled={isLoading} class="load-model-btn primary-button">
				{isLoading ? 'Loading Model...' : 'Load Model'}
			</button>
		{:else}
			<div class="model-controls-loaded">
				<div class="model-ready">
					<span class="checkmark">✓</span>
					Model Ready
				</div>
				{#if selectedModel !== availableModels[0].path}
					<button onclick={onChangeModel} disabled={isLoading} class="change-model-btn">
						{isLoading ? 'Changing...' : 'Change Model'}
					</button>
				{/if}
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
			title={usingCachedModel 
				? 'Loading Cached Model' 
				: opfsSupported 
					? 'Downloading Model' 
					: 'Loading Model'}
			progress={downloadProgress}
			previousProgress={previousDownloadProgress}
			percentageText={hasProgressTracking ? `${downloadProgress}% Complete` : 'Loading...'}
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
		background-color: white;
		border-radius: 16px;
		padding: 1.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		margin-bottom: 1rem;
	}

	.model-selection h3 {
		margin-top: 0;
		margin-bottom: 1rem;
		font-size: 1.25rem;
		font-weight: 600;
		color: #333;
		text-align: center;
	}

	.model-controls {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
	}

	.model-controls select {
		padding: 0.75rem;
		border-radius: 12px;
		border: 1px solid #e1e1e1;
		font-size: 1rem;
		background-color: #f8f8f8;
		min-width: 250px;
		text-align: center;
	}

	.model-controls select:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.load-model-btn {
		min-width: 150px;
	}

	.model-ready {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: #28a745;
		font-weight: 500;
		font-size: 1rem;
	}

	.model-controls-loaded {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		align-items: center;
	}

	.change-model-btn {
		padding: 0.5rem 1rem;
		background-color: #f8f8f8;
		color: #333;
		border: 1px solid #e1e1e1;
		border-radius: 8px;
		cursor: pointer;
		font-size: 0.875rem;
		transition: all 0.2s ease;
	}

	.change-model-btn:hover {
		background-color: #e9ecef;
		border-color: #ced4da;
	}

	.change-model-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.checkmark {
		font-size: 1.25rem;
		font-weight: bold;
	}

	.primary-button {
		padding: 0.875rem 1.5rem;
		background-color: #0071e3;
		color: white;
		border: none;
		border-radius: 14px;
		cursor: pointer;
		font-size: 1.125rem;
		font-weight: 500;
		transition: all 0.2s;
		box-shadow: 0 2px 8px rgba(0, 113, 227, 0.3);
	}

	.primary-button:hover {
		background-color: #0062cc;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(0, 113, 227, 0.4);
	}

	.primary-button:active {
		transform: translateY(0);
		box-shadow: 0 1px 3px rgba(0, 113, 227, 0.3);
	}

	.primary-button:disabled {
		background-color: #b0b0b0;
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
	}

	@media (max-width: 600px) {
		.model-controls {
			align-items: stretch;
		}

		.model-controls select {
			min-width: auto;
		}
	}
</style>
