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
	<div class="message-wrapper {message.role}-wrapper">
		{#if message.role === 'user'}
			<div class="message-decoration user-decoration"></div>
		{:else}
			<div class="message-decoration assistant-decoration"></div>
		{/if}

		<div class="message {message.role}-message">
			<div class="message-content">
				{#if message.role === 'assistant' && isGenerating && isLast}
					{#if message.content === ''}
						<div class="typing-indicator">
							<span class="typing-emoji">💭</span>
							<span class="dot"></span>
							<span class="dot"></span>
							<span class="dot"></span>
						</div>
					{:else}
						{message.content}
						<span class="cursor-blink">▊</span>
					{/if}
				{:else}
					{message.content}
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.message-wrapper {
		display: flex;
		margin-bottom: 1rem;
		width: 100%;
		animation: messageSlide 0.4s ease-out;
		position: relative;
		padding: 0 0.5rem;
		box-sizing: border-box;
	}

	@keyframes messageSlide {
		from {
			opacity: 0;
			transform: translateY(15px) scale(0.95);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	.message-decoration {
		position: absolute;
		width: 30px;
		height: 30px;
		border: 2px solid #000;
		opacity: 0.3;
		z-index: -1;
	}

	.user-decoration {
		right: -5px;
		top: 50%;
		transform: translateY(-50%) rotate(45deg);
		background: #ffd93d;
		border-radius: 30% 70% 70% 30% / 60% 40% 60% 40%;
		animation: float-deco 4s ease-in-out infinite;
	}

	.assistant-decoration {
		left: -5px;
		top: 50%;
		transform: translateY(-50%) rotate(-45deg);
		background: #98fb98;
		border-radius: 70% 30% 30% 70% / 40% 60% 40% 60%;
		animation: float-deco 4s ease-in-out infinite reverse;
	}

	@keyframes float-deco {
		0%,
		100% {
			transform: translateY(-50%) rotate(45deg) scale(1);
		}
		50% {
			transform: translateY(-50%) rotate(45deg) scale(1.1);
		}
	}

	.user-wrapper {
		justify-content: flex-end;
	}

	.assistant-wrapper {
		justify-content: flex-start;
	}

	.message {
		position: relative;
		max-width: 70%;
		word-wrap: break-word;
		overflow-wrap: break-word;
		min-width: 0;
		overflow: visible;
	}

	.message-content {
		padding: 0.875rem 1.125rem;
		font-size: 1rem;
		line-height: 1.5;
		white-space: pre-wrap;
		word-break: break-word;
		border: 3px solid #000;
		position: relative;
		font-weight: 500;
		border-radius: 16px;
		transition: all 0.2s ease;
		overflow: visible;
	}

	.user-message .message-content {
		background: linear-gradient(135deg, #ffd93d 0%, #ffa500 100%);
		color: #000;
		box-shadow: 5px 5px 0 #000;
		border-bottom-right-radius: 4px;
		transform: rotate(0deg);
	}

	.user-message .message-content:hover {
		transform: rotate(0deg) translate(-1px, -1px);
		box-shadow: 6px 6px 0 #000;
	}

	.user-message .message-content::before {
		content: '👤 You';
		position: absolute;
		top: -22px;
		right: 0;
		font-size: 0.75rem;
		font-weight: 700;
		color: #000;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		background: #98fb98;
		padding: 2px 8px;
		border: 2px solid #000;
		border-radius: 4px;
		box-shadow: 2px 2px 0 #000;
	}

	.assistant-message .message-content {
		background: linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 100%);
		color: #000;
		box-shadow: 5px 5px 0 #000;
		border-bottom-left-radius: 4px;
		transform: rotate(0deg);
	}

	.assistant-message .message-content:hover {
		transform: rotate(0deg) translate(-1px, -1px);
		box-shadow: 6px 6px 0 #000;
	}

	.assistant-message .message-content::before {
		content: '🤖 AI';
		position: absolute;
		top: -22px;
		left: 0;
		font-size: 0.75rem;
		font-weight: 700;
		color: #000;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		background: #ff69b4;
		padding: 2px 8px;
		border: 2px solid #000;
		border-radius: 4px;
		box-shadow: 2px 2px 0 #000;
	}

	.typing-indicator {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.25rem 0;
	}

	.cursor-blink {
		display: inline-block;
		animation: blink 1s infinite;
		color: #000;
		font-weight: normal;
		margin-left: 2px;
	}

	@keyframes blink {
		0%,
		50% {
			opacity: 1;
		}
		51%,
		100% {
			opacity: 0;
		}
	}

	.typing-emoji {
		font-size: 1.25rem;
		animation: pulse-emoji 1.5s ease-in-out infinite;
	}

	@keyframes pulse-emoji {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.2);
		}
	}

	.typing-indicator .dot {
		width: 8px;
		height: 8px;
		background: #000;
		border-radius: 50%;
		display: inline-block;
		animation: bounce-dot 1.4s infinite ease-in-out both;
		box-shadow: 1px 1px 0 rgba(0, 0, 0, 0.3);
	}

	.typing-indicator .dot:nth-child(2) {
		animation-delay: -0.32s;
	}

	.typing-indicator .dot:nth-child(3) {
		animation-delay: -0.16s;
	}

	.typing-indicator .dot:nth-child(4) {
		animation-delay: 0;
	}

	@keyframes bounce-dot {
		0%,
		80%,
		100% {
			transform: scale(0.8) translateY(0);
			opacity: 0.5;
		}
		40% {
			transform: scale(1.2) translateY(-8px);
			opacity: 1;
		}
	}

	@media (max-width: 600px) {
		.message {
			max-width: 85%;
		}

		.message-wrapper {
			padding: 0 0.25rem;
		}

		.message-content {
			padding: 0.75rem 1rem;
			font-size: 0.9375rem;
		}

		.user-message .message-content::before,
		.assistant-message .message-content::before {
			font-size: 0.7rem;
		}

		.message-decoration {
			display: none;
		}
	}
</style>
