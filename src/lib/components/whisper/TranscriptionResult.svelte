<script lang="ts">
	import subsrt from 'subsrt-ts';

	interface Props {
		text: string;
		transcriptionData?: {
			transcription: Array<{
				text: string;
				timestamps: {
					from: string;
					to: string;
				};
			}>;
		};
	}

	let { text, transcriptionData }: Props = $props();

	let activeTab = $state<'text' | 'srt'>('text');
	let hasCopied = $state(false);

	// Convert transcription data to SRT format using subsrt-ts
	function convertToSRT(): string {
		if (!transcriptionData?.transcription?.length) return '';

		// Transform transcription data to subsrt format
		const captions = transcriptionData.transcription.map((segment, index) => {
			// Convert timestamp format from "hh:mm:ss,mmm" to milliseconds
			const startMs = timestampToMs(segment.timestamps.from);
			const endMs = timestampToMs(segment.timestamps.to);

			return {
				type: 'caption' as const,
				index: index + 1,
				start: startMs,
				end: endMs,
				duration: endMs - startMs,
				content: segment.text.trim(),
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
		<div class="result-decoration"></div>
		<div class="result-content">
			<div class="result-header">
				<h3>
					<span class="header-icon">📝</span>
					Transcription Result
				</h3>
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
							<span class="copy-icon">✅</span>
							Copied!
						{:else}
							<span class="copy-icon">📋</span>
							Copy
						{/if}
					</button>
				</div>
			</div>

			<div class="result-text-container">
				{#if !transcriptionData?.transcription?.length || activeTab === 'text'}
					<p class="result-text">{text}</p>
				{:else if activeTab === 'srt' && transcriptionData?.transcription?.length}
					<pre class="srt-preview">{convertToSRT()}</pre>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.result-wrapper {
		display: flex;
		margin: 1.5rem 0;
		width: 100%;
		animation: gentle-result-slide 0.8s ease-out;
	}

	@keyframes gentle-result-slide {
		from {
			transform: translateY(20px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.result {
		position: relative;
		width: 100%;
		max-width: 100%;
	}

	.result-decoration {
		position: absolute;
		top: -15px;
		left: -15px;
		right: -15px;
		bottom: -15px;
		background: radial-gradient(
			circle at 25% 75%,
			rgba(82, 121, 82, 0.08) 0%,
			rgba(107, 142, 107, 0.04) 50%,
			transparent 100%
		);
		z-index: -1;
		opacity: 0.6;
		border-radius: 30px;
	}

	.result-content {
		padding: 2.5rem;
		background: rgba(255, 255, 255, 0.95);
		border: 1px solid rgba(82, 121, 82, 0.2);
		box-shadow: 0 16px 64px rgba(82, 121, 82, 0.15);
		position: relative;
		border-radius: 20px;
		backdrop-filter: blur(16px);
	}

	.result-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
		flex-wrap: wrap;
		gap: 1rem;
		padding-bottom: 1rem;
		border-bottom: 3px solid #000;
	}

	.result-content h3 {
		margin: 0;
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.5rem;
		color: #2e4a2e;
		letter-spacing: 0.01em;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		background: linear-gradient(135deg, rgba(82, 121, 82, 0.1) 0%, rgba(107, 142, 107, 0.08) 100%);
		padding: 0.75rem 1.5rem;
		border: 1px solid rgba(82, 121, 82, 0.2);
		box-shadow: 0 4px 16px rgba(82, 121, 82, 0.1);
		width: fit-content;
		text-transform: none;
		border-radius: 12px;
		backdrop-filter: blur(8px);
		font-weight: 600;
	}

	.header-icon {
		font-size: 1.25rem;
		filter: drop-shadow(0 1px 3px rgba(82, 121, 82, 0.3));
	}

	.result-actions {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	/* Tab selectors */
	.tab-selectors {
		display: flex;
		border: 1px solid rgba(82, 121, 82, 0.3);
		background: rgba(255, 255, 255, 0.9);
		box-shadow: 0 4px 16px rgba(82, 121, 82, 0.1);
		border-radius: 12px;
		overflow: hidden;
		backdrop-filter: blur(8px);
	}

	.tab-selectors button {
		padding: 0.75rem 1.25rem;
		background: transparent;
		border: none;
		cursor: pointer;
		font-size: 0.9rem;
		font-weight: 500;
		color: #527952;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		text-transform: none;
		letter-spacing: 0.01em;
		font-family: 'Space Grotesk', monospace;
	}

	.tab-selectors button:not(:last-child) {
		border-right: 1px solid rgba(82, 121, 82, 0.2);
	}

	.tab-selectors button:hover:not(.active) {
		background: rgba(82, 121, 82, 0.05);
		color: #2e4a2e;
	}

	.tab-selectors button.active {
		background: rgba(82, 121, 82, 0.1);
		color: #2e4a2e;
	}

	/* Result text container */
	.result-text-container {
		background: rgba(82, 121, 82, 0.03);
		border: 1px solid rgba(82, 121, 82, 0.2);
		padding: 2rem;
		box-shadow: inset 0 2px 8px rgba(82, 121, 82, 0.05);
		min-height: 100px;
		max-height: 400px;
		overflow-y: auto;
		border-radius: 12px;
		backdrop-filter: blur(4px);
	}

	.result-text {
		margin: 0;
		font-size: 1rem;
		line-height: 1.7;
		color: #2e4a2e;
		font-weight: 400;
		white-space: pre-wrap;
		word-break: break-word;
	}

	/* SRT Preview */
	.srt-preview {
		font-family: 'Space Grotesk', monospace;
		font-size: 0.9rem;
		line-height: 1.6;
		white-space: pre-wrap;
		background: rgba(255, 255, 255, 0.9);
		padding: 1.25rem;
		border: 1px dashed rgba(82, 121, 82, 0.3);
		overflow-x: auto;
		margin: 0;
		color: #2e4a2e;
		font-weight: 400;
		border-radius: 8px;
		backdrop-filter: blur(4px);
	}

	.copy-btn {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1.5rem;
		background: linear-gradient(135deg, #527952 0%, #6b8e6b 100%);
		color: #ffffff;
		border: 1px solid rgba(82, 121, 82, 0.3);
		cursor: pointer;
		font-size: 0.9rem;
		font-weight: 500;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 4px 16px rgba(82, 121, 82, 0.2);
		text-transform: none;
		letter-spacing: 0.01em;
		font-family: 'Space Grotesk', monospace;
		border-radius: 12px;
	}

	.copy-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 32px rgba(82, 121, 82, 0.3);
		background: linear-gradient(135deg, #6b8e6b 0%, #7da47d 100%);
	}

	.copy-btn.copied {
		background: linear-gradient(135deg, rgba(82, 121, 82, 0.9) 0%, rgba(107, 142, 107, 0.8) 100%);
		animation: gentle-copy-success 0.5s ease-out;
	}

	@keyframes gentle-copy-success {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.05);
		}
		100% {
			transform: scale(1);
		}
	}

	.copy-icon {
		font-size: 1.125rem;
		filter: drop-shadow(0 1px 2px rgba(255, 255, 255, 0.3));
	}

	/* Custom scrollbar */
	.result-text-container::-webkit-scrollbar {
		width: 8px;
	}

	.result-text-container::-webkit-scrollbar-track {
		background: rgba(82, 121, 82, 0.1);
		border-radius: 4px;
	}

	.result-text-container::-webkit-scrollbar-thumb {
		background: linear-gradient(135deg, rgba(82, 121, 82, 0.6) 0%, rgba(107, 142, 107, 0.5) 100%);
		border-radius: 4px;
		transition: background 0.3s ease;
	}

	.result-text-container::-webkit-scrollbar-thumb:hover {
		background: linear-gradient(135deg, rgba(82, 121, 82, 0.8) 0%, rgba(107, 142, 107, 0.7) 100%);
	}

	@media (max-width: 600px) {
		.result-content {
			padding: 1.25rem;
		}

		.result-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}

		.result-content h3 {
			font-size: 1.5rem;
		}

		.result-actions {
			width: 100%;
			flex-direction: column;
			align-items: stretch;
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

		.result-text-container {
			padding: 1rem;
		}
	}
</style>
