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
	class="shadow-neo-4xl animate-wobble-in relative my-6 flex -rotate-1 flex-col items-center border-4 border-black bg-white p-10"
>
	<div
		class="bg-repeating-diagonal animate-spin-slow absolute -top-[10px] -left-[10px] h-[100px] w-[100px] rounded-full border-[3px] border-black opacity-30"
	></div>

	<h3
		class="font-bebas bg-neo-yellow shadow-neo-xl mt-0 mb-4 flex -rotate-2 items-center gap-3 border-[3px] border-black px-8 py-2 text-[2.5rem] tracking-[3px] text-black uppercase"
	>
		<span class="animate-[bounce_2s_ease-in-out_infinite] text-[2rem]">🎧</span>
		Transcribing Audio
	</h3>

	<p
		class="bg-neo-green shadow-neo-lg mb-6 rotate-1 animate-pulse border-[3px] border-black px-6 py-2 text-2xl font-bold text-black uppercase"
	>
		{progress}% Complete
	</p>

	<div class="mb-6 w-full max-w-[400px]">
		<ProgressBar {progress} {previousProgress} />
	</div>

	{#if currentSegment}
		<div
			class="shadow-neo-xl animate-slide-in relative my-6 w-full max-w-[500px] rotate-[0.5deg] border-[3px] border-black bg-white p-6"
		>
			<div
				class="bg-neo-pink absolute -top-2 -right-2 h-[50px] w-[50px] -rotate-45 rounded-[30%_70%_70%_30%/60%_40%_60%_40%] border-2 border-black opacity-40"
			></div>
			<h4
				class="bg-neo-yellow shadow-neo m-0 mb-3 inline-block border-2 border-black px-3 py-1 text-center text-base font-bold tracking-[2px] text-black uppercase"
			>
				Current Segment
			</h4>
			<p
				class="bg-gradient-subtle-3 m-0 border-2 border-dashed border-black p-3 text-[1.0625rem] leading-relaxed font-medium text-black italic"
			>
				"{currentSegment}"
			</p>
		</div>
	{/if}

	{#if isStuck}
		<div
			class="bg-neo-red shadow-neo-lg animate-shake mt-4 flex -rotate-1 flex-col items-center gap-3 border-[3px] border-black px-6 py-4 text-center font-bold text-black uppercase"
		>
			<span class="text-[2rem]">⚠️</span>
			Transcription seems stuck
			<button
				class="bg-neo-yellow shadow-neo-md font-space hover:shadow-neo-xl hover:bg-neo-green cursor-pointer border-[3px] border-black px-4 py-2 text-base font-bold tracking-wider text-black uppercase transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5"
				onclick={onReload}
			>
				Reload Page →
			</button>
		</div>
	{:else}
		<div
			class="bg-neo-yellow shadow-neo-lg mt-4 flex -rotate-[0.5deg] items-center gap-3 border-[3px] border-black px-6 py-4 text-center font-bold tracking-wider text-black uppercase"
		>
			<span class="animate-flash text-2xl">⚡</span>
			Keep this tab active during transcription
		</div>
	{/if}
</div>
