<script lang="ts">
	import { onMount, tick } from 'svelte';
	import type { Message as MessageType } from '$lib/wllama-config';
	import Message from './Message.svelte';
	import MessageCircleIcon from 'virtual:icons/lucide/message-circle';

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
			<div class="empty-icon"><MessageCircleIcon /></div>
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
		min-height: 0; /* critical to allow proper scrolling in flex containers */
		overflow: auto;
		position: relative;
		background: linear-gradient(135deg, rgba(255, 229, 180, 0.1) 0%, rgba(230, 230, 250, 0.1) 100%);
		padding-top: 3rem;
		width: 100%;
		box-sizing: border-box;
		border-left: var(--border-brutalist-thick);
		border-right: var(--border-brutalist-thick);
	}

	.chat-decoration {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: repeating-linear-gradient(
			90deg,
			var(--color-primary-dark),
			var(--color-primary-dark) 10px,
			var(--color-success) 10px,
			var(--color-success) 20px,
			var(--color-accent-pink) 20px,
			var(--color-accent-pink) 30px
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
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-text-primary);
	}

	.empty-icon :global(svg) {
		width: 4rem;
		height: 4rem;
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
		color: var(--color-text-primary);
		margin: 0 0 0.5rem 0;
		text-transform: uppercase;
		letter-spacing: 1px;
		background: var(--color-primary-dark);
		padding: 0.5rem 1.5rem;
		border: var(--border-brutalist-thick);
		box-shadow: var(--shadow-brutalist-medium);
		display: inline-block;
		transform: rotate(-1deg);
	}

	.empty-state p {
		font-size: 1.125rem;
		color: var(--color-text-tertiary);
		margin: 0.5rem 0 0 0;
		font-weight: 500;
	}

	.chat-messages::-webkit-scrollbar {
		width: 12px;
	}

	.chat-messages::-webkit-scrollbar-track {
		background: linear-gradient(
			180deg,
			var(--color-primary-dark) 0%,
			var(--color-success) 50%,
			var(--color-accent-pink) 100%
		);
		border: var(--border-brutalist-thin);
		border-radius: 6px;
	}

	.chat-messages::-webkit-scrollbar-thumb {
		background: var(--color-text-primary);
		border-radius: 6px;
		border: 2px solid var(--color-background-main);
		box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
	}

	.chat-messages::-webkit-scrollbar-thumb:hover {
		background: var(--color-text-secondary);
	}

	@media (max-width: 600px) {
		.chat-messages {
			flex: 1 1 auto;
			min-height: 0;
		}

		.empty-icon {
			font-size: 3rem;
		}

		.empty-icon :global(svg) {
			width: 3rem;
			height: 3rem;
		}

		.empty-state h3 {
			font-size: 1.5rem;
		}

		.empty-state p {
			font-size: 1rem;
		}
	}
</style>
