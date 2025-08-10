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

	export async function scrollToBottom() {
		await tick();
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	}

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
		</div>
	{:else}
		{#each messages as message, i (i)}
			<Message {message} {isGenerating} isLast={i === messages.length - 1} />
		{/each}
	{/if}
</div>

<style>
	.chat-messages {
		flex: 1 1 auto;
		min-height: 0;
		overflow: auto;
		position: relative;
		background: linear-gradient(135deg, rgba(247, 249, 247, 0.8) 0%, rgba(238, 245, 238, 0.6) 100%);
		padding-top: 2rem;
		width: 100%;
		box-sizing: border-box;
		border-left: 1px solid rgba(82, 121, 82, 0.15);
		border-right: 1px solid rgba(82, 121, 82, 0.15);
		backdrop-filter: blur(8px);
	}

	.chat-decoration {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(
			90deg,
			rgba(82, 121, 82, 0.3) 0%,
			rgba(107, 142, 107, 0.2) 50%,
			rgba(82, 121, 82, 0.3) 100%
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
		font-size: 3rem;
		margin-bottom: 1.5rem;
		animation: gentle-float 4s ease-in-out infinite;
		filter: drop-shadow(0 4px 8px rgba(82, 121, 82, 0.2));
	}

	@keyframes gentle-float {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-8px);
		}
	}

	.empty-state h3 {
		font-size: 1.5rem;
		font-weight: 600;
		color: #2e4a2e;
		margin: 0 0 1rem 0;
		text-transform: none;
		letter-spacing: 0.01em;
		background: linear-gradient(135deg, rgba(82, 121, 82, 0.1) 0%, rgba(107, 142, 107, 0.08) 100%);
		padding: 0.75rem 2rem;
		border: 1px solid rgba(82, 121, 82, 0.2);
		box-shadow: 0 8px 32px rgba(82, 121, 82, 0.1);
		display: inline-block;
		border-radius: 16px;
		backdrop-filter: blur(8px);
	}

	.empty-state p {
		font-size: 1rem;
		color: rgba(82, 121, 82, 0.7);
		margin: 0;
		font-weight: 400;
		line-height: 1.6;
	}

	.chat-messages::-webkit-scrollbar {
		width: 8px;
	}

	.chat-messages::-webkit-scrollbar-track {
		background: rgba(82, 121, 82, 0.1);
		border-radius: 4px;
	}

	.chat-messages::-webkit-scrollbar-thumb {
		background: linear-gradient(135deg, rgba(82, 121, 82, 0.6) 0%, rgba(107, 142, 107, 0.5) 100%);
		border-radius: 4px;
		transition: background 0.3s ease;
	}

	.chat-messages::-webkit-scrollbar-thumb:hover {
		background: linear-gradient(135deg, rgba(82, 121, 82, 0.8) 0%, rgba(107, 142, 107, 0.7) 100%);
	}

	@media (max-width: 600px) {
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
	}
</style>
