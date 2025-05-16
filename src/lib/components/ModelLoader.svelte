<script lang="ts">
	export let isLoading: boolean;
	export let downloadError: boolean;
	export let downloadProgress: number;
	export let previousProgress: number;
	export let loadModel: () => Promise<void>;
</script>

<div class="loading-container">
	{#if downloadError}
		<div class="error">
			<p>Failed to load model. Please check your connection and try again.</p>
			<button onclick={loadModel} disabled={isLoading}>
				{isLoading ? 'Reloading...' : 'Reload Model'}
			</button>
		</div>
	{:else if isLoading}
		<div class="loading-progress">
			<h3>Loading Model</h3>
			<p class="download-percentage">{downloadProgress}% Complete</p>
			<div class="progress-container">
				<div class="progress-bar">
					<div
						class="progress-bar-fill"
						style="width: {downloadProgress}%; transition: width {downloadProgress >
						previousProgress
							? '0.5s'
							: '0s'} ease"
					></div>
				</div>
			</div>
			<p class="loading-message">
				This will take a couple of minutes. The AI model is being downloaded to your browser.
			</p>
		</div>
	{:else}
		<div class="model-loading">
			<h2>Loading your friendly tone adjuster!</h2>
			<button onclick={loadModel}>Start Tone Adjuster</button>
		</div>
	{/if}
</div>

<style>
	.loading-container {
		width: 100%;
		max-width: 500px;
		background-color: rgba(255, 255, 255, 0.9);
		border-radius: 20px;
		box-shadow: 0 8px 32px rgba(92, 141, 137, 0.2);
		padding: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		border: 5px solid #78c2ad;
	}

	h2,
	h3 {
		font-family: 'Nunito', 'Comic Sans MS', cursive, sans-serif;
		color: #5c8d89;
		text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.7);
		text-align: center;
	}

	.loading-progress {
		width: 100%;
		text-align: center;
	}

	.download-percentage {
		font-size: 1.2rem;
		font-weight: bold;
		color: #5c8d89;
		margin: 0.5rem 0;
	}

	.progress-container {
		width: 100%;
		margin: 1rem 0;
	}

	.progress-bar {
		height: 12px;
		background-color: #e1e1e1;
		border-radius: 6px;
		overflow: hidden;
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	.progress-bar-fill {
		height: 100%;
		background-color: #78c2ad;
		border-radius: 6px;
		background-image: linear-gradient(
			45deg,
			rgba(255, 255, 255, 0.15) 25%,
			transparent 25%,
			transparent 50%,
			rgba(255, 255, 255, 0.15) 50%,
			rgba(255, 255, 255, 0.15) 75%,
			transparent 75%,
			transparent
		);
		background-size: 20px 20px;
		animation: progress-animation 1s linear infinite;
	}

	@keyframes progress-animation {
		0% {
			background-position: 0 0;
		}
		100% {
			background-position: 20px 0;
		}
	}

	.loading-message {
		font-size: 0.9rem;
		color: #5b5b5b;
		text-align: center;
		margin-top: 1rem;
	}

	.model-loading {
		text-align: center;
	}

	.model-loading button {
		background-color: #78c2ad;
		color: white;
		border: none;
		border-radius: 16px;
		padding: 0.75rem 1.5rem;
		font-size: 1.1rem;
		cursor: pointer;
		transition: all 0.2s;
		font-family: 'Nunito', sans-serif;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	}

	.model-loading button:hover {
		background-color: #5c8d89;
		transform: translateY(-2px);
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
	}

	.error {
		color: #e57373;
		text-align: center;
	}

	.error button {
		background-color: #e57373;
		color: white;
		border: none;
		border-radius: 12px;
		padding: 0.6rem 1.2rem;
		font-size: 1rem;
		cursor: pointer;
		transition: all 0.2s;
		font-family: 'Nunito', sans-serif;
		margin-top: 1rem;
	}

	.error button:hover:not(:disabled) {
		background-color: #ef5350;
		transform: translateY(-2px);
	}
</style>
