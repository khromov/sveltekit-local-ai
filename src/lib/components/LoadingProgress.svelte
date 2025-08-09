<script lang="ts">
	import ProgressBar from './ProgressBar.svelte';

	interface Props {
		title: string;
		progress: number;
		previousProgress?: number;
		message?: string;
		percentageText?: string;
		showPercentage?: boolean;
	}

	let {
		title,
		progress = 0,
		previousProgress = 0,
		message,
		percentageText,
		showPercentage = true
	}: Props = $props();

	let displayPercentage = $derived(percentageText || `${progress}% Complete`);
</script>

<div
	class="shadow-neo-lg mx-auto box-border flex w-[calc(100%-4rem)] max-w-[500px] flex-col items-center gap-5 rounded-xl border-[3px] border-black bg-white p-8 text-center"
>
	<h3 class="m-0 text-[1.75rem] font-bold tracking-wider text-black uppercase">{title}</h3>
	{#if showPercentage}
		<p
			class="m-0 rounded-md border-2 border-black bg-[#ffe5b4] px-4 py-1.5 text-xl font-semibold text-black uppercase"
		>
			{displayPercentage}
		</p>
	{/if}
	<ProgressBar {progress} {previousProgress} />
	{#if message}
		<p class="m-0 max-w-full px-4 text-[0.9375rem] font-medium break-words text-gray-600">
			{message}
		</p>
	{/if}
</div>
