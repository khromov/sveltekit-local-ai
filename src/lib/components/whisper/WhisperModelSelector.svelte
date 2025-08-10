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
					<span class="checkmark">✓</span>
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
		background: rgba(255, 255, 255, 0.95);
		border: 1px solid rgba(82, 121, 82, 0.2);
		padding: 2rem;
		box-shadow: 0 16px 64px rgba(82, 121, 82, 0.12);
		margin-bottom: 1.5rem;
		border-radius: 20px;
		backdrop-filter: blur(16px);
	}

	.model-selection h3 {
		margin-top: 0;
		margin-bottom: 1.5rem;
		font-size: 1.25rem;
		color: #2e4a2e;
		text-align: center;
		font-weight: 600;
		text-transform: none;
		letter-spacing: 0.01em;
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
		padding: 1rem 3rem 1rem 1.25rem;
		border: 1px solid rgba(82, 121, 82, 0.3);
		border-radius: 12px;
		font-size: 0.9rem;
		font-weight: 500;
		background: rgba(255, 255, 255, 0.9);
		text-align: center;
		box-shadow: 0 4px 16px rgba(82, 121, 82, 0.1);
		font-family: 'Space Grotesk', system-ui, sans-serif;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		appearance: none;
		background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23527952' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
		background-repeat: no-repeat;
		background-position: right 1rem center;
		background-size: 1.25em;
		color: #2e4a2e;
		backdrop-filter: blur(8px);
	}

	.model-controls select:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 8px 32px rgba(82, 121, 82, 0.2);
		background: rgba(255, 255, 255, 1);
		border-color: rgba(82, 121, 82, 0.4);
	}

	.model-controls select:focus {
		outline: none;
		border-color: rgba(82, 121, 82, 0.6);
		box-shadow: 0 0 0 3px rgba(82, 121, 82, 0.1);
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
		gap: 0.75rem;
		color: #2e4a2e;
		font-weight: 500;
		font-size: 1rem;
		background: rgba(82, 121, 82, 0.1);
		padding: 0.75rem 1.25rem;
		border: 1px solid rgba(82, 121, 82, 0.2);
		border-radius: 12px;
		text-transform: none;
		backdrop-filter: blur(8px);
	}

	.checkmark {
		font-size: 1.125rem;
		color: #527952;
		filter: drop-shadow(0 1px 3px rgba(82, 121, 82, 0.3));
	}

	.model-controls-loaded {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		align-items: center;
	}

	.change-model-btn {
		padding: 0.625rem 1.25rem;
		background: rgba(255, 255, 255, 0.9);
		color: #527952;
		border: 1px solid rgba(82, 121, 82, 0.3);
		border-radius: 12px;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 500;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		text-transform: none;
		letter-spacing: 0.01em;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		box-shadow: 0 2px 8px rgba(82, 121, 82, 0.1);
		backdrop-filter: blur(8px);
	}

	.change-model-btn:hover {
		background: rgba(255, 255, 255, 1);
		transform: translateY(-1px);
		box-shadow: 0 4px 16px rgba(82, 121, 82, 0.2);
		border-color: rgba(82, 121, 82, 0.4);
		color: #2e4a2e;
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
