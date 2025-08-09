<script lang="ts">
	import type { Message } from '$lib/wllama-config';

	interface Props {
		message: Message;
		isGenerating?: boolean;
		isLast?: boolean;
	}

	let { message, isGenerating = false, isLast = false }: Props = $props();
</script>

{#if message.role !== 'system'}
	<div
		class="animate-message-slide relative mb-4 box-border flex w-full px-2 {message.role === 'user'
			? 'justify-end'
			: 'justify-start'}"
	>
		{#if message.role === 'user'}
			<div
				class="bg-neo-yellow animate-float-deco absolute top-1/2 -right-[5px] z-[-1] h-[30px] w-[30px] -translate-y-1/2 rotate-45 rounded-[30%_70%_70%_30%/60%_40%_60%_40%] border-2 border-black opacity-30"
			></div>
		{:else}
			<div
				class="bg-neo-green animate-float-deco absolute top-1/2 -left-[5px] z-[-1] h-[30px] w-[30px] -translate-y-1/2 -rotate-45 rounded-[70%_30%_30%_70%/40%_60%_40%_60%] border-2 border-black opacity-30"
			></div>
		{/if}

		<div class="relative max-w-[70%] min-w-0 overflow-visible break-words">
			<div
				class={message.role === 'user'
					? 'bg-gradient-yellow shadow-neo-lg hover:shadow-neo-xl before:bg-neo-green before:shadow-neo-sm relative rotate-0 overflow-visible rounded-2xl rounded-br-[4px] border-[3px] border-black px-[1.125rem] py-[0.875rem] text-base leading-relaxed font-medium break-words whitespace-pre-wrap text-black transition-all duration-200 before:absolute before:-top-[22px] before:right-0 before:rounded before:border-2 before:border-black before:px-2 before:py-[2px] before:text-xs before:font-bold before:tracking-[0.5px] before:text-black before:uppercase before:content-["You"] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:rotate-0'
					: 'bg-gradient-gray shadow-neo-lg hover:shadow-neo-xl before:bg-neo-pink before:shadow-neo-sm relative rotate-0 overflow-visible rounded-2xl rounded-bl-[4px] border-[3px] border-black px-[1.125rem] py-[0.875rem] text-base leading-relaxed font-medium break-words whitespace-pre-wrap text-black transition-all duration-200 before:absolute before:-top-[22px] before:left-0 before:rounded before:border-2 before:border-black before:px-2 before:py-[2px] before:text-xs before:font-bold before:tracking-[0.5px] before:text-black before:uppercase before:content-["AI"] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:rotate-0'}
			>
				{#if message.role === 'assistant' && isGenerating && isLast}
					{#if message.content === ''}
						<div
							class="inline-flex items-center gap-1.5 py-1"
						>
							<span class="animate-pulse-emoji text-xl">💭</span>
							<span class="animate-bounce-dot inline-block h-2 w-2 rounded-full bg-black"></span>
							<span
								class="animate-bounce-dot inline-block h-2 w-2 rounded-full bg-black [animation-delay:-0.32s]"
							></span>
							<span
								class="animate-bounce-dot inline-block h-2 w-2 rounded-full bg-black [animation-delay:-0.16s]"
							></span>
						</div>
					{:else}
						{message.content}
						<span class="ml-0.5 inline-block animate-pulse font-normal text-black">▊</span>
					{/if}
				{:else}
					{message.content}
				{/if}
			</div>
		</div>
	</div>
{/if}
