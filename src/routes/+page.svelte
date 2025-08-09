<script lang="ts">
	// No props needed for this component
</script>

<div class="relative z-[2] box-border flex min-h-screen items-start justify-center p-4 pb-8">
	<div class="mx-auto w-full max-w-[1000px]">
		<header class="mb-8 animate-[fadeIn_0.6s_ease-out] text-center">
			<h1 class="m-0 mb-6 text-[3.5rem] leading-tight font-extrabold">
				<span
					class="inline-block border-[3px] border-black bg-black px-8 py-2 tracking-[2px] text-neo-yellow-light uppercase shadow-neo-lg"
				>
					Local AI Playground
				</span>
			</h1>
			<p
				class="m-0 inline-block border-2 border-black bg-white px-6 py-2 text-xl font-medium text-black shadow-neo"
			>
				On this page you'll find free, private AI tools that run entirely in your browser - and even
				offline!
			</p>
		</header>

		<div class="mb-12 grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-8 px-4">
			<a
				href="/chat"
				class="relative block animate-card-fade overflow-hidden rounded-xl border-[3px] border-black bg-white p-0 text-black no-underline shadow-neo-lg transition-all duration-200 ease-in-out [animation-delay:0.2s] [animation-fill-mode:both] hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-neo-3xl"
			>
				<div
					class="absolute top-4 right-4 rounded bg-black px-3 py-1 text-[0.875rem] font-bold tracking-wider text-neo-yellow-light uppercase"
				>
					Tool #01
				</div>
				<div class="p-8">
					<div class="mb-6 w-fit rounded-lg border-2 border-black bg-neo-peach p-3">
						<svg
							class="block text-black"
							viewBox="0 0 24 24"
							width="48"
							height="48"
							stroke="currentColor"
							stroke-width="2.5"
							fill="none"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
						</svg>
					</div>
					<h2 class="m-0 mb-4 text-[1.75rem] font-bold text-black">Chat</h2>
					<p class="m-0 mb-6 text-base leading-relaxed text-gray-800">
						Chat with Large Language Models like Gemma3, completely on-device thanks to llama.cpp
					</p>
					<div class="flex flex-wrap gap-2">
						<span
							class="rounded border-2 border-black bg-gray-100 px-3 py-1.5 text-[0.875rem] font-semibold text-black transition-all duration-200 ease-in-out hover:bg-neo-peach"
						>
							Private & Secure
						</span>
						<span
							class="rounded border-2 border-black bg-gray-100 px-3 py-1.5 text-[0.875rem] font-semibold text-black transition-all duration-200 ease-in-out hover:bg-neo-peach"
						>
							Works Offline
						</span>
						<span
							class="rounded border-2 border-black bg-gray-100 px-3 py-1.5 text-[0.875rem] font-semibold text-black transition-all duration-200 ease-in-out hover:bg-neo-peach"
						>
							No Data Sharing
						</span>
					</div>
				</div>
			</a>

			<a
				href="/transcribe"
				class="relative block animate-card-fade overflow-hidden rounded-xl border-[3px] border-black bg-white p-0 text-black no-underline shadow-neo-lg transition-all duration-200 ease-in-out [animation-delay:0.3s] [animation-fill-mode:both] hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-neo-3xl"
			>
				<div
					class="absolute top-4 right-4 rounded bg-black px-3 py-1 text-[0.875rem] font-bold tracking-wider text-neo-yellow-light uppercase"
				>
					Tool #02
				</div>
				<div class="p-8">
					<div class="mb-6 w-fit rounded-lg border-2 border-black bg-neo-peach p-3">
						<svg
							class="block text-black"
							viewBox="0 0 24 24"
							width="48"
							height="48"
							stroke="currentColor"
							stroke-width="2.5"
							fill="none"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
							<path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
							<line x1="12" y1="19" x2="12" y2="23"></line>
							<line x1="8" y1="23" x2="16" y2="23"></line>
						</svg>
					</div>
					<h2 class="m-0 mb-4 text-[1.75rem] font-bold text-black">Transcribe Audio</h2>
					<p class="m-0 mb-6 text-base leading-relaxed text-gray-800">
						Convert speech to text using Whisper AI. Upload any existing audio file and export as
						text or a subtitle file.
					</p>
					<div class="flex flex-wrap gap-2">
						<span
							class="rounded border-2 border-black bg-gray-100 px-3 py-1.5 text-[0.875rem] font-semibold text-black transition-all duration-200 ease-in-out hover:bg-neo-mint"
						>
							High Accuracy
						</span>
						<span
							class="rounded border-2 border-black bg-gray-100 px-3 py-1.5 text-[0.875rem] font-semibold text-black transition-all duration-200 ease-in-out hover:bg-neo-mint"
						>
							Multiple Formats
						</span>
						<span
							class="rounded border-2 border-black bg-gray-100 px-3 py-1.5 text-[0.875rem] font-semibold text-black transition-all duration-200 ease-in-out hover:bg-neo-mint"
						>
							Local Processing
						</span>
					</div>
				</div>
			</a>
		</div>

		<footer
			class="mt-12 animate-[fadeIn_0.6s_ease-out] text-center text-[0.9375rem] text-gray-600 [animation-delay:0.5s] [animation-fill-mode:both]"
		>
			<p class="my-2">All processing happens locally in your browser using WebAssembly.</p>
			<p class="my-2">No data is sent to external servers.</p>
		</footer>
	</div>
</div>
