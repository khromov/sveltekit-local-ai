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
		<!-- Nature decoration -->
		<svg class="result-decoration" width="80" height="80" viewBox="0 0 80 80">
			<g opacity="0.1">
				<path d="M40,10 L40,70" stroke="currentColor" stroke-width="1" />
				<path d="M40,20 Q30,15 25,20 Q30,25 40,20" fill="currentColor" />
				<path d="M40,35 Q50,30 55,35 Q50,40 40,35" fill="currentColor" />
				<path d="M40,50 Q30,45 25,50 Q30,55 40,50" fill="currentColor" />
				<path d="M40,65 Q50,60 55,65 Q50,70 40,65" fill="currentColor" />
			</g>
		</svg>

		<div class="result-content">
			<div class="result-header">
				<h3>
					<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
						<rect
							x="3"
							y="3"
							width="14"
							height="14"
							rx="2"
							stroke="currentColor"
							stroke-width="1.5"
						/>
						<path
							d="M7 10L9 12L13 8"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
					Transcription Complete
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
							Copied!
						{:else}
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
								<rect
									x="5"
									y="5"
									width="9"
									height="9"
									rx="1"
									stroke="currentColor"
									stroke-width="1.5"
								/>
								<path
									d="M11 5V3C11 2.5 10.5 2 10 2H3C2.5 2 2 2.5 2 3V10C2 10.5 2.5 11 3 11H5"
									stroke="currentColor"
									stroke-width="1.5"
								/>
							</svg>
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
		animation: fadeIn 0.5s ease-out;
	}

	@keyframes fadeIn {
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
		top: -20px;
		right: -20px;
		color: var(--forest-primary);
		animation: gentle-sway 10s ease-in-out infinite;
		pointer-events: none;
		z-index: 0;
	}

	@keyframes gentle-sway {
		0%,
		100% {
			transform: translateX(0) rotate(0deg);
		}
		50% {
			transform: translateX(5px) rotate(3deg);
		}
	}

	.result-content {
		padding: 2rem;
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.95) 0%,
			rgba(250, 248, 243, 0.98) 100%
		);
		border: 1px solid rgba(139, 111, 71, 0.15);
		box-shadow:
			0 8px 32px rgba(46, 90, 61, 0.1),
			0 2px 8px rgba(139, 111, 71, 0.08);
		position: relative;
		border-radius: 20px;
		backdrop-filter: blur(10px);
		overflow: hidden;
		z-index: 1;
	}

	.result-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
		flex-wrap: wrap;
		gap: 1rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid rgba(139, 111, 71, 0.1);
	}

	.result-content h3 {
		margin: 0;
		font-size: 1.375rem;
		color: var(--forest-primary);
		letter-spacing: -0.01em;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 600;
	}

	.result-actions {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	/* Tab selectors */
	.tab-selectors {
		display: flex;
		border: 1px solid rgba(139, 111, 71, 0.2);
		background: rgba(255, 255, 255, 0.8);
		border-radius: 8px;
		overflow: hidden;
	}

	.tab-selectors button {
		padding: 0.5rem 1rem;
		background: transparent;
		border: none;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-secondary);
		transition: all 0.3s ease;
		letter-spacing: 0.02em;
		font-family: 'Space Grotesk', monospace;
	}

	.tab-selectors button:not(:last-child) {
		border-right: 1px solid rgba(139, 111, 71, 0.2);
	}

	.tab-selectors button:hover:not(.active) {
		background: rgba(136, 179, 120, 0.08);
		color: var(--forest-primary);
	}

	.tab-selectors button.active {
		background: linear-gradient(135deg, var(--forest-light) 0%, var(--forest-primary) 100%);
		color: white;
	}

	/* Result text container */
	.result-text-container {
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.8) 0%,
			rgba(250, 248, 243, 0.85) 100%
		);
		border: 1px solid rgba(139, 111, 71, 0.1);
		padding: 1.5rem;
		border-radius: 12px;
		min-height: 100px;
		max-height: 400px;
		overflow-y: auto;
		box-shadow: inset 0 1px 3px rgba(139, 111, 71, 0.05);
	}

	.result-text {
		margin: 0;
		font-size: 1rem;
		line-height: 1.7;
		color: var(--text-primary);
		font-weight: 400;
		white-space: pre-wrap;
		word-break: break-word;
		letter-spacing: 0.01em;
	}

	/* SRT Preview */
	.srt-preview {
		font-family: 'SF Mono', Monaco, 'Courier New', monospace;
		font-size: 0.875rem;
		line-height: 1.6;
		white-space: pre-wrap;
		background: rgba(255, 255, 255, 0.6);
		padding: 1rem;
		border: 1px dashed rgba(139, 111, 71, 0.2);
		border-radius: 8px;
		overflow-x: auto;
		margin: 0;
		color: var(--text-primary);
		font-weight: 500;
		letter-spacing: 0.02em;
	}

	.copy-btn {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.5rem 1rem;
		background: linear-gradient(
			135deg,
			rgba(136, 179, 120, 0.15) 0%,
			rgba(168, 185, 159, 0.1) 100%
		);
		color: var(--forest-primary);
		border: 1px solid rgba(46, 90, 61, 0.2);
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 600;
		transition: all 0.3s ease;
		border-radius: 8px;
		letter-spacing: 0.02em;
		font-family: 'Space Grotesk', monospace;
	}

	.copy-btn:hover {
		background: linear-gradient(
			135deg,
			rgba(136, 179, 120, 0.25) 0%,
			rgba(168, 185, 159, 0.2) 100%
		);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(46, 90, 61, 0.1);
	}

	.copy-btn.copied {
		background: linear-gradient(135deg, var(--forest-light) 0%, var(--forest-primary) 100%);
		color: white;
		animation: copySuccess 0.3s ease-out;
		border-color: transparent;
	}

	@keyframes copySuccess {
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

	/* Custom scrollbar */
	.result-text-container::-webkit-scrollbar {
		width: 8px;
	}

	.result-text-container::-webkit-scrollbar-track {
		background: rgba(139, 111, 71, 0.05);
		border-radius: 4px;
	}

	.result-text-container::-webkit-scrollbar-thumb {
		background: linear-gradient(180deg, var(--forest-light) 0%, var(--forest-primary) 100%);
		border-radius: 4px;
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	.result-text-container::-webkit-scrollbar-thumb:hover {
		background: linear-gradient(180deg, var(--moss-green) 0%, var(--forest-light) 100%);
	}

	@media (max-width: 600px) {
		.result-content {
			padding: 1.5rem 1.25rem;
		}

		.result-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.75rem;
		}

		.result-content h3 {
			font-size: 1.25rem;
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

		.result-decoration {
			width: 60px;
			height: 60px;
		}
	}
</style>
