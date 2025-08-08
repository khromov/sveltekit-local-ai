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

<div bind:this={chatContainer} class="chat-messages content-area" id="chat-container">
	{#each messages as message, i}
		<Message
			{message}
			{isGenerating}
			isLast={i === messages.length - 1}
		/>
	{/each}
</div>

<style>
	.chat-messages {
		height: clamp(350px, calc(100vh - 250px), 600px);
		overflow-y: auto;
		max-height: calc(100vh - 250px);
		position: relative;
		background: #FFF;
		padding-top: 1rem;
	}

	/* Custom scrollbar styling */
	.chat-messages::-webkit-scrollbar {
		width: 10px;
	}

	.chat-messages::-webkit-scrollbar-track {
		background: #F0F0F0;
		border-radius: 5px;
	}

	.chat-messages::-webkit-scrollbar-thumb {
		background: #000;
		border-radius: 5px;
		border: 2px solid #F0F0F0;
	}

	.chat-messages::-webkit-scrollbar-thumb:hover {
		background: #333;
	}

	@media (max-width: 600px) {
		.chat-messages {
			height: clamp(250px, calc(100vh - 220px), 400px);
			max-height: calc(100vh - 220px);
		}
	}
</style>
