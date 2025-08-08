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
	let chatMessagesComponent: ChatMessages | undefined;
	let messageInputComponent: MessageInput | undefined;

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
				previousProgress={previousProgress}
				message="This will take a couple of minutes. The chat model is being downloaded to your browser."
			/>
		{:else}
			<ModelSelector
				bind:modelSelection
				onLoadModel={loadModel}
				{isLoading}
			/>
		{/if}
	</div>
{:else}
	<div class="card-interface">
		<div class="toolbar">
			<span class="model-info">Model: {selectedModel.name}</span>
			<button onclick={newChat} class="new-chat-btn">
				New Chat
			</button>
		</div>

		<ChatMessages
			bind:this={chatMessagesComponent}
			messages={$messages}
			{isGenerating}
		/>

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

	.new-chat-btn {
		padding: 0.5rem 1rem;
		background: #000;
		color: #FFF;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 600;
		transition: all 0.2s;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-family: 'Space Grotesk', system-ui, sans-serif;
	}

	.new-chat-btn:hover {
		transform: translateY(-1px);
		box-shadow: 0 2px 4px rgba(0,0,0,0.2);
	}

	/* Responsive adjustments for the main page */
	@media (max-width: 600px) {
		.loading {
			align-items: stretch;
		}

		.new-chat-btn {
			padding: 0.375rem 0.75rem;
			font-size: 0.8125rem;
		}
	}
</style>
