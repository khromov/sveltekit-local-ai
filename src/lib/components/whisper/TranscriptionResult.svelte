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

<div class="my-6 flex w-full animate-result-slide">
	<div class="relative w-full max-w-full rotate-[0.5deg]">
		<div
			class="absolute -top-[10px] -right-[10px] -bottom-[10px] -left-[10px] z-[-1] -rotate-1 rounded-[30%_70%_70%_30%/60%_40%_60%_40%] bg-gradient-to-br from-neo-green to-[#87ceeb] opacity-30"
		></div>

		<div class="relative border-4 border-black bg-white p-8 shadow-neo-3xl">
			<div
				class="mb-6 flex flex-wrap items-center justify-between gap-4 border-b-[3px] border-black pb-4"
			>
				<h3
					class="font-bebas m-0 flex -rotate-1 items-center gap-2 border-[3px] border-black bg-neo-green px-4 py-2 text-[1.75rem] tracking-[2px] text-black uppercase shadow-neo-md"
				>
					<span class="text-2xl">📝</span>
					Transcription Result
				</h3>

				<div class="flex items-center gap-4">
					{#if transcriptionData?.transcription?.length}
						<div class="flex border-[3px] border-black bg-white shadow-neo-md">
							<button
								class="font-space cursor-pointer border-r-[3px] border-none border-black bg-white px-4 py-2.5 text-base font-bold tracking-wider text-black uppercase transition-all duration-150 ease-in-out hover:bg-[#fffacd] {activeTab ===
								'text'
									? 'bg-neo-yellow'
									: ''}"
								class:active={activeTab === 'text'}
								onclick={() => (activeTab = 'text')}
							>
								Text
							</button>
							<button
								class="font-space cursor-pointer border-none bg-white px-4 py-2.5 text-base font-bold tracking-wider text-black uppercase transition-all duration-150 ease-in-out hover:bg-[#fffacd] {activeTab ===
								'srt'
									? 'bg-neo-yellow'
									: ''}"
								class:active={activeTab === 'srt'}
								onclick={() => (activeTab = 'srt')}
							>
								SRT
							</button>
						</div>
					{/if}

					<button
						class="font-space flex cursor-pointer items-center gap-2 border-[3px] border-black bg-neo-pink px-5 py-2.5 text-base font-bold tracking-wider text-black uppercase shadow-neo-md transition-all duration-150 ease-in-out hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-neo-yellow hover:shadow-neo-xl {hasCopied
							? 'animate-copy-success bg-neo-green'
							: ''}"
						onclick={copyToClipboard}
					>
						{#if hasCopied}
							<span class="text-xl">✅</span>
							Copied!
						{:else}
							<span class="text-xl">📋</span>
							Copy
						{/if}
					</button>
				</div>
			</div>

			<div
				class="max-h-[400px] min-h-[100px] overflow-y-auto border-[3px] border-black bg-gradient-subtle-3 p-6 shadow-neo-inset [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-black [&::-webkit-scrollbar-thumb]:bg-neo-yellow [&::-webkit-scrollbar-thumb:hover]:bg-neo-pink [&::-webkit-scrollbar-track]:border-l-[3px] [&::-webkit-scrollbar-track]:border-black [&::-webkit-scrollbar-track]:bg-white"
			>
				{#if !transcriptionData?.transcription?.length || activeTab === 'text'}
					<p
						class="m-0 text-[1.0625rem] leading-[1.6] font-medium break-words whitespace-pre-wrap text-black"
					>
						{text}
					</p>
				{:else if activeTab === 'srt' && transcriptionData?.transcription?.length}
					<pre
						class="m-0 overflow-x-auto border-2 border-dashed border-black bg-white p-4 font-mono text-[0.9375rem] leading-relaxed font-semibold whitespace-pre-wrap text-black">
{convertToSRT()}</pre>
				{/if}
			</div>
		</div>
	</div>
</div>
