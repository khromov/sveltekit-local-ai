<script lang="ts">
	import { Wllama, type DownloadProgressCallback } from '@wllama/wllama';
	import { onMount } from 'svelte';
	import { Template } from '@huggingface/jinja';
	import {
		WLLAMA_CONFIG_PATHS,
		DEFAULT_CHAT_TEMPLATE,
		AVAILABLE_MODELS,
		type Message
	} from '$lib/wllama-config';
	import { useWakeLock } from '$lib/wakeLock.svelte';
	import { messages, inferenceParams } from '$lib/stores';

	// Import components
	import LoadingProgress from '$lib/components/LoadingProgress.svelte';
	import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';
	import ModelSelector from '$lib/components/chat/ModelSelector.svelte';
	import ChatMessages from '$lib/components/chat/ChatMessages.svelte';
	import MessageInput from '$lib/components/chat/MessageInput.svelte';

	// State variables
	let wllama: Wllama;
	let isLoading = $state(false);
	let isModelLoaded = $state(false);
	let isGenerating = $state(false);
	let downloadProgress = $state(0);
	let previousProgress = $state(0);
	let downloadError = $state(false);
	let modelSelection = $state(AVAILABLE_MODELS[0].url);
	let selectedModel = $state(AVAILABLE_MODELS[0]);
	let inputText = $state('');
	let stopSignal = false;
	let chatMessagesComponent: ChatMessages | undefined = $state();
	let messageInputComponent: MessageInput | undefined = $state();

	// Initialize wake lock functionality
	const { requestWakeLock, releaseWakeLock, setupWakeLock } = useWakeLock();

	// Set up event listeners
	onMount(() => {
		// Set up wake lock management
		return setupWakeLock(() => isGenerating);
	});

	async function loadModel() {
		try {
			isLoading = true;
			downloadError = false;
			downloadProgress = 0;
			previousProgress = 0;

			const model = AVAILABLE_MODELS.find((m) => m.url === modelSelection);
			if (model) {
				selectedModel = model;
			}

			wllama = new Wllama(WLLAMA_CONFIG_PATHS);

			const progressCallback: DownloadProgressCallback = ({ loaded, total }) => {
				previousProgress = downloadProgress;
				downloadProgress = Math.round((loaded / total) * 100);
				console.log(`Downloading... ${downloadProgress}%`);
			};

			await wllama.loadModelFromUrl(modelSelection, {
				progressCallback,
				n_threads: $inferenceParams.nThreads > 0 ? $inferenceParams.nThreads : undefined,
				n_ctx: $inferenceParams.nContext,
				n_batch: $inferenceParams.nBatch
			});

			isModelLoaded = true;
		} catch (err) {
			console.error('Model loading error:', err);
			downloadError = true;
		} finally {
			isLoading = false;
		}
	}

	// Function to generate chat completion
	async function sendMessage() {
		if (!isModelLoaded || isGenerating || !inputText.trim()) {
			return;
		}

		// Add user message to chat
		const userMessage: Message = {
			role: 'user',
			content: inputText
		};

		$messages = [...$messages, userMessage];

		// After adding user message, scroll to bottom
		chatMessagesComponent?.scrollToBottom();

		// Add empty assistant message
		const assistantMessage: Message = {
			role: 'assistant',
			content: ''
		};

		$messages = [...$messages, assistantMessage];

		// Scroll to see empty assistant message with typing indicator
		chatMessagesComponent?.scrollToBottom();

		inputText = '';
		isGenerating = true;
		stopSignal = false;

		// Request wake lock to keep screen on during generation
		await requestWakeLock();

		try {
			// Format chat history for the model
			let formattedChat = await formatChatHistory($messages.slice(0, -1));
			console.log('Formatted chat:', formattedChat);

			// Generate completion
			await wllama.createCompletion(formattedChat, {
				nPredict: $inferenceParams.nPredict,
				sampling: {
					temp: $inferenceParams.temperature
				},
				useCache: true,
				onNewToken: (token, piece, currentText, optionals) => {
					// Update the last message with the current generated text
					$messages[$messages.length - 1].content = currentText;
					$messages = [...$messages];

					// Scroll to bottom with each new token when generating
					chatMessagesComponent?.scrollToBottom();

					// If stop requested, abort generation
					if (stopSignal) {
						optionals.abortSignal();
					}
				}
			});
		} catch (err) {
			console.error('Generation error:', err);
		} finally {
			isGenerating = false;

			// Release wake lock when generation is complete
			await releaseWakeLock();

			// Focus the input field when generation is complete
			messageInputComponent?.focus();
		}
	}

	// Function to stop text generation
	async function stopGeneration() {
		stopSignal = true;

		// Release wake lock when generation is stopped
		await releaseWakeLock();
	}

	// Function to format chat history
	async function formatChatHistory(msgs: Message[]): Promise<string> {
		try {
			const templateStr = wllama.getChatTemplate() || DEFAULT_CHAT_TEMPLATE;

			// Special handling for DeepSeek models that cause issues with jinja
			const isDeepSeekR1 =
				templateStr.match(/<｜Assistant｜>/) &&
				templateStr.match(/<｜User｜>/) &&
				templateStr.match(/<\/think>/);

			if (isDeepSeekR1) {
				let result = '';
				for (const message of msgs) {
					if (message.role === 'system') {
						result += `${message.content}\n\n`;
					} else if (message.role === 'user') {
						result += `<｜User｜>${message.content}`;
					} else {
						result += `<｜Assistant｜>${message.content.split('</think>').pop()}<｜end▁of▁sentence｜>`;
					}
				}
				return result + '<｜Assistant｜>';
			}

			// Standard template rendering with jinja
			const template = new Template(templateStr);
			const bos_token = await wllama.detokenize([wllama.getBOS()], true);
			const eos_token = await wllama.detokenize([wllama.getEOS()], true);

			return template.render({
				messages: msgs,
				bos_token,
				eos_token,
				add_generation_prompt: true
			});
		} catch (err) {
			console.error('Error formatting chat:', err);
			// Fallback to basic formatting
			return msgs.map((m) => `${m.role}: ${m.content}`).join('\n\n') + '\n\nassistant: ';
		}
	}

	// Start fresh chat
	function newChat() {
		if (isGenerating) {
			stopGeneration();
		}
		$messages = [];

		// Focus the input field after clearing chat
		messageInputComponent?.focus();
	}

	// Initialize on component mount
	onMount(() => {
		if ($messages.length === 0) {
			// Add a system message for first-time users
			$messages = [
				{
					role: 'system',
					content:
						"You are a helpful AI assistant. Answer the user's questions concisely and accurately."
				}
			];
		}

		// Focus input when already loaded
		if (isModelLoaded) {
			messageInputComponent?.focus();
		}
	});
