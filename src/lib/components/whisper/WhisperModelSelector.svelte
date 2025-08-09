<script lang="ts">
	import LoadingProgress from '../LoadingProgress.svelte';
	import ErrorDisplay from '../ErrorDisplay.svelte';
	import { isOPFSSupported } from '$lib/download-utils';

	interface Props {
		selectedModel: string;
		availableModels: Array<{ path: string; name: string }>;
		isLoading?: boolean;
		isReady?: boolean;
		error?: boolean;
		downloadProgress?: number;
		previousDownloadProgress?: number;
		usingCachedModel?: boolean;
		hasProgressTracking?: boolean;
		onLoadModel: () => void;
		onChangeModel: () => void;
		onRetry: () => void;
	}

	let {
		selectedModel = $bindable(),
		availableModels,
		isLoading = false,
		isReady = false,
		error = false,
		downloadProgress = 0,
		previousDownloadProgress = 0,
		usingCachedModel = false,
		hasProgressTracking = true,
		onLoadModel,
		onChangeModel,
		onRetry
	}: Props = $props();

	let opfsSupported = isOPFSSupported();
</script>

<div class="shadow-neo-lg mb-6 rounded-xl border-[3px] border-black bg-white p-6">
	<h3 class="mt-0 mb-4 text-center text-xl font-bold tracking-[0.5px] text-black uppercase">
		Select Model
	</h3>

	<div class="flex flex-col items-center gap-4">
		<select
			bind:value={selectedModel}
			disabled={isLoading}
			class="shadow-neo font-space hover:enabled:shadow-neo-md w-full max-w-[400px] cursor-pointer appearance-none rounded-md border-2 border-black bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%2024%2024%27%20fill=%27none%27%20stroke=%27%23000%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%3e%3cpolyline%20points=%276%209%2012%2015%2018%209%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.25em] bg-[right_0.75rem_center] bg-no-repeat px-3 py-3 pr-10 text-center text-[0.9375rem] font-medium transition-all duration-200 focus:border-yellow-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
		>
			{#each availableModels as model (model.path)}
				<option value={model.path}>{model.name}</option>
			{/each}
		</select>

		{#if !isReady}
			<button
				onclick={onLoadModel}
				disabled={isLoading}
				class="bg-neo-yellow shadow-neo-md font-space hover:enabled:shadow-neo-xl active:enabled:shadow-neo-sm min-w-[180px] cursor-pointer rounded-lg border-[3px] border-black px-7 py-3.5 text-base font-bold tracking-[0.5px] text-black uppercase transition-all duration-200 hover:enabled:-translate-x-0.5 hover:enabled:-translate-y-0.5 active:enabled:translate-x-0 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
			>
				{isLoading ? 'Loading Model...' : 'Load Model'}
			</button>
		{:else}
			<div class="flex flex-col items-center gap-3">
				<div
					class="flex items-center gap-2 rounded-md border-2 border-black bg-[#b4e7ce] px-4 py-2 text-base font-semibold text-black uppercase"
				>
					<span class="text-xl text-black">✓</span>
					<span>Model Ready</span>
				</div>
				{#if selectedModel !== availableModels[0].path}
					<button
						onclick={onChangeModel}
						disabled={isLoading}
						class="font-space hover:shadow-neo-sm cursor-pointer rounded-md border-2 border-black bg-gray-100 px-4 py-2 text-[0.875rem] font-semibold tracking-[0.5px] text-black uppercase transition-all duration-200 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{isLoading ? 'Changing...' : 'Change Model'}
					</button>
				{/if}
			</div>
		{/if}
	</div>

	{#if error}
		<ErrorDisplay
			message="Failed to load transcription model. Please try again."
			buttonText="Retry"
			{onRetry}
			isRetrying={isLoading}
		/>
	{:else if isLoading}
		<LoadingProgress
			title={usingCachedModel
				? 'Loading Cached Model'
				: opfsSupported
					? 'Downloading Model'
					: 'Loading Model'}
			progress={downloadProgress}
			previousProgress={previousDownloadProgress}
			percentageText={hasProgressTracking ? `${downloadProgress}% Complete` : 'Loading...'}
			showPercentage={true}
			message={usingCachedModel
				? 'Loading model from local cache...'
				: opfsSupported
					? 'The transcription model is being downloaded to your browser.'
					: 'Loading model... Progress tracking not available in this browser.'}
		/>
	{/if}
</div>
