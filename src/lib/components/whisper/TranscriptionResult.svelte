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
		<div class="result-decoration">
			<svg viewBox="0 0 80 80" width="80" height="80">
				<path
					d="M20,40 Q40,20 60,40 Q40,60 20,40"
					fill="none"
					stroke="var(--sage)"
					stroke-width="2"
					opacity="0.3"
				/>
				<circle cx="30" cy="30" r="2" fill="var(--clay)" opacity="0.5" />
				<circle cx="50" cy="50" r="2.5" fill="var(--earth-dark)" opacity="0.6" />
				<path
					d="M35,45 Q40,40 45,45"
					stroke="var(--mocha-mousse)"
					stroke-width="1.5"
					fill="none"
					opacity="0.4"
				/>
			</svg>
		</div>
		<div class="result-content">
			<div class="result-header">
				<h3>
					<svg viewBox="0 0 20 20" width="20" height="20" class="header-icon">
						<rect
							x="3"
							y="3"
							width="14"
							height="14"
							rx="2"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
						/>
						<path
							d="M6,7 L14,7 M6,9 L12,9 M6,11 L10,11"
							stroke="currentColor"
							stroke-width="1"
							opacity="0.7"
						/>
					</svg>
					Transcription Result
				</h3>
				<div class="result-actions">
					{#if transcriptionData?.transcription?.length}
						<div class="tab-selectors">
							<button class:active={activeTab === 'text'} onclick={() => (activeTab = 'text')}>
								<svg viewBox="0 0 16 16" width="14" height="14">
									<path
										d="M2,4 L14,4 M2,8 L10,8 M2,12 L8,12"
										stroke="currentColor"
										stroke-width="1.5"
									/>
								</svg>
								Text
							</button>
							<button class:active={activeTab === 'srt'} onclick={() => (activeTab = 'srt')}>
								<svg viewBox="0 0 16 16" width="14" height="14">
									<rect
										x="2"
										y="3"
										width="12"
										height="10"
										rx="2"
										fill="none"
										stroke="currentColor"
										stroke-width="1.5"
									/>
									<path d="M5,7 L11,7 M5,9 L9,9" stroke="currentColor" stroke-width="1" />
								</svg>
								SRT
							</button>
						</div>
					{/if}

					<button class="copy-btn" onclick={copyToClipboard} class:copied={hasCopied}>
						{#if hasCopied}
							<svg viewBox="0 0 20 20" width="16" height="16" class="copy-icon">
								<circle cx="10" cy="10" r="8" fill="var(--sage)" opacity="0.2" />
								<path
									d="M6,10 L9,13 L14,7"
									stroke="currentColor"
									stroke-width="2"
									fill="none"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
							Copied!
						{:else}
							<svg viewBox="0 0 20 20" width="16" height="16" class="copy-icon">
								<rect
									x="6"
									y="6"
									width="8"
									height="10"
									rx="1"
									fill="none"
									stroke="currentColor"
									stroke-width="1.5"
								/>
								<rect
									x="4"
									y="4"
									width="8"
									height="10"
									rx="1"
									fill="none"
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
		animation: resultSlide 0.6s ease-out;
	}

	@keyframes resultSlide {
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
		left: -20px;
		opacity: 0.6;
		z-index: 0;
		animation: gentleFloat 8s ease-in-out infinite;
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

	.result-content {
		padding: 2.5rem;
		background: rgba(245, 241, 235, 0.9);
		backdrop-filter: blur(15px);
		border: 1px solid var(--earth-medium);
		box-shadow:
			0 12px 40px rgba(139, 111, 71, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
		position: relative;
		border-radius: 1.5rem;
		z-index: 1;
	}

	.result-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		flex-wrap: wrap;
		gap: 1.25rem;
		padding-bottom: 1.25rem;
		border-bottom: 1px solid var(--earth-medium);
	}

	.result-content h3 {
		margin: 0;
		font-family: 'Bebas Neue', sans-serif;
		font-size: 1.5rem;
		color: var(--text-primary);
		letter-spacing: 0.05em;
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.header-icon {
		color: var(--mocha-mousse);
		opacity: 0.8;
	}

	.result-actions {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	/* Tab selectors */
	.tab-selectors {
		display: flex;
		border: 1px solid var(--earth-medium);
		background: rgba(245, 241, 235, 0.8);
		backdrop-filter: blur(10px);
		box-shadow:
			0 2px 8px rgba(139, 111, 71, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.6);
		border-radius: 1rem;
		overflow: hidden;
	}

	.tab-selectors button {
		padding: 0.75rem 1.25rem;
		background: transparent;
		border: none;
		cursor: pointer;
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--text-primary);
		transition: all 0.3s ease;
		letter-spacing: 0.02em;
		font-family: 'Space Grotesk', 'Georgia', serif;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.tab-selectors button:not(:last-child) {
		border-right: 1px solid var(--earth-medium);
	}

	.tab-selectors button:hover:not(.active) {
		background: rgba(167, 132, 106, 0.1);
	}

	.tab-selectors button.active {
		background: linear-gradient(135deg, var(--mocha-mousse), var(--clay));
		color: var(--cream);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
	}

	/* Result text container */
	.result-text-container {
		background: linear-gradient(135deg, rgba(245, 241, 235, 0.6) 0%, rgba(230, 221, 212, 0.4) 100%);
		backdrop-filter: blur(5px);
		border: 1px solid var(--earth-medium);
		padding: 2rem;
		box-shadow:
			inset 0 2px 8px rgba(139, 111, 71, 0.05),
			0 2px 8px rgba(139, 111, 71, 0.1);
		min-height: 120px;
		max-height: 400px;
		overflow-y: auto;
		border-radius: 1.25rem;
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
		font-family: 'Monaco', 'Consolas', monospace;
		font-size: 0.9rem;
		line-height: 1.6;
		white-space: pre-wrap;
		background: rgba(245, 241, 235, 0.8);
		backdrop-filter: blur(5px);
		padding: 1.25rem;
		border: 1px dashed var(--earth-medium);
		overflow-x: auto;
		margin: 0;
		color: var(--text-primary);
		font-weight: 400;
		border-radius: 1rem;
		box-shadow:
			inset 0 1px 3px rgba(139, 111, 71, 0.05),
			0 1px 3px rgba(139, 111, 71, 0.1);
	}

	.copy-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.25rem;
		background: linear-gradient(135deg, var(--clay), var(--mocha-mousse));
		color: var(--cream);
		border: 1px solid var(--earth-dark);
		cursor: pointer;
		font-size: 0.9rem;
		font-weight: 500;
		transition: all 0.3s ease;
		box-shadow:
			0 4px 15px rgba(139, 111, 71, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.2);
		letter-spacing: 0.02em;
		font-family: 'Space Grotesk', 'Georgia', serif;
		border-radius: 1.25rem;
		backdrop-filter: blur(5px);
	}

	.copy-btn:hover {
		transform: translateY(-2px);
		box-shadow:
			0 6px 20px rgba(139, 111, 71, 0.3),
			inset 0 1px 0 rgba(255, 255, 255, 0.3);
		background: linear-gradient(135deg, var(--mocha-mousse), var(--clay));
	}

	.copy-btn.copied {
		background: linear-gradient(135deg, var(--sage), #7eb069);
		animation: copySuccess 0.4s ease-out;
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

	.copy-icon {
		filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
	}

	/* Custom scrollbar */
	.result-text-container::-webkit-scrollbar {
		width: 8px;
	}

	.result-text-container::-webkit-scrollbar-track {
		background: rgba(168, 160, 144, 0.2);
		border-radius: 4px;
		margin: 4px;
	}

	.result-text-container::-webkit-scrollbar-thumb {
		background: linear-gradient(180deg, var(--mocha-mousse), var(--clay));
		border-radius: 4px;
		border: 1px solid var(--earth-medium);
	}

	.result-text-container::-webkit-scrollbar-thumb:hover {
		background: linear-gradient(180deg, var(--clay), var(--mocha-mousse));
	}

	@media (max-width: 600px) {
		.result-content {
			padding: 1.75rem;
		}

		.result-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}

		.result-content h3 {
			font-size: 1.35rem;
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
			justify-content: center;
		}

		.copy-btn {
			width: 100%;
			justify-content: center;
		}

		.result-text-container {
			padding: 1.5rem;
		}

		.result-decoration {
			display: none;
		}
	}
</style>
