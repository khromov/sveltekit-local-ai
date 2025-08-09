<script lang="ts">
	interface Props {
		message: string;
		buttonText?: string;
		onRetry?: () => void;
		isRetrying?: boolean;
	}

	let { message, buttonText = 'Retry', onRetry, isRetrying = false }: Props = $props();
</script>

<div
	class="mx-auto box-border w-[calc(100%-4rem)] max-w-[500px] rounded-xl border-[3px] border-black bg-neo-coral p-6 text-center text-black shadow-neo-lg"
>
	<h3 class="mb-3 text-2xl font-bold tracking-wider text-black uppercase">Error</h3>
	<p class="mb-5 text-base leading-relaxed font-medium break-words text-black">{message}</p>
	{#if onRetry}
		<button
			onclick={onRetry}
			disabled={isRetrying}
			class="font-space cursor-pointer rounded-lg border-none bg-black px-6 py-3 text-base font-semibold tracking-wider text-white uppercase transition-all duration-200 hover:enabled:-translate-y-0.5 hover:enabled:shadow-lg disabled:cursor-not-allowed disabled:bg-gray-600 disabled:opacity-70"
		>
			{isRetrying ? 'Retrying...' : buttonText}
		</button>
	{/if}
</div>
