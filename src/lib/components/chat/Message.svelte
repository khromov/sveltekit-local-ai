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
			<div class="message-decoration user-decoration">
				<svg viewBox="0 0 20 25" width="16" height="20">
					<ellipse
						cx="10"
						cy="12"
						rx="4"
						ry="10"
						fill="#5a8c69"
						opacity="0.6"
						transform="rotate(-20 10 12)"
					/>
					<path d="M10,3 Q8,12 10,21" stroke="#4a7c59" stroke-width="1" opacity="0.4" />
				</svg>
			</div>
		{:else}
			<div class="message-decoration assistant-decoration">
				<svg viewBox="0 0 18 22" width="14" height="18">
					<ellipse
						cx="9"
						cy="11"
						rx="3.5"
						ry="9"
						fill="#3a6e4a"
						opacity="0.5"
						transform="rotate(15 9 11)"
					/>
					<path d="M9,2 Q11,11 9,20" stroke="#2d5d3a" stroke-width="1" opacity="0.3" />
				</svg>
			</div>
		{/if}

		<div class="message {message.role}-message">
			<div class="message-content">
				{#if message.role === 'assistant' && isGenerating && isLast}
					{#if message.content === ''}
						<div class="typing-indicator">
							<svg class="typing-icon" viewBox="0 0 20 20" width="16" height="16">
								<circle
									cx="10"
									cy="10"
									r="8"
									fill="none"
									stroke="#4a7c59"
									stroke-width="2"
									opacity="0.6"
								/>
								<path d="M6,10 Q10,6 14,10 Q10,14 6,10" fill="#5a8c69" opacity="0.4" />
							</svg>
							<span class="dot"></span>
							<span class="dot"></span>
							<span class="dot"></span>
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
		z-index: -1;
		opacity: 0.7;
	}

	.user-decoration {
		right: -8px;
		top: 20%;
		animation: leafFloat 8s ease-in-out infinite;
	}

	.assistant-decoration {
		left: -6px;
		top: 25%;
		animation: leafFloat 10s ease-in-out infinite reverse;
	}

	@keyframes leafFloat {
		0%,
		100% {
			transform: translateY(0) rotate(-5deg) scale(1);
			opacity: 0.6;
		}
		50% {
			transform: translateY(-8px) rotate(5deg) scale(1.05);
			opacity: 0.8;
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
		padding: 1rem 1.25rem;
		font-size: 1rem;
		line-height: 1.6;
		white-space: pre-wrap;
		word-break: break-word;
		border: 1px solid rgba(74, 124, 89, 0.2);
		position: relative;
		font-weight: 400;
		font-family: 'Inter', sans-serif;
		border-radius: 20px;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		overflow: visible;
		backdrop-filter: blur(5px);
		box-shadow:
			0 4px 12px rgba(58, 110, 74, 0.08),
			inset 0 1px 0 rgba(255, 255, 255, 0.6);
	}

	.user-message .message-content {
		background: linear-gradient(135deg, rgba(90, 140, 105, 0.9) 0%, rgba(74, 124, 89, 0.85) 100%);
		color: #faf8f5;
		border-bottom-right-radius: 8px;
		border-color: rgba(58, 110, 74, 0.3);
		box-shadow:
			0 6px 16px rgba(74, 124, 89, 0.15),
			inset 0 2px 0 rgba(255, 255, 255, 0.2);
	}

	.user-message .message-content:hover {
		transform: translateY(-1px);
		box-shadow:
			0 8px 20px rgba(74, 124, 89, 0.2),
			inset 0 2px 0 rgba(255, 255, 255, 0.3);
		background: linear-gradient(135deg, rgba(107, 157, 122, 0.9) 0%, rgba(90, 140, 105, 0.85) 100%);
	}

	.user-message .message-content::before {
		content: 'You';
		position: absolute;
		top: -20px;
		right: 0;
		font-size: 0.75rem;
		font-weight: 600;
		font-family: 'Caveat', cursive;
		color: #4a7c59;
		letter-spacing: 0.3px;
		background: rgba(139, 90, 60, 0.1);
		padding: 0.25rem 0.75rem;
		border: 1px solid rgba(107, 76, 58, 0.2);
		border-radius: 12px;
		box-shadow:
			0 2px 6px rgba(107, 76, 58, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.5);
		backdrop-filter: blur(3px);
	}

	.assistant-message .message-content {
		background: rgba(250, 248, 245, 0.95);
		color: #2a2a2a;
		border-bottom-left-radius: 8px;
		border-color: rgba(74, 124, 89, 0.2);
		box-shadow:
			0 6px 16px rgba(45, 93, 58, 0.1),
			inset 0 2px 0 rgba(255, 255, 255, 0.8);
	}

	.assistant-message .message-content:hover {
		transform: translateY(-1px);
		box-shadow:
			0 8px 20px rgba(45, 93, 58, 0.15),
			inset 0 2px 0 rgba(255, 255, 255, 0.9);
		border-color: rgba(90, 140, 105, 0.3);
	}

	.assistant-message .message-content::before {
		content: 'Garden AI';
		position: absolute;
		top: -20px;
		left: 0;
		font-size: 0.75rem;
		font-weight: 600;
		font-family: 'Caveat', cursive;
		color: #3a6e4a;
		letter-spacing: 0.3px;
		background: rgba(58, 110, 74, 0.1);
		padding: 0.25rem 0.75rem;
		border: 1px solid rgba(45, 93, 58, 0.2);
		border-radius: 12px;
		box-shadow:
			0 2px 6px rgba(45, 93, 58, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.6);
		backdrop-filter: blur(3px);
	}

	.typing-indicator {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.25rem 0;
	}

	.typing-icon {
		animation: naturalPulse 2s ease-in-out infinite;
		margin-right: 0.25rem;
	}

	@keyframes naturalPulse {
		0%,
		100% {
			transform: scale(1) rotate(0deg);
			opacity: 0.6;
		}
		50% {
			transform: scale(1.1) rotate(5deg);
			opacity: 0.9;
		}
	}

	.cursor-blink {
		display: inline-block;
		animation: naturalBlink 1.2s infinite;
		color: #4a7c59;
		font-weight: 300;
		margin-left: 2px;
	}

	@keyframes naturalBlink {
		0%,
		60% {
			opacity: 1;
		}
		61%,
		100% {
			opacity: 0;
		}
	}

	.typing-indicator .dot {
		width: 6px;
		height: 6px;
		background: #5a8c69;
		border-radius: 50%;
		display: inline-block;
		animation: naturalBounce 1.8s infinite ease-in-out both;
		box-shadow:
			0 1px 3px rgba(58, 110, 74, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.3);
	}

	.typing-indicator .dot:nth-child(2) {
		animation-delay: -0.4s;
		background: #4a7c59;
	}

	.typing-indicator .dot:nth-child(3) {
		animation-delay: -0.2s;
		background: #3a6e4a;
	}

	.typing-indicator .dot:nth-child(4) {
		animation-delay: 0;
		background: #5a8c69;
	}

	@keyframes naturalBounce {
		0%,
		80%,
		100% {
			transform: scale(0.9) translateY(0);
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
