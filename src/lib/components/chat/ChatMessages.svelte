<script lang="ts">
	import { onMount, tick } from 'svelte';
	import type { Message as MessageType } from '$lib/chat-config';
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
	<div class="chat-decoration"></div>

	{#if messages.length === 0 || (messages.length === 1 && messages[0].role === 'system')}
		<div class="empty-state">
			<div class="empty-icon">💬</div>
			<h3>Start a Conversation</h3>
			<p>Type a message below to begin chatting with AI</p>
			<div class="sparkle sparkle-1">✨</div>
			<div class="sparkle sparkle-2">⭐</div>
			<div class="sparkle sparkle-3">🌟</div>
		</div>
	{:else}
		{#each messages as message, i (i)}
			<Message {message} {isGenerating} isLast={i === messages.length - 1} />
		{/each}
	{/if}
</div>

<style>
	.chat-messages {
		/* Let this area flex to fill available space in the chat card and scroll internally */
		flex: 1 1 auto;
		min-height: 0; /* critical to allow proper scrolling in flex containers */
		overflow: auto;
		position: relative;
		background: linear-gradient(135deg, rgba(255, 229, 180, 0.1) 0%, rgba(230, 230, 250, 0.1) 100%);
		padding-top: 3rem;
		width: 100%;
		box-sizing: border-box;
		border-left: 3px solid #000;
		border-right: 3px solid #000;
	}

	.chat-decoration {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: repeating-linear-gradient(
			90deg,
			#ffd93d,
			#ffd93d 10px,
			#98fb98 10px,
			#98fb98 20px,
			#ff69b4 20px,
			#ff69b4 30px
		);
		z-index: 1;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		min-height: 300px;
		text-align: center;
		padding: 2rem;
		position: relative;
		animation: fadeIn 0.5s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.empty-icon {
		font-size: 4rem;
		margin-bottom: 1rem;
		animation: float 3s ease-in-out infinite;
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0) rotate(-5deg);
		}
		50% {
			transform: translateY(-15px) rotate(5deg);
		}
	}

	.empty-state h3 {
		font-size: 1.75rem;
		font-weight: 700;
		color: #000;
		margin: 0 0 0.5rem 0;
		text-transform: uppercase;
		letter-spacing: 1px;
		background: #ffd93d;
		padding: 0.5rem 1.5rem;
		border: 3px solid #000;
		box-shadow: 4px 4px 0 #000;
		display: inline-block;
		transform: rotate(-1deg);
	}

	.empty-state p {
		font-size: 1.125rem;
		color: #666;
		margin: 0.5rem 0 0 0;
		font-weight: 500;
	}

	.sparkle {
		position: absolute;
		font-size: 1.5rem;
		animation: sparkle 3s ease-in-out infinite;
	}

	.sparkle-1 {
		top: 20%;
		left: 15%;
		animation-delay: 0s;
	}

	.sparkle-2 {
		top: 30%;
		right: 20%;
		animation-delay: 1s;
	}

	.sparkle-3 {
		bottom: 25%;
		left: 25%;
		animation-delay: 2s;
	}

	@keyframes sparkle {
		0%,
		100% {
			opacity: 0;
			transform: scale(0) rotate(0deg);
		}
		50% {
			opacity: 1;
			transform: scale(1) rotate(180deg);
		}
	}

	/* Custom scrollbar styling */
	.chat-messages::-webkit-scrollbar {
		width: 12px;
	}

	.chat-messages::-webkit-scrollbar-track {
		background: linear-gradient(180deg, #ffd93d 0%, #98fb98 50%, #ff69b4 100%);
		border: 2px solid #000;
		border-radius: 6px;
	}

	.chat-messages::-webkit-scrollbar-thumb {
		background: #000;
		border-radius: 6px;
		border: 2px solid #fff;
		box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
	}

	.chat-messages::-webkit-scrollbar-thumb:hover {
		background: #333;
	}

	@media (max-width: 600px) {
		/* On small screens, inherit the same flexible behavior */
		.chat-messages {
			flex: 1 1 auto;
			min-height: 0;
		}

		.empty-icon {
			font-size: 3rem;
		}

		.empty-state h3 {
			font-size: 1.5rem;
		}

		.empty-state p {
			font-size: 1rem;
		}

		.sparkle {
			display: none;
		}
	}
</style>
