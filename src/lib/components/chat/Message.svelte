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
			<div class="message-decoration"></div>
		</div>
	</div>
{/if}

<style>
	.message-wrapper {
		display: flex;
		margin-bottom: 1.5rem;
		width: 100%;
		animation: messageSlide 0.3s ease-out;
		position: relative;
		z-index: 1;
	}

	@keyframes messageSlide {
		from {
			transform: translateY(20px) rotate(-2deg);
			opacity: 0;
		}
		to {
			transform: translateY(0) rotate(0);
			opacity: 1;
		}
	}

	.user-wrapper {
		justify-content: flex-end;
		padding-right: 1rem;
	}

	.assistant-wrapper {
		justify-content: flex-start;
		padding-left: 1rem;
	}

	.message {
		position: relative;
		max-width: 75%;
		transform: rotate(-1deg);
	}

	.user-message {
		transform: rotate(1deg);
	}

	.message-content {
		padding: 1rem 1.25rem;
		font-size: 1.0625rem;
		line-height: 1.5;
		white-space: pre-wrap;
		word-break: break-word;
		border: 3px solid #000;
		position: relative;
		font-weight: 500;
	}

	/* User message styling */
	.user-message .message-content {
		background: #FFD93D;
		color: #000;
		box-shadow: 5px 5px 0 #000;
		border-radius: 20% 5% 20% 5% / 5% 20% 5% 20%;
		position: relative;
	}

	.user-message .message-content::before {
		content: 'USER';
		position: absolute;
		top: -14px;
		right: 10px;
		background: #000;
		color: #FFD93D;
		padding: 2px 8px;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 1px;
		border: 2px solid #000;
	}

	.user-message .message-decoration {
		position: absolute;
		top: -5px;
		right: -5px;
		width: 30px;
		height: 30px;
		background: #FF69B4;
		border: 2px solid #000;
		border-radius: 50%;
		z-index: -1;
		transform: rotate(45deg);
	}

	/* Assistant message styling */
	.assistant-message .message-content {
		background: #98FB98;
		color: #000;
		box-shadow: -5px 5px 0 #000;
		border-radius: 5% 20% 5% 20% / 20% 5% 20% 5%;
		position: relative;
	}

	.assistant-message .message-content::before {
		content: 'AI';
		position: absolute;
		top: -14px;
		left: 10px;
		background: #000;
		color: #98FB98;
		padding: 2px 12px;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 1px;
		border: 2px solid #000;
	}

	.assistant-message .message-decoration {
		position: absolute;
		top: -5px;
		left: -5px;
		width: 40px;
		height: 40px;
		border: 3px dashed #000;
		border-radius: 30% 70% 70% 30% / 60% 40% 60% 40%;
		z-index: -1;
		opacity: 0.3;
		transform: rotate(-30deg);
	}

	/* Typing indicator */
	.typing-indicator {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0;
	}

	.typing-indicator span {
		width: 12px;
		height: 12px;
		background: #000;
		display: inline-block;
		animation: bounce 1.4s infinite ease-in-out both;
		border-radius: 2px;
		transform: rotate(45deg);
	}

	.typing-indicator span:nth-child(1) {
		animation-delay: -0.32s;
		background: #FFD93D;
	}

	.typing-indicator span:nth-child(2) {
		animation-delay: -0.16s;
		background: #FF69B4;
	}

	.typing-indicator span:nth-child(3) {
		background: #98FB98;
	}

	@keyframes bounce {
		0%, 80%, 100% {
			transform: scale(0.6) rotate(45deg);
		}
		40% {
			transform: scale(1.2) rotate(45deg);
		}
	}

	@media (max-width: 600px) {
		.message {
			max-width: 85%;
		}

		.user-wrapper {
			padding-right: 0.5rem;
		}

		.assistant-wrapper {
			padding-left: 0.5rem;
		}

		.message-content {
			padding: 0.875rem 1rem;
			font-size: 1rem;
		}
	}
</style>
