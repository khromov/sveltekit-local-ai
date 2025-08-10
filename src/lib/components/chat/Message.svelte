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
			<div class="message-avatar">
				{#if message.role === 'user'}
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
						<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" opacity="0.3" />
						<circle cx="12" cy="8" r="3" fill="currentColor" opacity="0.5" />
						<path
							d="M6 20C6 16 8 14 12 14C16 14 18 16 18 20"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							opacity="0.5"
						/>
					</svg>
				{:else}
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
						<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" opacity="0.3" />
						<path
							d="M12 2Q10 6 10 12Q10 18 12 22Q14 18 14 12Q14 6 12 2"
							fill="currentColor"
							opacity="0.3"
						/>
						<circle cx="8" cy="10" r="1" fill="currentColor" opacity="0.5" />
						<circle cx="16" cy="10" r="1" fill="currentColor" opacity="0.5" />
					</svg>
				{/if}
			</div>

			<div class="message-content">
				{#if message.role === 'assistant' && isGenerating && isLast}
					{#if message.content === ''}
						<div class="typing-indicator">
							<span class="typing-dot"></span>
							<span class="typing-dot"></span>
							<span class="typing-dot"></span>
						</div>
					{:else}
						{message.content}
						<span class="cursor-blink">|</span>
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
		animation: messageSlide 0.5s ease-out;
		position: relative;
		padding: 0;
		box-sizing: border-box;
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
		display: flex;
		gap: 0.75rem;
		align-items: flex-start;
	}

	.message-avatar {
		flex-shrink: 0;
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.9) 0%,
			rgba(250, 248, 243, 0.95) 100%
		);
		border: 1px solid rgba(139, 111, 71, 0.15);
		border-radius: 12px;
		color: var(--forest-primary);
		box-shadow: 0 2px 8px rgba(46, 90, 61, 0.08);
	}

	.user-message {
		flex-direction: row-reverse;
	}

	.user-message .message-avatar {
		background: linear-gradient(135deg, var(--moss-green) 0%, var(--forest-light) 100%);
		color: white;
		border-color: rgba(255, 255, 255, 0.2);
	}

	.message-content {
		padding: 1rem 1.25rem;
		font-size: 0.975rem;
		line-height: 1.6;
		white-space: pre-wrap;
		word-break: break-word;
		border-radius: 16px;
		position: relative;
		font-weight: 400;
		transition: all 0.2s ease;
		letter-spacing: 0.01em;
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.9) 0%,
			rgba(250, 248, 243, 0.95) 100%
		);
		border: 1px solid rgba(139, 111, 71, 0.15);
		color: var(--text-primary);
		box-shadow:
			0 2px 12px rgba(46, 90, 61, 0.06),
			0 1px 3px rgba(139, 111, 71, 0.08);
	}

	.user-message .message-content {
		background: linear-gradient(135deg, var(--forest-light) 0%, var(--forest-primary) 100%);
		color: white;
		border-color: rgba(255, 255, 255, 0.2);
		box-shadow:
			0 4px 16px rgba(45, 90, 61, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.1);
	}

	.message-content:hover {
		transform: translateY(-1px);
		box-shadow:
			0 4px 16px rgba(46, 90, 61, 0.1),
			0 2px 6px rgba(139, 111, 71, 0.08);
	}

	.user-message .message-content:hover {
		box-shadow:
			0 6px 20px rgba(45, 90, 61, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.15);
	}

	.typing-indicator {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.25rem 0;
	}

	.typing-dot {
		width: 6px;
		height: 6px;
		background: var(--forest-primary);
		border-radius: 50%;
		display: inline-block;
		animation: typing-bounce 1.4s infinite ease-in-out both;
		opacity: 0.5;
	}

	.typing-dot:nth-child(1) {
		animation-delay: -0.32s;
	}

	.typing-dot:nth-child(2) {
		animation-delay: -0.16s;
	}

	.typing-dot:nth-child(3) {
		animation-delay: 0;
	}

	@keyframes typing-bounce {
		0%,
		80%,
		100% {
			transform: scale(0.8);
			opacity: 0.5;
		}
		40% {
			transform: scale(1.2);
			opacity: 1;
		}
	}

	.cursor-blink {
		display: inline-block;
		animation: blink 1s infinite;
		color: var(--forest-primary);
		font-weight: 300;
		margin-left: 2px;
		opacity: 0.6;
	}

	@keyframes blink {
		0%,
		50% {
			opacity: 0.6;
		}
		51%,
		100% {
			opacity: 0;
		}
	}

	@media (max-width: 600px) {
		.message {
			max-width: 85%;
		}

		.message-avatar {
			width: 32px;
			height: 32px;
		}

		.message-content {
			padding: 0.875rem 1rem;
			font-size: 0.9375rem;
		}
	}
</style>
