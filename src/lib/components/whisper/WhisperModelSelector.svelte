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
	<div class="selection-decoration">
		<svg viewBox="0 0 60 60" width="60" height="60">
			<circle
				cx="30"
				cy="30"
				r="20"
				fill="none"
				stroke="var(--sage)"
				stroke-width="2"
				opacity="0.3"
			/>
			<circle cx="25" cy="25" r="2" fill="var(--clay)" opacity="0.5" />
			<circle cx="35" cy="25" r="2" fill="var(--clay)" opacity="0.5" />
			<path
				d="M22,35 Q30,42 38,35"
				stroke="var(--earth-dark)"
				stroke-width="2"
				fill="none"
				opacity="0.4"
			/>
		</svg>
	</div>
	<h3>Choose Whisper Model</h3>
	<div class="model-controls">
		<div class="select-wrapper">
			<label class="select-label" for="whisper-model-select">
				<svg viewBox="0 0 16 16" width="14" height="14" class="label-icon">
					<path
						d="M2,8 L8,2 L14,8 L8,14 Z"
						fill="none"
						stroke="var(--earth-dark)"
						stroke-width="1.5"
					/>
					<circle cx="8" cy="8" r="2" fill="var(--mocha-mousse)" opacity="0.6" />
				</svg>
				Model
			</label>
			<select id="whisper-model-select" bind:value={selectedModel} disabled={isLoading}>
				{#each availableModels as model (model.path)}
					<option value={model.path}>{model.name}</option>
				{/each}
			</select>
		</div>

		{#if !isReady}
			<button onclick={onLoadModel} disabled={isLoading} class="load-model-btn primary-button">
				{#if isLoading}
					<svg viewBox="0 0 20 20" width="18" height="18" class="loading-icon">
						<circle
							cx="10"
							cy="10"
							r="6"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							opacity="0.3"
						/>
						<path d="M10 4 A 6 6 0 0 1 16 10" stroke="currentColor" stroke-width="2" fill="none">
							<animateTransform
								attributeName="transform"
								type="rotate"
								values="0 10 10;360 10 10"
								dur="1s"
								repeatCount="indefinite"
							/>
						</path>
					</svg>
					Loading...
				{:else}
					<svg viewBox="0 0 20 20" width="18" height="18" class="button-icon">
						<path
							d="M4,10 L16,10 M12,6 L16,10 L12,14"
							stroke="currentColor"
							stroke-width="2"
							fill="none"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
					Load Model
				{/if}
			</button>
		{:else}
			<div class="model-controls-loaded">
				<div class="model-ready">
					<svg viewBox="0 0 20 20" width="18" height="18" class="checkmark">
						<circle cx="10" cy="10" r="8" fill="var(--sage)" opacity="0.2" />
						<path
							d="M6,10 L9,13 L14,7"
							stroke="var(--earth-dark)"
							stroke-width="2"
							fill="none"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
					<span>Model Ready</span>
				</div>
				{#if selectedModel !== availableModels[0].path}
					<button onclick={onChangeModel} disabled={isLoading} class="change-model-btn">
						{#if isLoading}
							<svg viewBox="0 0 16 16" width="14" height="14" class="loading-small">
								<circle
									cx="8"
									cy="8"
									r="4"
									fill="none"
									stroke="currentColor"
									stroke-width="1.5"
									opacity="0.3"
								/>
								<path
									d="M8 4 A 4 4 0 0 1 12 8"
									stroke="currentColor"
									stroke-width="1.5"
									fill="none"
								>
									<animateTransform
										attributeName="transform"
										type="rotate"
										values="0 8 8;360 8 8"
										dur="1s"
										repeatCount="indefinite"
									/>
								</path>
							</svg>
							Changing...
						{:else}
							<svg viewBox="0 0 16 16" width="14" height="14" class="change-icon">
								<path
									d="M2,8 A6,6 0 1,1 14,8 M11,5 L14,8 L11,11"
									stroke="currentColor"
									stroke-width="1.5"
									fill="none"
									stroke-linecap="round"
								/>
							</svg>
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
		background: rgba(245, 241, 235, 0.8);
		backdrop-filter: blur(15px);
		border: 1px solid var(--earth-medium);
		padding: 2rem;
		box-shadow:
			0 8px 32px rgba(139, 111, 71, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
		margin-bottom: 1.5rem;
		border-radius: 1.5rem;
		position: relative;
		animation: fadeInUp 0.6s ease-out;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.selection-decoration {
		position: absolute;
		top: -15px;
		right: -15px;
		opacity: 0.6;
		z-index: 0;
		animation: gentleFloat 6s ease-in-out infinite;
	}

	@keyframes gentleFloat {
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
		margin-bottom: 1.5rem;
		font-size: 1.25rem;
		color: var(--text-primary);
		text-align: center;
		font-weight: 600;
		letter-spacing: 0.02em;
		position: relative;
		z-index: 1;
	}

	.model-controls {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		align-items: center;
	}

	.select-wrapper {
		width: 100%;
		max-width: 400px;
		position: relative;
	}

	.select-label {
		position: absolute;
		top: -12px;
		left: 16px;
		background: rgba(245, 241, 235, 0.95);
		padding: 4px 8px;
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.03em;
		color: var(--text-secondary);
		z-index: 1;
		border: 1px solid var(--earth-medium);
		border-radius: 0.75rem;
		display: flex;
		align-items: center;
		gap: 0.375rem;
		backdrop-filter: blur(5px);
	}

	.label-icon {
		opacity: 0.7;
	}

	.model-controls select {
		width: 100%;
		padding: 1rem 3rem 1rem 1.25rem;
		border: 1px solid var(--earth-medium);
		border-radius: 1rem;
		font-size: 0.95rem;
		font-weight: 500;
		background: rgba(245, 241, 235, 0.9);
		backdrop-filter: blur(10px);
		text-align: center;
		box-shadow:
			0 4px 15px rgba(139, 111, 71, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
		font-family: 'Space Grotesk', 'Georgia', serif;
		cursor: pointer;
		transition: all 0.3s ease;
		appearance: none;
		color: var(--text-primary);
		background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%238b6f47' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 8 10 12 14 8'%3e%3c/polyline%3e%3c/svg%3e");
		background-repeat: no-repeat;
		background-position: right 1rem center;
		background-size: 1.25em;
	}

	.model-controls select:hover:not(:disabled) {
		transform: translateY(-1px);
		box-shadow:
			0 6px 20px rgba(139, 111, 71, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
		background: rgba(245, 241, 235, 0.95);
	}

	.model-controls select:focus {
		outline: none;
		border-color: var(--mocha-mousse);
		box-shadow:
			0 6px 20px rgba(139, 111, 71, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.9),
			0 0 0 3px rgba(167, 132, 106, 0.1);
	}

	.model-controls select:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.load-model-btn {
		min-width: 180px;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.model-ready {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		color: var(--text-primary);
		font-weight: 500;
		font-size: 1rem;
		background: linear-gradient(135deg, rgba(156, 175, 136, 0.2) 0%, rgba(245, 241, 235, 0.8) 100%);
		backdrop-filter: blur(10px);
		padding: 0.75rem 1.25rem;
		border: 1px solid var(--sage);
		border-radius: 1.5rem;
		letter-spacing: 0.02em;
		box-shadow:
			0 4px 15px rgba(139, 111, 71, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.6);
	}

	.checkmark {
		filter: drop-shadow(0 1px 2px rgba(139, 111, 71, 0.2));
	}

	.model-controls-loaded {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
	}

	.change-model-btn {
		padding: 0.6rem 1.25rem;
		background: rgba(168, 160, 144, 0.1);
		color: var(--text-primary);
		border: 1px solid var(--earth-medium);
		border-radius: 1.25rem;
		cursor: pointer;
		font-size: 0.85rem;
		font-weight: 500;
		transition: all 0.3s ease;
		letter-spacing: 0.02em;
		font-family: 'Space Grotesk', 'Georgia', serif;
		box-shadow:
			0 2px 8px rgba(139, 111, 71, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.6);
		display: flex;
		align-items: center;
		gap: 0.5rem;
		backdrop-filter: blur(5px);
	}

	.change-model-btn:hover:not(:disabled) {
		background: rgba(168, 160, 144, 0.2);
		transform: translateY(-1px);
		box-shadow:
			0 4px 12px rgba(139, 111, 71, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
	}

	.change-model-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.button-icon,
	.loading-icon,
	.change-icon,
	.loading-small {
		filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
	}

	@media (max-width: 600px) {
		.model-selection {
			padding: 1.5rem;
		}

		.model-controls {
			align-items: stretch;
		}

		.select-wrapper {
			max-width: none;
		}

		.model-controls select {
			text-align: left;
		}

		.model-controls-loaded {
			align-items: stretch;
		}

		.model-ready {
			justify-content: center;
		}

		.change-model-btn {
			justify-content: center;
		}

		.selection-decoration {
			display: none;
		}
	}
</style>
