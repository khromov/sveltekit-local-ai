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

<div
	class="relative my-6 flex -rotate-1 animate-wobble-in flex-col items-center border-4 border-black bg-white p-10 shadow-neo-4xl"
>
	<div
		class="absolute -top-[10px] -left-[10px] h-[100px] w-[100px] animate-spin-slow rounded-full border-[3px] border-black bg-repeating-diagonal opacity-30"
	></div>

	<h3
		class="font-bebas mt-0 mb-4 flex -rotate-2 items-center gap-3 border-[3px] border-black bg-neo-yellow px-8 py-2 text-[2.5rem] tracking-[3px] text-black uppercase shadow-neo-xl"
	>
		<span class="animate-[bounce_2s_ease-in-out_infinite] text-[2rem]">🎧</span>
		Transcribing Audio
	</h3>

	<p
		class="mb-6 rotate-1 animate-pulse border-[3px] border-black bg-neo-green px-6 py-2 text-2xl font-bold text-black uppercase shadow-neo-lg"
	>
		{progress}% Complete
	</p>

	<div class="mb-6 w-full max-w-[400px]">
		<ProgressBar {progress} {previousProgress} />
	</div>

	{#if currentSegment}
		<div
			class="relative my-6 w-full max-w-[500px] rotate-[0.5deg] animate-slide-in border-[3px] border-black bg-white p-6 shadow-neo-xl"
		>
			<div
				class="absolute -top-2 -right-2 h-[50px] w-[50px] -rotate-45 rounded-[30%_70%_70%_30%/60%_40%_60%_40%] border-2 border-black bg-neo-pink opacity-40"
			></div>
			<h4
				class="m-0 mb-3 inline-block border-2 border-black bg-neo-yellow px-3 py-1 text-center text-base font-bold tracking-[2px] text-black uppercase shadow-neo"
			>
				Current Segment
			</h4>
			<p
				class="m-0 border-2 border-dashed border-black bg-gradient-subtle-3 p-3 text-[1.0625rem] leading-relaxed font-medium text-black italic"
			>
				"{currentSegment}"
			</p>
		</div>
	{/if}

	{#if isStuck}
		<div
			class="mt-4 flex -rotate-1 animate-shake flex-col items-center gap-3 border-[3px] border-black bg-neo-red px-6 py-4 text-center font-bold text-black uppercase shadow-neo-lg"
		>
			<span class="text-[2rem]">⚠️</span>
			Transcription seems stuck
			<button
				class="font-space cursor-pointer border-[3px] border-black bg-neo-yellow px-4 py-2 text-base font-bold tracking-wider text-black uppercase shadow-neo-md transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-neo-green hover:shadow-neo-xl"
				onclick={onReload}
			>
				Reload Page →
			</button>
		</div>
	{:else}
		<div
			class="mt-4 flex -rotate-[0.5deg] items-center gap-3 border-[3px] border-black bg-neo-yellow px-6 py-4 text-center font-bold tracking-wider text-black uppercase shadow-neo-lg"
		>
			<span class="animate-flash text-2xl">⚡</span>
			Keep this tab active during transcription
		</div>
	{/if}
</div>
