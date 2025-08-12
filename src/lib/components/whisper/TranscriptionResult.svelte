<script lang="ts">
	import subsrt from 'subsrt-ts';
	import FileTextIcon from 'virtual:icons/lucide/file-text';
	import CheckCircleIcon from 'virtual:icons/lucide/check-circle';
	import ClipboardIcon from 'virtual:icons/lucide/clipboard';

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
					<span class="header-icon"><FileTextIcon /></span>
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
							<span class="copy-icon"><CheckCircleIcon /></span>
							Copied!
						{:else}
							<span class="copy-icon"><ClipboardIcon /></span>
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
		animation: resultSlide 0.5s ease-out;
	}

	@keyframes resultSlide {
		from {
			transform: translateY(20px) rotate(-1deg);
			opacity: 0;
		}
		to {
			transform: translateY(0) rotate(0.5deg);
			opacity: 1;
		}
	}

	.result {
		position: relative;
		width: 100%;
		max-width: 100%;
		transform: rotate(0.5deg);
	}

	.result-decoration {
		position: absolute;
		top: -10px;
		left: -10px;
		right: -10px;
		bottom: -10px;
		background: linear-gradient(135deg, var(--color-success) 0%, var(--color-accent-blue) 100%);
		z-index: -1;
		opacity: 0.3;
		border-radius: 30% 70% 70% 30% / 60% 40% 60% 40%;
		transform: rotate(-1deg);
	}

	.result-content {
		padding: 2rem;
		background: var(--color-background-main);
		border: var(--border-brutalist-extra-thick);
		box-shadow: var(--shadow-brutalist-xlarge);
		position: relative;
	}

	.result-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
		flex-wrap: wrap;
		gap: 1rem;
		padding-bottom: 1rem;
		border-bottom: var(--border-brutalist-thick);
	}

	.result-content h3 {
		margin: 0;
		font-family: var(--font-family-display);
		font-size: 1.75rem;
		color: var(--color-text-primary);
		letter-spacing: 2px;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: var(--color-success);
		padding: 0.5rem 1rem;
		border: var(--border-brutalist-thick);
		box-shadow: var(--shadow-brutalist-medium);
		transform: rotate(-1deg);
		text-transform: uppercase;
	}

	.header-icon {
		font-size: 1.5rem;
		display: flex;
		align-items: center;
		color: var(--color-text-primary);
	}

	.header-icon :global(svg) {
		width: 1.5rem;
		height: 1.5rem;
	}

	.result-actions {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	/* Tab selectors */
	.tab-selectors {
		display: flex;
		border: var(--border-brutalist-thick);
		background: var(--color-background-main);
		box-shadow: var(--shadow-brutalist-medium);
	}

	.tab-selectors button {
		padding: 0.625rem 1rem;
		background: var(--color-background-main);
		border: none;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 700;
		color: var(--color-text-primary);
		transition: all 0.15s ease;
		text-transform: uppercase;
		letter-spacing: 1px;
		font-family: var(--font-family-primary);
	}

	.tab-selectors button:not(:last-child) {
		border-right: var(--border-brutalist-thick);
	}

	.tab-selectors button:hover:not(.active) {
		background: var(--color-background-cream);
	}

	.tab-selectors button.active {
		background: var(--color-primary-dark);
	}

	/* Result text container */
	.result-text-container {
		background: linear-gradient(
			135deg,
			rgba(255, 217, 61, 0.05) 0%,
			rgba(152, 251, 152, 0.05) 100%
		);
		border: var(--border-brutalist-thick);
		padding: 1.5rem;
		box-shadow: inset 3px 3px 0 rgba(0, 0, 0, 0.1);
		min-height: 100px;
		max-height: 400px;
		overflow-y: auto;
	}

	.result-text {
		margin: 0;
		font-size: 1.0625rem;
		line-height: 1.6;
		color: var(--color-text-primary);
		font-weight: 500;
		white-space: pre-wrap;
		word-break: break-word;
	}

	/* SRT Preview */
	.srt-preview {
		font-family: monospace;
		font-size: 0.9375rem;
		line-height: 1.5;
		white-space: pre-wrap;
		background: var(--color-background-main);
		padding: 1rem;
		border: 2px dashed var(--color-text-primary);
		overflow-x: auto;
		margin: 0;
		color: var(--color-text-primary);
		font-weight: 600;
	}

	.copy-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.625rem 1.25rem;
		background: var(--color-accent-pink);
		color: var(--color-text-primary);
		border: var(--border-brutalist-thick);
		cursor: pointer;
		font-size: 1rem;
		font-weight: 700;
		transition: all 0.15s ease;
		box-shadow: var(--shadow-brutalist-medium);
		text-transform: uppercase;
		letter-spacing: 1px;
		font-family: var(--font-family-primary);
	}

	.copy-btn:hover {
		transform: translate(-2px, -2px);
		box-shadow: var(--shadow-brutalist-large);
		background: var(--color-primary-dark);
	}

	.copy-btn.copied {
		background: var(--color-success);
		animation: copySuccess 0.3s ease-out;
	}

	@keyframes copySuccess {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.1);
		}
		100% {
			transform: scale(1);
		}
	}

	.copy-icon {
		font-size: 1.25rem;
		display: flex;
		align-items: center;
		color: var(--color-text-primary);
	}

	.copy-icon :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}

	/* Custom scrollbar */
	.result-text-container::-webkit-scrollbar {
		width: 12px;
	}

	.result-text-container::-webkit-scrollbar-track {
		background: var(--color-background-main);
		border-left: var(--border-brutalist-thick);
	}

	.result-text-container::-webkit-scrollbar-thumb {
		background: var(--color-primary-dark);
		border: var(--border-brutalist-thin);
	}

	.result-text-container::-webkit-scrollbar-thumb:hover {
		background: var(--color-accent-pink);
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
