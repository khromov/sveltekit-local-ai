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
			<path d="M0,3 Q25,1 50,3 T100,3" stroke="#5a8c69" stroke-width="1.5" opacity="0.5" />
			<circle cx="20" cy="2.5" r="1" fill="#4a7c59" opacity="0.4" />
			<circle cx="50" cy="3.5" r="0.8" fill="#3a6e4a" opacity="0.3" />
			<circle cx="80" cy="2" r="1.2" fill="#5a8c69" opacity="0.4" />
		</svg>
	</div>

	{#if messages.length === 0 || (messages.length === 1 && messages[0].role === 'system')}
		<div class="empty-state">
			<div class="empty-icon">
				<svg viewBox="0 0 80 80" width="60" height="60">
					<!-- Tree with chat elements -->
					<path
						d="M40,65 Q35,45 40,25 Q45,45 40,65"
						stroke="#4a7c59"
						stroke-width="3"
						fill="none"
					/>
					<circle cx="40" cy="25" r="12" fill="#5a8c69" opacity="0.7" />
					<circle cx="32" cy="22" r="8" fill="#3a6e4a" opacity="0.6" />
					<circle cx="48" cy="28" r="6" fill="#6b9d7a" opacity="0.5" />
					<!-- Chat dots as leaves -->
					<circle cx="36" cy="20" r="1.5" fill="#faf8f5" />
					<circle cx="40" cy="23" r="1.5" fill="#faf8f5" />
					<circle cx="44" cy="20" r="1.5" fill="#faf8f5" />
					<!-- Roots -->
					<path
						d="M35,65 Q30,70 25,68 M45,65 Q50,70 55,68"
						stroke="#8b5a3c"
						stroke-width="2"
						opacity="0.6"
					/>
				</svg>
			</div>
			<h3>Begin Your Natural Conversation</h3>
			<p>Plant the first seed of your dialogue below and watch your conversation flourish</p>
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
		background: linear-gradient(135deg, rgba(90, 140, 105, 0.03) 0%, rgba(58, 110, 74, 0.02) 100%);
		padding-top: 2rem;
		width: 100%;
		box-sizing: border-box;
		border-left: 1px solid rgba(74, 124, 89, 0.15);
		border-right: 1px solid rgba(74, 124, 89, 0.15);
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
		min-height: 350px;
		text-align: center;
		padding: 3rem 2rem;
		position: relative;
		animation: naturalFadeIn 0.8s ease-out;
	}

	@keyframes naturalFadeIn {
		from {
			opacity: 0;
			transform: translateY(30px) scale(0.95);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	.empty-icon {
		margin-bottom: 2rem;
		animation: gentleFloat 6s ease-in-out infinite;
		opacity: 0.8;
	}

	@keyframes gentleFloat {
		0%,
		100% {
			transform: translateY(0) rotate(-2deg);
		}
		50% {
			transform: translateY(-8px) rotate(2deg);
		}
	}

	.empty-state h3 {
		font-size: 2rem;
		font-weight: 700;
		font-family: 'Caveat', cursive;
		color: #3a6e4a;
		margin: 0 0 1rem 0;
		letter-spacing: 0.5px;
		background: rgba(90, 140, 105, 0.1);
		padding: 0.75rem 2rem;
		border: 1px solid rgba(74, 124, 89, 0.3);
		border-radius: 20px;
		box-shadow:
			0 8px 20px rgba(58, 110, 74, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.7);
		backdrop-filter: blur(5px);
		display: inline-block;
	}

	.empty-state p {
		font-size: 1.1rem;
		color: #6b4c3a;
		margin: 0.5rem 0 0 0;
		font-weight: 400;
		font-family: 'Inter', sans-serif;
		line-height: 1.6;
		opacity: 0.8;
	}

	.chat-messages::-webkit-scrollbar {
		width: 8px;
	}

	.chat-messages::-webkit-scrollbar-track {
		background: linear-gradient(180deg, rgba(90, 140, 105, 0.1) 0%, rgba(74, 124, 89, 0.05) 100%);
		border-radius: 6px;
		border: 1px solid rgba(74, 124, 89, 0.1);
	}

	.chat-messages::-webkit-scrollbar-thumb {
		background: linear-gradient(180deg, #5a8c69, #4a7c59);
		border-radius: 6px;
		border: 1px solid rgba(58, 110, 74, 0.2);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.2),
			0 2px 4px rgba(58, 110, 74, 0.1);
	}

	.chat-messages::-webkit-scrollbar-thumb:hover {
		background: linear-gradient(180deg, #6b9d7a, #5a8c69);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.3),
			0 3px 6px rgba(58, 110, 74, 0.15);
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
