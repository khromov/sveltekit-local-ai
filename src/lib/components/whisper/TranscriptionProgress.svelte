<script lang="ts">
	import ProgressBar from '../ProgressBar.svelte';

	interface Props {
		progress: number;
		previousProgress?: number;
		currentSegment?: string;
		isStuck?: boolean;
		onReload?: () => void;
	}

	let {
		progress = 0,
		previousProgress = 0,
		currentSegment = '',
		isStuck = false,
		onReload
	}: Props = $props();
</script>

<div class="transcribing">
	<h3>Transcribing Audio</h3>
	<p class="progress-percentage">{progress}% Complete</p>

	<div class="progress-wrapper">
		<ProgressBar {progress} {previousProgress} />
	</div>

	{#if currentSegment}
		<div class="segment-preview">
			<h4>Current Segment</h4>
			<p>"{currentSegment}"</p>
		</div>
	{/if}

	{#if isStuck}
		<p class="stuck-message">
			Transcription seems stuck. <button class="reload-link" onclick={onReload}>
				Reload the page
			</button> and try again.
		</p>
	{:else}
		<p class="transcribing-message">
			⚠️ Keep this tab active during transcription to avoid issues.
		</p>
	{/if}
</div>

<style>
	.transcribing {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2rem;
		background-color: white;
		border-radius: 16px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		margin: 1rem 0;
		animation: fadeIn 0.3s ease-in-out;
	}

	.transcribing h3 {
		margin-top: 0;
		margin-bottom: 0.5rem;
		font-size: 1.375rem;
		font-weight: 600;
		color: #333;
	}

	.progress-percentage {
		font-size: 1.125rem;
		font-weight: 500;
		color: #0071e3;
		margin-bottom: 1rem;
	}

	.progress-wrapper {
		width: 100%;
		max-width: 300px;
	}

	.segment-preview {
		margin: 1rem 0;
		padding: 1rem;
		background-color: #f8f9ff;
		border: 1px solid #e1e5ff;
		border-radius: 12px;
		width: 100%;
		max-width: 400px;
		animation: fadeIn 0.3s ease-in-out;
	}

	.segment-preview h4 {
		text-align: center;
		margin: 0 0 0.5rem 0;
		font-size: 0.875rem;
		font-weight: 600;
		color: #555;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.segment-preview p {
		margin: 0;
		font-size: 0.9375rem;
		line-height: 1.4;
		color: #333;
		font-style: italic;
	}

	.transcribing-message {
		margin-top: 1rem;
		color: #666;
		font-weight: 500;
		text-align: center;
		background-color: #fff3cd;
		padding: 0.75rem 1rem;
		border-radius: 8px;
		border: 1px solid #ffeaa8;
	}

	.stuck-message {
		margin-top: 1rem;
		color: #ff3b30;
		font-weight: 500;
		text-align: center;
		background-color: #feeced;
		padding: 0.75rem 1rem;
		border-radius: 8px;
		border: 1px solid #ffcccc;
	}

	.reload-link {
		background: none;
		border: none;
		color: #0071e3;
		text-decoration: underline;
		cursor: pointer;
		font-size: inherit;
		font-weight: inherit;
		padding: 0;
	}

	.reload-link:hover {
		text-decoration: none;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 600px) {
		.transcribing {
			padding: 1.5rem;
		}

		.segment-preview {
			max-width: none;
		}
	}
</style>