</script>

{#if !isModelLoaded}
	<div class="loading">
		{#if downloadError}
			<ErrorDisplay
				message="Failed to load model. Please check your connection and try again."
				buttonText={isLoading ? 'Reloading...' : 'Reload Model'}
				onRetry={loadModel}
				isRetrying={isLoading}
			/>
		{:else if isLoading}
			<LoadingProgress
				title="Loading Model"
				progress={downloadProgress}
				{previousProgress}
				message="This will take a couple of minutes. The chat model is being downloaded to your browser."
			/>
		{:else}
			<ModelSelector bind:modelSelection onLoadModel={loadModel} {isLoading} />
		{/if}
	</div>
{:else}
	<div class="card-interface chat-interface">
		<div class="floating-decoration decoration-1"></div>
		<div class="floating-decoration decoration-2"></div>

		<div class="toolbar">
			<span class="model-info">
				<span class="model-emoji">🤖</span>
				{selectedModel.name}
			</span>
			<button onclick={newChat} class="new-chat-btn">
				<span class="btn-emoji">✨</span>
				New Chat
			</button>
			<div class="toolbar-decoration"></div>
		</div>

		<ChatMessages bind:this={chatMessagesComponent} messages={$messages} {isGenerating} />

		<MessageInput
			bind:this={messageInputComponent}
			bind:value={inputText}
			{isGenerating}
			onSend={sendMessage}
			onStop={stopGeneration}
		/>
	</div>
{/if}

<style>
	.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		margin: 2rem 0;
		animation: fadeIn 0.4s ease-out;
		width: 100%;
		box-sizing: border-box;
		overflow-x: hidden;
		padding: 0;
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

	.chat-interface {
		position: relative;
		transform: rotate(0deg);
		animation: slideInChat 0.5s ease-out;
		display: flex;
		flex-direction: column;
		/* Fix the card height relative to the viewport so only the messages list scrolls */
		height: clamp(520px, 85vh, 920px);
		min-height: 0; /* important for inner flex child scrolling */
	}

	@media (max-width: 600px) {
		.chat-interface {
			height: 85vh;
		}
	}

	@keyframes slideInChat {
		from {
			opacity: 0;
			transform: translateY(20px) rotate(0deg);
		}
		to {
			opacity: 1;
			transform: translateY(0) rotate(0deg);
		}
	}

	.floating-decoration {
		position: absolute;
		background: linear-gradient(135deg, #ffd93d 0%, #ff69b4 100%);
		border: 3px solid #000;
		opacity: 0.2;
		z-index: -1;
		pointer-events: none;
	}

	.decoration-1 {
		width: 80px;
		height: 80px;
		top: -20px;
		right: -20px;
		border-radius: 30% 70% 70% 30% / 60% 40% 60% 40%;
		animation: float1 8s ease-in-out infinite;
	}

	.decoration-2 {
		width: 60px;
		height: 60px;
		bottom: 100px;
		left: -15px;
		border-radius: 70% 30% 30% 70% / 40% 60% 40% 60%;
		animation: float2 10s ease-in-out infinite;
	}

	@keyframes float1 {
		0%,
		100% {
			transform: translate(0, 0) rotate(0deg);
		}
		50% {
			transform: translate(-10px, 10px) rotate(180deg);
		}
	}

	@keyframes float2 {
		0%,
		100% {
			transform: translate(0, 0) rotate(0deg);
		}
		50% {
			transform: translate(10px, -10px) rotate(-180deg);
		}
	}

	.toolbar-decoration {
		position: absolute;
		bottom: -6px;
		left: 0;
		right: 0;
		height: 3px;
		background: repeating-linear-gradient(90deg, #000, #000 8px, #98fb98 8px, #98fb98 16px);
	}

	.model-emoji {
		font-size: 1.125rem;
		margin-right: 0.25rem;
	}

	.btn-emoji {
		font-size: 1rem;
	}

	.new-chat-btn {
		padding: 0.5rem 1rem;
		background: #98fb98;
		color: #000;
		border: 2px solid #000;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 700;
		transition: all 0.2s;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		white-space: nowrap;
		box-shadow: 3px 3px 0 #000;
		display: flex;
		align-items: center;
		gap: 0.375rem;
		transform: rotate(0deg);
	}

	.new-chat-btn:hover {
		transform: translate(-2px, -2px) rotate(0deg);
		box-shadow: 5px 5px 0 #000;
		background: #ffd93d;
	}

	/* Responsive adjustments for the main page */
	@media (max-width: 600px) {
		.loading {
			align-items: stretch;
			margin: 1rem 0;
		}

		.new-chat-btn {
			padding: 0.375rem 0.75rem;
			font-size: 0.8125rem;
		}

		.decoration-1,
		.decoration-2 {
			display: none;
		}
	}

	@media (max-width: 400px) {
		.loading {
			margin: 0.5rem 0;
		}
	}
</style>
