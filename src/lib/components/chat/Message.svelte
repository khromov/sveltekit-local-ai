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
		margin-bottom: 1.5rem;
		width: 100%;
		animation: gentle-slide 0.5s ease-out;
		position: relative;
		padding: 0 1rem;
		box-sizing: border-box;
	}

	@keyframes gentle-slide {
		from {
			opacity: 0;
			transform: translateY(10px) scale(0.98);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	.message-decoration {
		position: absolute;
		width: 20px;
		height: 20px;
		border: 1px solid rgba(82, 121, 82, 0.2);
		opacity: 0.4;
		z-index: -1;
		border-radius: 50%;
	}

	.user-decoration {
		right: -5px;
		top: 50%;
		transform: translateY(-50%);
		background: radial-gradient(circle, rgba(82, 121, 82, 0.1) 0%, rgba(107, 142, 107, 0.05) 100%);
		animation: gentle-float-deco 6s ease-in-out infinite;
	}

	.assistant-decoration {
		left: -5px;
		top: 50%;
		transform: translateY(-50%);
		background: radial-gradient(circle, rgba(107, 142, 107, 0.1) 0%, rgba(82, 121, 82, 0.05) 100%);
		animation: gentle-float-deco 6s ease-in-out infinite reverse;
	}

	@keyframes gentle-float-deco {
		0%,
		100% {
			transform: translateY(-50%) scale(1);
			opacity: 0.4;
		}
		50% {
			transform: translateY(-50%) scale(1.2);
			opacity: 0.2;
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
		padding: 1rem 1.5rem;
		font-size: 0.95rem;
		line-height: 1.6;
		white-space: pre-wrap;
		word-break: break-word;
		border: 1px solid rgba(82, 121, 82, 0.2);
		position: relative;
		font-weight: 400;
		border-radius: 20px;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		overflow: visible;
		backdrop-filter: blur(8px);
		box-shadow: 0 4px 16px rgba(82, 121, 82, 0.08);
	}

	.user-message .message-content {
		background: linear-gradient(135deg, rgba(82, 121, 82, 0.9) 0%, rgba(107, 142, 107, 0.85) 100%);
		color: #ffffff;
		box-shadow: 0 8px 32px rgba(82, 121, 82, 0.2);
		border-bottom-right-radius: 8px;
	}

	.user-message .message-content:hover {
		transform: translateY(-2px);
		box-shadow: 0 12px 48px rgba(82, 121, 82, 0.25);
	}

	.user-message .message-content::before {
		content: '👤 You';
		position: absolute;
		top: -16px;
		right: 0;
		font-size: 0.7rem;
		font-weight: 500;
		color: #527952;
		text-transform: none;
		letter-spacing: 0.01em;
		background: rgba(255, 255, 255, 0.95);
		padding: 0.25rem 0.75rem;
		border: 1px solid rgba(82, 121, 82, 0.2);
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(82, 121, 82, 0.15);
		backdrop-filter: blur(8px);
	}

	.assistant-message .message-content {
		background: rgba(255, 255, 255, 0.95);
		color: #2e4a2e;
		box-shadow: 0 8px 32px rgba(82, 121, 82, 0.12);
		border-bottom-left-radius: 8px;
	}

	.assistant-message .message-content:hover {
		transform: translateY(-2px);
		box-shadow: 0 12px 48px rgba(82, 121, 82, 0.18);
	}

	.assistant-message .message-content::before {
		content: '🤖 AI';
		position: absolute;
		top: -16px;
		left: 0;
		font-size: 0.7rem;
		font-weight: 500;
		color: #527952;
		text-transform: none;
		letter-spacing: 0.01em;
		background: rgba(255, 255, 255, 0.95);
		padding: 0.25rem 0.75rem;
		border: 1px solid rgba(82, 121, 82, 0.2);
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(82, 121, 82, 0.15);
		backdrop-filter: blur(8px);
	}

	.typing-indicator {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.25rem 0;
	}

	.cursor-blink {
		display: inline-block;
		animation: gentle-blink 1.5s infinite;
		color: #527952;
		font-weight: normal;
		margin-left: 2px;
	}

	@keyframes gentle-blink {
		0%,
		50% {
			opacity: 1;
		}
		51%,
		100% {
			opacity: 0.3;
		}
	}

	.typing-emoji {
		font-size: 1.125rem;
		animation: gentle-pulse-emoji 2s ease-in-out infinite;
		filter: drop-shadow(0 1px 3px rgba(82, 121, 82, 0.3));
	}

	@keyframes gentle-pulse-emoji {
		0%,
		100% {
			transform: scale(1);
			opacity: 1;
		}
		50% {
			transform: scale(1.1);
			opacity: 0.8;
		}
	}

	.typing-indicator .dot {
		width: 6px;
		height: 6px;
		background: rgba(82, 121, 82, 0.7);
		border-radius: 50%;
		display: inline-block;
		animation: gentle-bounce-dot 1.8s infinite ease-in-out both;
		box-shadow: 0 1px 3px rgba(82, 121, 82, 0.2);
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

	@keyframes gentle-bounce-dot {
		0%,
		80%,
		100% {
			transform: scale(0.8) translateY(0);
			opacity: 0.6;
		}
		40% {
			transform: scale(1.1) translateY(-6px);
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
