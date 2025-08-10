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
	<!-- Nature decoration -->
	<svg class="model-decoration" width="60" height="60" viewBox="0 0 60 60">
		<g opacity="0.15">
			<path
				d="M30,10 Q20,20 20,30 Q20,40 30,50 Q40,40 40,30 Q40,20 30,10"
				fill="currentColor"
				opacity="0.3"
			/>
			<circle
				cx="30"
				cy="30"
				r="25"
				fill="none"
				stroke="currentColor"
				stroke-width="1"
				stroke-dasharray="1 3"
				opacity="0.5"
			/>
			<circle cx="15" cy="15" r="2" fill="currentColor" />
			<circle cx="45" cy="15" r="2" fill="currentColor" />
			<circle cx="15" cy="45" r="2" fill="currentColor" />
			<circle cx="45" cy="45" r="2" fill="currentColor" />
		</g>
	</svg>

	<h3>
		<svg
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
			style="display: inline-block; vertical-align: middle; margin-right: 6px;"
		>
			<circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5" />
			<path d="M10 6V10L13 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
		</svg>
		Select Whisper Model
	</h3>

	<div class="model-controls">
		<div class="select-wrapper">
			<select bind:value={selectedModel} disabled={isLoading}>
				{#each availableModels as model (model.path)}
					<option value={model.path}>{model.name}</option>
				{/each}
			</select>
			<svg class="select-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
				<path
					d="M4 6L8 10L12 6"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</div>

		{#if !isReady}
			<button onclick={onLoadModel} disabled={isLoading} class="load-model-btn primary-button">
				{#if isLoading}
					<svg class="loading-spinner" width="18" height="18" viewBox="0 0 18 18" fill="none">
						<circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="1.5" opacity="0.3" />
						<path
							d="M9 2C13 2 16 5 16 9"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
						/>
					</svg>
					Loading Model...
				{:else}
					<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
						<path
							d="M9 3V9L12 12"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="1.5" />
					</svg>
					Load Model
				{/if}
			</button>
		{:else}
			<div class="model-controls-loaded">
				<div class="model-ready">
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
						<circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" />
						<path
							d="M5 8L7 10L11 6"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
					<span>Model Ready</span>
				</div>
				{#if selectedModel !== availableModels[0].path}
					<button onclick={onChangeModel} disabled={isLoading} class="change-model-btn">
						{#if isLoading}
							Changing...
						{:else}
							Change Model
						{/if}
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
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.95) 0%,
			rgba(250, 248, 243, 0.98) 100%
		);
		border: 1px solid rgba(139, 111, 71, 0.15);
		padding: 1.75rem;
		box-shadow:
			0 4px 20px rgba(46, 90, 61, 0.08),
			0 1px 3px rgba(139, 111, 71, 0.08);
		margin-bottom: 1.5rem;
		border-radius: 16px;
		backdrop-filter: blur(10px);
		position: relative;
		overflow: hidden;
	}

	.model-decoration {
		position: absolute;
		top: -5px;
		right: -5px;
		color: var(--forest-primary);
		animation: gentle-float 8s ease-in-out infinite;
		pointer-events: none;
	}

	@keyframes gentle-float {
		0%,
		100% {
			transform: translateY(0) rotate(0deg);
		}
		50% {
			transform: translateY(-5px) rotate(5deg);
		}
	}

	.model-selection h3 {
		margin-top: 0;
		margin-bottom: 1.25rem;
		font-size: 1.125rem;
		color: var(--forest-primary);
		text-align: center;
		font-weight: 600;
		letter-spacing: -0.01em;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.model-controls {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
	}

	.select-wrapper {
		position: relative;
		width: 100%;
		max-width: 400px;
	}

	.model-controls select {
		width: 100%;
		padding: 0.75rem 2.5rem 0.75rem 1rem;
		border: 1px solid rgba(139, 111, 71, 0.2);
		border-radius: 10px;
		font-size: 0.9375rem;
		font-weight: 500;
		background: rgba(255, 255, 255, 0.8);
		text-align: left;
		box-shadow:
			0 2px 8px rgba(46, 90, 61, 0.05),
			inset 0 1px 0 rgba(255, 255, 255, 0.5);
		font-family: 'Space Grotesk', system-ui, sans-serif;
		cursor: pointer;
		transition: all 0.3s ease;
		appearance: none;
		color: var(--text-primary);
	}

	.select-arrow {
		position: absolute;
		right: 0.875rem;
		top: 50%;
		transform: translateY(-50%);
		pointer-events: none;
		color: var(--forest-primary);
		opacity: 0.6;
	}

	.model-controls select:hover:not(:disabled) {
		border-color: rgba(46, 90, 61, 0.3);
		background: rgba(255, 255, 255, 0.95);
	}

	.model-controls select:focus {
		outline: none;
		border-color: var(--forest-primary);
		box-shadow:
			0 4px 16px rgba(46, 90, 61, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.5);
		background: white;
	}

	.model-controls select:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.load-model-btn {
		min-width: 180px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}

	.loading-spinner {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.model-ready {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--forest-primary);
		font-weight: 600;
		font-size: 0.975rem;
		background: linear-gradient(
			135deg,
			rgba(136, 179, 120, 0.15) 0%,
			rgba(168, 185, 159, 0.1) 100%
		);
		padding: 0.625rem 1.125rem;
		border: 1px solid rgba(46, 90, 61, 0.2);
		border-radius: 10px;
		letter-spacing: 0.02em;
	}

	.model-controls-loaded {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		align-items: center;
	}

	.change-model-btn {
		padding: 0.5rem 1rem;
		background: linear-gradient(135deg, rgba(212, 165, 116, 0.1) 0%, rgba(139, 111, 71, 0.15) 100%);
		color: var(--earth-soil);
		border: 1px solid rgba(139, 111, 71, 0.2);
		border-radius: 8px;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 600;
		transition: all 0.3s ease;
		letter-spacing: 0.02em;
		font-family: 'Space Grotesk', system-ui, sans-serif;
	}

	.change-model-btn:hover:not(:disabled) {
		background: linear-gradient(135deg, rgba(212, 165, 116, 0.2) 0%, rgba(139, 111, 71, 0.25) 100%);
		transform: translateY(-1px);
		box-shadow: 0 2px 8px rgba(139, 111, 71, 0.15);
	}

	.change-model-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.primary-button {
		padding: 0.875rem 1.75rem;
		background: linear-gradient(135deg, var(--forest-light) 0%, var(--forest-primary) 100%);
		color: white;
		border: 1px solid rgba(46, 90, 61, 0.3);
		border-radius: 12px;
		cursor: pointer;
		font-size: 0.9375rem;
		font-weight: 600;
		transition: all 0.3s ease;
		box-shadow:
			0 4px 16px rgba(45, 90, 61, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.1);
		letter-spacing: 0.03em;
		font-family: 'Space Grotesk', system-ui, sans-serif;
	}

	.primary-button:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow:
			0 6px 24px rgba(45, 90, 61, 0.25),
			inset 0 1px 0 rgba(255, 255, 255, 0.15);
		background: linear-gradient(135deg, var(--moss-green) 0%, var(--forest-light) 100%);
	}

	.primary-button:active:not(:disabled) {
		transform: translateY(0);
		box-shadow:
			0 2px 8px rgba(45, 90, 61, 0.2),
			inset 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	.primary-button:disabled {
		background: linear-gradient(135deg, var(--earth-stone) 0%, var(--text-muted) 100%);
		color: rgba(255, 255, 255, 0.6);
		cursor: not-allowed;
		opacity: 0.7;
	}

	@media (max-width: 600px) {
		.model-selection {
			padding: 1.25rem;
		}

		.model-selection h3 {
			font-size: 1rem;
		}

		.model-controls {
			align-items: stretch;
		}

		.model-controls select {
			max-width: none;
		}

		.model-decoration {
			width: 50px;
			height: 50px;
		}
	}
</style>
