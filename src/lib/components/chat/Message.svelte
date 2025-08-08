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
		margin-bottom: 0.5rem;
		width: 100%;
		animation: fadeIn 0.3s ease-in-out;
	}

	.user-wrapper {
		justify-content: flex-end;
	}

	.assistant-wrapper {
		justify-content: flex-start;
	}

	.message {
		position: relative;
		max-width: 80%;
	}

	.message-content {
		padding: 0.875rem 1.125rem;
		border-radius: 16px;
		font-size: 1.0625rem;
		line-height: 1.5;
		white-space: pre-wrap;
		word-break: break-word;
	}

	/* Message bubbles with tails */
	.user-message .message-content {
		background-color: #0071e3;
		color: white;
		border-bottom-right-radius: 6px;
		box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
	}

	.user-message::after {
		content: '';
		position: absolute;
		bottom: 0;
		right: -8px;
		width: 16px;
		height: 16px;
		background: radial-gradient(40px at top right, transparent 50%, #0071e3 50%);
	}

	.assistant-message .message-content {
		background-color: #e5e5ea;
		color: #000;
		border-bottom-left-radius: 6px;
		box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
	}

	.assistant-message::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: -8px;
		width: 16px;
		height: 16px;
		background: radial-gradient(40px at top left, transparent 50%, #e5e5ea 50%);
	}

	/* Typing indicator */
	.typing-indicator {
		display: inline-flex;
		align-items: center;
		gap: 0.3125rem;
	}

	.typing-indicator span {
		width: 0.5rem;
		height: 0.5rem;
		background-color: #8e8e93;
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

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes bounce {
		0%,
		80%,
		100% {
			transform: scale(0);
		}
		40% {
			transform: scale(1);
		}
	}

	@media (max-width: 600px) {
		.message {
			max-width: 90%;
		}
	}
</style>
