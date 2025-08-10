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
	<div class="chat-decoration">
		<svg viewBox="0 0 100 6" width="100%" height="6">
			<path
				d="M0,3 Q25,1 50,3 T100,3"
				stroke="var(--earth-medium)"
				stroke-width="1"
				fill="none"
				opacity="0.4"
			/>
		</svg>
	</div>

	{#if messages.length === 0 || (messages.length === 1 && messages[0].role === 'system')}
		<div class="empty-state">
			<div class="empty-decoration">
				<svg viewBox="0 0 120 120" width="120" height="120">
					<circle
						cx="60"
						cy="60"
						r="40"
						fill="none"
						stroke="var(--sage)"
						stroke-width="2"
						opacity="0.3"
					/>
					<circle cx="45" cy="50" r="3" fill="var(--clay)" opacity="0.6" />
					<circle cx="75" cy="50" r="3" fill="var(--clay)" opacity="0.6" />
					<path
						d="M50,75 Q60,85 70,75"
						stroke="var(--earth-dark)"
						stroke-width="2"
						fill="none"
						opacity="0.5"
					/>
				</svg>
			</div>
			<h3>Begin Your Conversation</h3>
			<p>Share your thoughts, ask questions, or explore ideas together</p>
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
		background: linear-gradient(
			135deg,
			rgba(245, 241, 235, 0.4) 0%,
			rgba(230, 221, 212, 0.3) 50%,
			rgba(245, 241, 235, 0.4) 100%
		);
		padding-top: 2rem;
		width: 100%;
		box-sizing: border-box;
		border-left: 1px solid var(--earth-medium);
		border-right: 1px solid var(--earth-medium);
	}

	.chat-decoration {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 6px;
		z-index: 1;
		padding: 0 1rem;
		box-sizing: border-box;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		min-height: 300px;
		text-align: center;
		padding: 3rem 2rem;
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

	.empty-decoration {
		margin-bottom: 2rem;
		animation: gentleFloat 4s ease-in-out infinite;
	}

	@keyframes gentleFloat {
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
		color: var(--text-primary);
		margin: 0 0 0.75rem 0;
		letter-spacing: 0.02em;
	}

	.empty-state p {
		font-size: 1rem;
		color: var(--text-secondary);
		margin: 0;
		font-weight: 400;
		max-width: 300px;
		line-height: 1.6;
		letter-spacing: 0.01em;
	}

	.chat-messages::-webkit-scrollbar {
		width: 8px;
	}

	.chat-messages::-webkit-scrollbar-track {
		background: linear-gradient(
			180deg,
			var(--earth-light) 0%,
			var(--sand) 50%,
			var(--earth-light) 100%
		);
		border-radius: 4px;
		margin: 4px;
	}

	.chat-messages::-webkit-scrollbar-thumb {
		background: linear-gradient(180deg, var(--mocha-mousse), var(--clay));
		border-radius: 4px;
		border: 1px solid var(--earth-medium);
	}

	.chat-messages::-webkit-scrollbar-thumb:hover {
		background: linear-gradient(180deg, var(--clay), var(--mocha-mousse));
	}

	@media (max-width: 600px) {
		.chat-messages {
			flex: 1 1 auto;
			min-height: 0;
			padding-top: 1.5rem;
		}

		.empty-state {
			padding: 2rem 1.5rem;
			min-height: 250px;
		}

		.empty-decoration {
			margin-bottom: 1.5rem;
		}

		.empty-state h3 {
			font-size: 1.25rem;
		}

		.empty-state p {
			font-size: 0.95rem;
		}
	}
</style>
