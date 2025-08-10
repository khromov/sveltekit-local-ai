<script lang="ts">
	import LoadingProgress from '../LoadingProgress.svelte';
	import ErrorDisplay from '../ErrorDisplay.svelte';
	import { isOPFSSupported } from '$lib/download-utils';
	import CheckIcon from 'virtual:icons/lucide/check';

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

	let opfsSupported = isOPFSSupported();
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
					<span class="checkmark"><CheckIcon /></span>
					<span>Model Ready</span>
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
		background: #fff;
		border: 3px solid #000;
		padding: 1.5rem;
		box-shadow: 5px 5px 0 #000;
		margin-bottom: 1.5rem;
		border-radius: 12px;
	}

	.model-selection h3 {
		margin-top: 0;
		margin-bottom: 1rem;
		font-size: 1.25rem;
		color: #000;
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

	.model-controls select {
		width: 100%;
		max-width: 400px;
		padding: 0.75rem;
		border: 2px solid #000;
		border-radius: 6px;
		font-size: 0.9375rem;
		font-weight: 500;
		background: #fff;
		text-align: center;
		box-shadow: 3px 3px 0 #000;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		cursor: pointer;
		transition: all 0.2s;
		appearance: none;
		background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
		background-repeat: no-repeat;
		background-position: right 0.75rem center;
		background-size: 1.25em;
		padding-right: 2.5rem;
	}

	.model-controls select:hover:not(:disabled) {
		box-shadow: 4px 4px 0 #000;
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
		color: #000;
		font-weight: 600;
		font-size: 1rem;
		background: #b4e7ce;
		padding: 0.5rem 1rem;
		border: 2px solid #000;
		border-radius: 6px;
		text-transform: uppercase;
	}

	.checkmark {
		font-size: 1.25rem;
		color: #000;
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
		background: #f0f0f0;
		color: #000;
		border: 2px solid #000;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 600;
		transition: all 0.2s;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-family: 'Space Grotesk', system-ui, sans-serif;
	}

	.change-model-btn:hover {
		background: #e0e0e0;
		box-shadow: 2px 2px 0 #000;
	}

	.change-model-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.primary-button {
		padding: 0.875rem 1.75rem;
		background: #ffd700;
		color: #000;
		border: 3px solid #000;
		border-radius: 8px;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 700;
		transition: all 0.2s;
		box-shadow: 4px 4px 0 #000;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-family: 'Space Grotesk', system-ui, sans-serif;
	}

	.primary-button:hover:not(:disabled) {
		transform: translate(-2px, -2px);
		box-shadow: 6px 6px 0 #000;
	}

	.primary-button:active:not(:disabled) {
		transform: translate(0);
		box-shadow: 2px 2px 0 #000;
	}

	.primary-button:disabled {
		background: #e0e0e0;
		color: #999;
		cursor: not-allowed;
	}

	@media (max-width: 600px) {
		.model-controls {
			align-items: stretch;
		}

		.model-controls select {
			max-width: none;
		}
	}
</style>
