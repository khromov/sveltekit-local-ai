<script lang="ts">
	import subsrt from 'subsrt-ts';

	interface Props {
		text: string;
		transcriptionData?: any;
	}

	let { text, transcriptionData }: Props = $props();

	let activeTab = $state<'text' | 'srt'>('text');
	let hasCopied = $state(false);

	// Convert transcription data to SRT format using subsrt-ts
	function convertToSRT(): string {
		if (!transcriptionData?.transcription?.length) return '';

		// Transform transcription data to subsrt format
		const captions = transcriptionData.transcription.map((segment: any) => {
			// Convert timestamp format from "hh:mm:ss,mmm" to milliseconds
			const startMs = timestampToMs(segment.timestamps.from);
			const endMs = timestampToMs(segment.timestamps.to);

			return {
				start: startMs,
				end: endMs,
				text: segment.text.trim()
			};
		});

		// Generate SRT content using subsrt-ts
		return subsrt.build(captions, { format: 'srt' });
	}

	// Helper function to convert SRT timestamp format to milliseconds
	function timestampToMs(timestamp: string): number {
		// timestamp format: "hh:mm:ss,mmm"
		const [time, ms] = timestamp.split(',');
		const [hours, minutes, seconds] = time.split(':').map(Number);

		return (hours * 3600 + minutes * 60 + seconds) * 1000 + Number(ms);
	}

	async function copyToClipboard() {
		try {
			const contentToCopy = activeTab === 'text' ? text : convertToSRT();
			await navigator.clipboard.writeText(contentToCopy);
			hasCopied = true;
			setTimeout(() => {
				hasCopied = false;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy to clipboard:', err);
		}
	}
</script>

<div class="result-wrapper">
	<div class="result">
		<div class="result-content">
			<div class="result-header">
				<h3>Transcription Result:</h3>
				<div class="result-actions">
					{#if transcriptionData?.transcription?.length}
						<div class="tab-selectors">
							<button class:active={activeTab === 'text'} onclick={() => (activeTab = 'text')}>
								Text
							</button>
							<button class:active={activeTab === 'srt'} onclick={() => (activeTab = 'srt')}>
								SRT
							</button>
						</div>
					{/if}

					<button class="copy-btn" onclick={copyToClipboard} class:copied={hasCopied}>
						{#if hasCopied}
							<svg
								class="copy-icon"
								viewBox="0 0 24 24"
								width="16"
								height="16"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<polyline points="20,6 9,17 4,12"></polyline>
							</svg>
							Copied!
						{:else}
							<svg
								class="copy-icon"
								viewBox="0 0 24 24"
								width="16"
								height="16"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
								<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
							</svg>
							Copy
						{/if}
					</button>
				</div>
			</div>

			{#if !transcriptionData?.transcription?.length || activeTab === 'text'}
				<p>{text}</p>
			{:else if activeTab === 'srt' && transcriptionData?.transcription?.length}
				<pre class="srt-preview">{convertToSRT()}</pre>
			{/if}
		</div>
	</div>
</div>

<style>
	.result-wrapper {
		display: flex;
		margin: 1rem 0;
		width: 100%;
		animation: fadeIn 0.3s ease-in-out;
	}

	.result {
		position: relative;
		width: 100%;
		max-width: 100%;
	}

	.result-content {
		padding: 1.25rem;
		border-radius: 16px;
		font-size: 1.0625rem;
		line-height: 1.5;
		white-space: pre-wrap;
		word-break: break-word;
		background-color: #e5e5ea;
		color: #000;
		box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
	}

	.result-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.75rem;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.result-content h3 {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 600;
		color: #333;
	}

	.result-content p {
		margin: 0;
	}

	.result-actions {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	/* Tab selectors */
	.tab-selectors {
		display: flex;
		border-radius: 8px;
		overflow: hidden;
		border: 1px solid #e1e1e1;
	}

	.tab-selectors button {
		padding: 0.5rem 0.75rem;
		background-color: #f8f8f8;
		border: none;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 500;
		color: #666;
		transition: all 0.2s ease;
	}

	.tab-selectors button:not(:last-child) {
		border-right: 1px solid #e1e1e1;
	}

	.tab-selectors button:hover:not(.active) {
		background-color: #f0f0f0;
	}

	.tab-selectors button.active {
		background-color: #0071e3;
		color: white;
	}

	/* SRT Preview */
	.srt-preview {
		font-family: monospace;
		font-size: 0.9rem;
		line-height: 1.5;
		white-space: pre-wrap;
		background-color: #f8f8f8;
		padding: 1rem;
		border-radius: 8px;
		border: 1px solid #e1e1e1;
		overflow-x: auto;
		margin: 0;
	}

	.copy-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		background-color: #0071e3;
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 500;
		transition: all 0.2s ease;
	}

	.copy-btn:hover {
		background-color: #0062cc;
	}

	.copy-btn.copied {
		background-color: #28a745;
	}

	.copy-icon {
		width: 16px;
		height: 16px;
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
		.result-content {
			font-size: 1rem;
			padding: 1rem;
		}

		.result-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.75rem;
		}

		.result-actions {
			width: 100%;
			flex-direction: column;
			align-items: flex-start;
			gap: 0.75rem;
		}

		.tab-selectors {
			width: 100%;
		}

		.tab-selectors button {
			flex: 1;
		}

		.copy-btn {
			width: 100%;
			justify-content: center;
		}
	}
</style>
