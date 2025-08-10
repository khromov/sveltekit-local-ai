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
	{#if messages.length === 0 || (messages.length === 1 && messages[0].role === 'system')}
		<div class="empty-state">
			<!-- Nature-inspired empty state illustration -->
			<svg class="empty-illustration" width="120" height="120" viewBox="0 0 120 120">
				<g opacity="0.3">
					<!-- Tree trunk -->
					<rect x="55" y="70" width="10" height="30" fill="var(--bark-brown)" rx="2" />
					<!-- Tree crown -->
					<circle cx="60" cy="50" r="25" fill="var(--moss-green)" opacity="0.5" />
					<circle cx="50" cy="55" r="20" fill="var(--sage-green)" opacity="0.4" />
					<circle cx="70" cy="55" r="20" fill="var(--forest-light)" opacity="0.3" />
					<!-- Birds -->
					<path
						d="M20,30 Q25,25 30,30"
						stroke="var(--forest-primary)"
						stroke-width="2"
						fill="none"
						stroke-linecap="round"
					/>
					<path
						d="M35,25 Q40,20 45,25"
						stroke="var(--forest-primary)"
						stroke-width="2"
						fill="none"
						stroke-linecap="round"
					/>
					<!-- Sun -->
					<circle cx="90" cy="30" r="8" fill="var(--leaf-gold)" opacity="0.4" />
				</g>
			</svg>

			<h3>Begin Your Conversation</h3>
			<p>Share your thoughts and I'll respond naturally</p>
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
		background: transparent;
		padding: 1.5rem;
		width: 100%;
		box-sizing: border-box;
		scroll-behavior: smooth;
	}

	/* Subtle scrollbar styling */
	.chat-messages::-webkit-scrollbar {
		width: 8px;
	}

	.chat-messages::-webkit-scrollbar-track {
		background: rgba(139, 111, 71, 0.05);
		border-radius: 4px;
	}

	.chat-messages::-webkit-scrollbar-thumb {
		background: linear-gradient(180deg, var(--forest-light) 0%, var(--forest-primary) 100%);
		border-radius: 4px;
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	.chat-messages::-webkit-scrollbar-thumb:hover {
		background: linear-gradient(180deg, var(--moss-green) 0%, var(--forest-light) 100%);
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
		animation: fadeIn 0.8s ease-out;
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

	.empty-illustration {
		margin-bottom: 1.5rem;
		animation: gentle-sway 4s ease-in-out infinite;
	}

	@keyframes gentle-sway {
		0%,
		100% {
			transform: translateX(0) rotate(0deg);
		}
		50% {
			transform: translateX(5px) rotate(2deg);
		}
	}

	.empty-state h3 {
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--forest-primary);
		margin: 0 0 0.5rem 0;
		letter-spacing: -0.01em;
	}

	.empty-state p {
		font-size: 1rem;
		color: var(--text-secondary);
		margin: 0;
		font-weight: 400;
	}

	@media (max-width: 600px) {
		.chat-messages {
			padding: 1rem;
		}

		.empty-illustration {
			width: 100px;
			height: 100px;
		}

		.empty-state h3 {
			font-size: 1.25rem;
		}

		.empty-state p {
			font-size: 0.9375rem;
		}
	}
</style>
