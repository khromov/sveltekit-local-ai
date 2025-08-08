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
	<div class="selection-decoration"></div>
	<h3>
		<span class="title-icon">🎙️</span>
		SELECT MODEL
	</h3>
	<div class="model-controls">
		<div class="select-wrapper">
			<label class="select-label">WHISPER MODEL</label>
			<select bind:value={selectedModel} disabled={isLoading}>
				{#each availableModels as model (model.path)}
					<option value={model.path}>{model.name}</option>
				{/each}
			</select>
		</div>

		{#if !isReady}
			<button onclick={onLoadModel} disabled={isLoading} class="load-model-btn primary-button">
				{#if isLoading}
					<span class="loading-spinner">◐</span>
					LOADING MODEL...
				{:else}
					<span class="button-icon">🚀</span>
					LOAD MODEL
				{/if}
			</button>
		{:else}
			<div class="model-controls-loaded">
				<div class="model-ready">
					<span class="checkmark">✅</span>
					<span>MODEL READY</span>
				</div>
				{#if selectedModel !== availableModels[0].path}
					<button onclick={onChangeModel} disabled={isLoading} class="change-model-btn">
						{isLoading ? 'CHANGING...' : 'CHANGE MODEL'}
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
		background: #FFF;
		border: 4px solid #000;
		padding: 2rem;
		box-shadow: 8px 8px 0 #000;
		margin-bottom: 1.5rem;
		position: relative;
		transform: rotate(-0.5deg);
		animation: slideIn 0.4s ease-out;
	}

	@keyframes slideIn {
		from {
			transform: translateX(-20px) rotate(-1deg);
			opacity: 0;
		}
		to {
			transform: translateX(0) rotate(-0.5deg);
			opacity: 1;
		}
	}

	.selection-decoration {
		position: absolute;
		top: -8px;
		left: -8px;
		right: -8px;
		bottom: -8px;
		background: linear-gradient(135deg, #98FB98 0%, #87CEEB 100%);
		z-index: -1;
		opacity: 0.3;
		border-radius: 20% 5% 20% 5% / 5% 20% 5% 20%;
	}

	.model-selection h3 {
		margin-top: 0;
		margin-bottom: 1.5rem;
		font-family: 'Bebas Neue', sans-serif;
		font-size: 2rem;
		color: #000;
		text-align: center;
		letter-spacing: 2px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		background: #98FB98;
		padding: 0.5rem 1.5rem;
		border: 3px solid #000;
		box-shadow: 5px 5px 0 #000;
		transform: rotate(-1deg);
		width: fit-content;
		margin-left: auto;
		margin-right: auto;
	}

	.title-icon {
		font-size: 1.75rem;
	}

	.model-controls {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		align-items: center;
	}

	.select-wrapper {
		position: relative;
		width: 100%;
		max-width: 400px;
	}

	.select-label {
		position: absolute;
		top: -12px;
		left: 15px;
		background: #FFD93D;
		padding: 2px 10px;
		font-size: 0.875rem;
		font-weight: 700;
		letter-spacing: 1px;
		border: 2px solid #000;
		z-index: 1;
	}

	.model-controls select {
		width: 100%;
		padding: 1rem;
		border: 3px solid #000;
		font-size: 1rem;
		font-weight: 600;
		background: #FFF;
		text-align: center;
		box-shadow: 5px 5px 0 #000;
		font-family: 'Space Grotesk', monospace;
		cursor: pointer;
		transition: all 0.15s;
		appearance: none;
		background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
		background-repeat: no-repeat;
		background-position: right 1rem center;
		background-size: 1.5em;
		padding-right: 3rem;
	}

	.model-controls select:hover:not(:disabled) {
		transform: translate(-2px, -2px);
		box-shadow: 7px 7px 0 #000;
	}

	.model-controls select:focus {
		outline: none;
		background-color: #FFFACD;
	}

	.model-controls select:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.load-model-btn {
		min-width: 200px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
	}

	.model-ready {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		color: #000;
		font-weight: 700;
		font-size: 1.125rem;
		background: #98FB98;
		padding: 0.75rem 1.5rem;
		border: 3px solid #000;
		box-shadow: 5px 5px 0 #000;
		text-transform: uppercase;
		letter-spacing: 1px;
		transform: rotate(1deg);
	}

	.model-controls-loaded {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
	}

	.change-model-btn {
		padding: 0.75rem 1.5rem;
		background: #FFD93D;
		color: #000;
		border: 3px solid #000;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 700;
		transition: all 0.15s;
		box-shadow: 4px 4px 0 #000;
		text-transform: uppercase;
		letter-spacing: 1px;
		font-family: 'Space Grotesk', monospace;
	}

	.change-model-btn:hover {
		transform: translate(-2px, -2px);
		box-shadow: 6px 6px 0 #000;
		background: #FF69B4;
	}

	.change-model-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.checkmark {
		font-size: 1.5rem;
	}

	.button-icon {
		font-size: 1.5rem;
	}

	.loading-spinner {
		font-size: 1.5rem;
		animation: spin 1s linear infinite;
		display: inline-block;
	}

	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}

	.primary-button {
		padding: 1rem 2rem;
		background: #98FB98;
		color: #000;
		border: 4px solid #000;
		cursor: pointer;
		font-size: 1.25rem;
		font-weight: 700;
		transition: all 0.15s;
		box-shadow: 6px 6px 0 #000;
		text-transform: uppercase;
		letter-spacing: 1px;
		font-family: 'Space Grotesk', monospace;
	}

	.primary-button:hover:not(:disabled) {
		transform: translate(-3px, -3px);
		box-shadow: 9px 9px 0 #000;
		background: #FFD93D;
	}

	.primary-button:active:not(:disabled) {
		transform: translate(0);
		box-shadow: 3px 3px 0 #000;
	}

	.primary-button:disabled {
		background: #E0E0E0;
		cursor: not-allowed;
		opacity: 0.7;
	}

	@media (max-width: 600px) {
		.model-controls {
			align-items: stretch;
		}

		.select-wrapper {
			max-width: none;
		}
	}
</style>
