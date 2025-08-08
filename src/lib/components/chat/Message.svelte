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
		<div class="message {message.role}-message">
			<div class="message-content">
				{#if message.role === 'assistant' && message.content === '' && isGenerating && isLast}
					<div class="typing-indicator">
						<span></span>
						<span></span>
						<span></span>
					</div>
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
		animation: messageSlide 0.3s ease-out;
		position: relative;
		padding: 0 0.5rem;
	}

	@keyframes messageSlide {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
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
	}

	.message-content {
		padding: 0.875rem 1.125rem;
		font-size: 1rem;
		line-height: 1.5;
		white-space: pre-wrap;
		word-break: break-word;
		border: 2px solid #000;
		position: relative;
		font-weight: 500;
		border-radius: 12px;
	}

	/* User message styling */
	.user-message .message-content {
		background: #ffd700;
		color: #000;
		box-shadow: 3px 3px 0 #000;
		border-bottom-right-radius: 4px;
	}

	.user-message .message-content::before {
		content: 'You';
		position: absolute;
		top: -20px;
		right: 0;
		font-size: 0.75rem;
		font-weight: 700;
		color: #666;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	/* Assistant message styling */
	.assistant-message .message-content {
		background: #f0f0f0;
		color: #000;
		box-shadow: 3px 3px 0 #000;
		border-bottom-left-radius: 4px;
	}

	.assistant-message .message-content::before {
		content: 'AI';
		position: absolute;
		top: -20px;
		left: 0;
		font-size: 0.75rem;
		font-weight: 700;
		color: #666;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	/* Typing indicator */
	.typing-indicator {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.25rem 0;
	}

	.typing-indicator span {
		width: 8px;
		height: 8px;
		background: #666;
		border-radius: 50%;
		display: inline-block;
		animation: bounce 1.4s infinite ease-in-out both;
	}

	.typing-indicator span:nth-child(1) {
		animation-delay: -0.32s;
	}

	.typing-indicator span:nth-child(2) {
		animation-delay: -0.16s;
	}

	@keyframes bounce {
		0%,
		80%,
		100% {
			transform: scale(0.8);
			opacity: 0.5;
		}
		40% {
			transform: scale(1);
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
	}
</style>
