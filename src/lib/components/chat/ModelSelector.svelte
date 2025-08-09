<script lang="ts">
	import { AVAILABLE_MODELS, formatFileSize } from '$lib/wllama-config';
	import { inferenceParams } from '$lib/stores';

	interface Props {
		modelSelection: string;
		onLoadModel: () => void;
		isLoading?: boolean;
	}

	let { modelSelection = $bindable(), onLoadModel, isLoading = false }: Props = $props();
	let showParams = $state(false);
</script>

<div
	class="relative mx-auto box-border flex w-[calc(100%-4rem)] max-w-[500px] rotate-[0.5deg] animate-bounce-in flex-col gap-6 rounded-xl border-4 border-black bg-white p-8 shadow-neo-3xl"
>
	<div
		class="absolute -top-[15px] -left-[15px] z-[-1] h-[100px] w-[100px] animate-spin-slow rounded-[30%_70%_70%_30%/60%_40%_60%_40%] border-[3px] border-black bg-gradient-green opacity-30"
	></div>

	<h2
		class="font-bebas m-0 mx-auto flex w-fit -rotate-1 items-center justify-center gap-2 border-[3px] border-black bg-gradient-green px-6 py-3 text-center text-[2rem] font-bold tracking-[2px] text-black uppercase shadow-neo-lg"
	>
		<span class="animate-[bounce_2s_ease-in-out_infinite] text-[1.75rem]">🚀</span>
		Chat
	</h2>

	<div class="relative mt-4 -rotate-[0.5deg]">
		<label
			class="absolute -top-[10px] left-[12px] z-[1] flex items-center gap-1 rounded border-2 border-black bg-neo-green px-2 text-[0.8125rem] font-bold tracking-[0.5px] text-black uppercase"
			for="model-select"
		>
			<span class="text-[0.875rem]">📦</span>
			Choose Model
		</label>
		<select
			id="model-select"
			bind:value={modelSelection}
			class="font-space box-border w-full cursor-pointer appearance-none rounded-md border-[3px] border-black bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%2024%2024%27%20fill=%27none%27%20stroke=%27%23000%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%3e%3cpolyline%20points=%276%209%2012%2015%2018%209%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.25em] bg-[right_0.875rem_center] bg-no-repeat px-4 py-[0.875rem] pr-10 text-[0.9375rem] font-semibold shadow-neo-lg transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#fffacd] hover:shadow-neo-2xl focus:border-yellow-400 focus:bg-[#fffacd] focus:outline-none"
		>
			{#each AVAILABLE_MODELS as model (model.url)}
				<option value={model.url}>
					{model.longName ?? model.name} ({formatFileSize(model.size)})
				</option>
			{/each}
		</select>
	</div>

	<div
		class="box-border rotate-[0.2deg] rounded-lg border-[3px] border-black bg-gradient-subtle p-5 shadow-neo"
	>
		<button
			class="font-space flex w-full cursor-pointer items-center justify-between border-none bg-transparent py-3 text-base font-bold tracking-[0.5px] text-black uppercase transition-colors duration-200 hover:text-gray-600"
			onclick={() => (showParams = !showParams)}
		>
			<span
				class="mr-2 animate-[spin_3s_linear_infinite] text-xl hover:animate-[spin_1s_linear_infinite]"
				>⚙️</span
			>
			<span>Advanced Parameters</span>
			<svg
				class="flex-shrink-0 transition-transform duration-300 {showParams ? 'rotate-180' : ''}"
				viewBox="0 0 24 24"
				width="20"
				height="20"
				stroke="currentColor"
				stroke-width="2"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<polyline points="6 9 12 15 18 9"></polyline>
			</svg>
		</button>
		{#if showParams}
			<div class="mt-4 grid animate-[slideDown_0.3s_ease-out] gap-4">
				<label class="flex flex-col gap-1.5">
					<span class="text-[0.875rem] font-bold tracking-[0.5px] text-black uppercase">
						Threads <span class="text-xs font-normal tracking-normal text-gray-600 normal-case"
							>(-1 auto)</span
						>
					</span>
					<input
						type="number"
						bind:value={$inferenceParams.nThreads}
						min="-1"
						max="32"
						class="font-space box-border w-full rounded border-2 border-black bg-white px-3 py-2.5 text-[0.9375rem] font-semibold shadow-neo-sm transition-all duration-200 hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-neo focus:border-yellow-400 focus:bg-[#fffacd] focus:outline-none"
					/>
				</label>
				<label class="flex flex-col gap-1.5">
					<span class="text-[0.875rem] font-bold tracking-[0.5px] text-black uppercase"
						>Context Size</span
					>
					<input
						type="number"
						bind:value={$inferenceParams.nContext}
						min="512"
						max="8192"
						class="font-space box-border w-full rounded border-2 border-black bg-white px-3 py-2.5 text-[0.9375rem] font-semibold shadow-neo-sm transition-all duration-200 hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-neo focus:border-yellow-400 focus:bg-[#fffacd] focus:outline-none"
					/>
				</label>
				<label class="flex flex-col gap-1.5">
					<span class="text-[0.875rem] font-bold tracking-[0.5px] text-black uppercase"
						>Temperature</span
					>
					<input
						type="number"
						bind:value={$inferenceParams.temperature}
						min="0"
						max="2"
						step="0.1"
						class="font-space box-border w-full rounded border-2 border-black bg-white px-3 py-2.5 text-[0.9375rem] font-semibold shadow-neo-sm transition-all duration-200 hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-neo focus:border-yellow-400 focus:bg-[#fffacd] focus:outline-none"
					/>
				</label>
			</div>
		{/if}
	</div>

	<button
		onclick={onLoadModel}
		class="font-space mx-auto flex -rotate-1 cursor-pointer items-center justify-center gap-2 rounded-lg border-[3px] border-black bg-neo-green px-6 py-4 text-[1.125rem] font-bold tracking-[0.5px] uppercase shadow-neo-xl transition-all duration-200 hover:enabled:-translate-x-[3px] hover:enabled:-translate-y-[3px] hover:enabled:rotate-0 hover:enabled:bg-neo-yellow hover:enabled:shadow-neo-3xl disabled:animate-pulse"
		disabled={isLoading}
	>
		{#if isLoading}
			<span class="animate-spin-fast text-[1.5rem]">⏳</span>
			Loading Model...
		{:else}
			<span class="text-[1.5rem]">⚡</span>
			Load Model
		{/if}
	</button>
</div>
