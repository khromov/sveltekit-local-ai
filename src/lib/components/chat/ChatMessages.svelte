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
	<div class="chat-grid-overlay"></div>
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
		background-image: 
			radial-gradient(circle at 20% 80%, rgba(255, 217, 61, 0.05) 0%, transparent 50%),
			radial-gradient(circle at 80% 20%, rgba(255, 105, 180, 0.05) 0%, transparent 50%);
	}

	.chat-grid-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-image: 
			repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(0,0,0,0.03) 39px, rgba(0,0,0,0.03) 40px),
			repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(0,0,0,0.03) 39px, rgba(0,0,0,0.03) 40px);
		pointer-events: none;
		z-index: 0;
	}

	/* Custom scrollbar styling */
	.chat-messages::-webkit-scrollbar {
		width: 12px;
	}

	.chat-messages::-webkit-scrollbar-track {
		background: #FFF;
		border-left: 3px solid #000;
	}

	.chat-messages::-webkit-scrollbar-thumb {
		background: #FFD93D;
		border: 2px solid #000;
	}

	.chat-messages::-webkit-scrollbar-thumb:hover {
		background: #FF69B4;
	}

	@media (max-width: 600px) {
		.chat-messages {
			height: clamp(250px, calc(100vh - 220px), 400px);
			max-height: calc(100vh - 220px);
		}
	}
</style>
