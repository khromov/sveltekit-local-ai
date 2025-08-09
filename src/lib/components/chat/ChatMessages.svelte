<script lang="ts">
	import { onMount, tick } from 'svelte';
	import type { Message as MessageType } from '$lib/wllama-config';
	import Message from './Message.svelte';

	interface Props {
		messages: MessageType[];
		isGenerating?: boolean;
	}

	let { messages = [], isGenerating = false }: Props = $props();

	let chatContainer: HTMLElement | undefined = $state();

	// Scroll to the bottom of the chat
	export async function scrollToBottom() {
		await tick();
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	}

	// Auto-scroll when messages change
	$effect(() => {
		if (messages.length > 0) {
			scrollToBottom();
		}
	});

	onMount(() => {
		scrollToBottom();
	});
</script>

<div
	bind:this={chatContainer}
	class="bg-gradient-subtle-2 [&::-webkit-scrollbar-track]:from-neo-yellow [&::-webkit-scrollbar-track]:via-neo-green [&::-webkit-scrollbar-track]:to-neo-pink relative box-border min-h-0 w-full flex-1 overflow-auto border-r-[3px] border-l-[3px] border-black pt-12 [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-thumb]:rounded-md [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-white [&::-webkit-scrollbar-thumb]:bg-black [&::-webkit-scrollbar-thumb]:shadow-[inset_0_0_3px_rgba(0,0,0,0.3)] [&::-webkit-scrollbar-thumb:hover]:bg-gray-800 [&::-webkit-scrollbar-track]:rounded-md [&::-webkit-scrollbar-track]:border-2 [&::-webkit-scrollbar-track]:border-black [&::-webkit-scrollbar-track]:bg-gradient-to-b"
	id="chat-container"
>
	<div class="bg-repeating-stripes absolute top-0 right-0 left-0 z-[1] h-[3px]"></div>

	{#if messages.length === 0 || (messages.length === 1 && messages[0].role === 'system')}
		<div
			class="relative flex h-full min-h-[300px] animate-[fadeIn_0.5s_ease-out] flex-col items-center justify-center p-8 text-center"
		>
			<div class="animate-float mb-4 text-[4rem]">💬</div>
			<h3
				class="bg-neo-yellow shadow-neo-md m-0 mb-2 inline-block -rotate-1 border-[3px] border-black px-6 py-2 text-[1.75rem] font-bold tracking-wider text-black uppercase"
			>
				Start a Conversation
			</h3>
			<p class="mt-2 mb-0 text-[1.125rem] font-medium text-gray-600">
				Type a message below to begin chatting with AI
			</p>
			<div class="animate-sparkle absolute top-[20%] left-[15%] text-[1.5rem] [animation-delay:0s]">
				✨
			</div>
			<div
				class="animate-sparkle absolute top-[30%] right-[20%] text-[1.5rem] [animation-delay:1s]"
			>
				⭐
			</div>
			<div
				class="animate-sparkle absolute bottom-[25%] left-[25%] text-[1.5rem] [animation-delay:2s]"
			>
				🌟
			</div>
		</div>
	{:else}
		{#each messages as message, i (i)}
			<Message {message} {isGenerating} isLast={i === messages.length - 1} />
		{/each}
	{/if}
</div>
