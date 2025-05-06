<script lang="ts">
	import { Wllama, type DownloadProgressCallback } from '@wllama/wllama';
	import { onMount } from 'svelte';
	import { Template } from '@huggingface/jinja';
	import {
		WLLAMA_CONFIG_PATHS,
		DEFAULT_CHAT_TEMPLATE,
		AVAILABLE_MODELS,
		formatFileSize,
		type Message
	} from '$lib/wllama-config';

	import { messages, inferenceParams } from '$lib/stores';

	// State variables
	let wllama: Wllama;
	let isLoading = false;
	let isModelLoaded = false;
	let isGenerating = false;
	let downloadProgress = 0;
	let downloadError = false;
	let modelSelection = AVAILABLE_MODELS[0].url;
	let selectedModel = AVAILABLE_MODELS[0];
	let inputText = '';
	let stopSignal = false;
	let chatContainer: HTMLElement;

	// Auto-scroll to bottom of chat when messages update
	$: if (chatContainer && $messages) {
		setTimeout(() => {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}, 0);
	}

	async function loadModel() {
		try {
			isLoading = true;
			downloadError = false;
			downloadProgress = 0;

			const model = AVAILABLE_MODELS.find((m) => m.url === modelSelection);
			if (model) {
				selectedModel = model;
			}

			wllama = new Wllama(WLLAMA_CONFIG_PATHS);

			const progressCallback: DownloadProgressCallback = ({ loaded, total }) => {
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

		// Add empty assistant message
		const assistantMessage: Message = {
			role: 'assistant',
			content: ''
		};

		$messages = [...$messages, assistantMessage];

		inputText = '';
		isGenerating = true;
		stopSignal = false;

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
				onNewToken: (token, piece, currentText, optionals) => {
					// Update the last message with the current generated text
					$messages[$messages.length - 1].content = currentText;
					$messages = [...$messages];

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
		}
	}

	// Function to stop text generation
	function stopGeneration() {
		stopSignal = true;
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
	});
</script>

<div class="container">
	<h1>Svelte + Wllama</h1>

	{#if !isModelLoaded}
		<div class="loading">
			{#if downloadError}
				<div class="error">
					<p>Failed to load model. Please check your connection and try again.</p>
					<button on:click={loadModel} disabled={isLoading}>
						{isLoading ? 'Reloading...' : 'Reload Model'}
					</button>
				</div>
			{:else if isLoading}
				<p>Loading model: {downloadProgress}%</p>
				<progress value={downloadProgress} max="100"></progress>
			{:else}
				<div class="model-selector">
					<h2>Select a model to get started</h2>
					<select bind:value={modelSelection}>
						{#each AVAILABLE_MODELS as model}
							<option value={model.url}>
								{model.name} ({formatFileSize(model.size)})
							</option>
						{/each}
					</select>
					<div class="inference-params">
						<h3>Inference Parameters</h3>
						<label>
							Threads (0 for auto):
							<input type="number" bind:value={$inferenceParams.nThreads} min="-1" max="32" />
						</label>
						<label>
							Context Size:
							<input type="number" bind:value={$inferenceParams.nContext} min="512" max="8192" />
						</label>
						<label>
							Temperature:
							<input
								type="number"
								bind:value={$inferenceParams.temperature}
								min="0"
								max="2"
								step="0.1"
							/>
						</label>
					</div>
					<button on:click={loadModel}>Load Model</button>
				</div>
			{/if}
		</div>
	{:else}
		<div class="chat-interface">
			<div class="toolbar">
				<span class="model-info">Model: {selectedModel.name}</span>
				<button on:click={newChat} class="new-chat-btn">New Chat</button>
			</div>

			<div bind:this={chatContainer} class="chat-messages" id="chat-container">
				{#each $messages as message, i}
					{#if message.role !== 'system'}
						<div class="message-wrapper {message.role}-wrapper">
							<div class="message {message.role}-message">
								<div class="message-content">
									{#if message.role === 'assistant' && message.content === '' && isGenerating && i === $messages.length - 1}
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
				{/each}
			</div>

			<div class="input-area">
				{#if isGenerating}
					<button on:click={stopGeneration} class="stop-btn">Stop Generation</button>
				{/if}

				<div class="message-input">
					<textarea
						bind:value={inputText}
						placeholder="Message"
						rows="1"
						disabled={isGenerating}
						on:keydown={(e) => {
							if (e.key === 'Enter' && !e.shiftKey) {
								e.preventDefault();
								sendMessage();
							}
						}}
						on:input={(e) => {
							const target = e.target as HTMLTextAreaElement;
							target.style.height = 'auto';
							target.style.height = Math.min(120, target.scrollHeight) + 'px';
						}}
					></textarea>
					<button
						on:click={sendMessage}
						disabled={isGenerating || !inputText.trim()}
						class="send-btn"
						aria-label="Send message"
					>
						<svg
							viewBox="0 0 24 24"
							width="24"
							height="24"
							stroke="currentColor"
							stroke-width="2"
							fill="none"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<line x1="22" y1="2" x2="11" y2="13"></line>
							<polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
						</svg>
					</button>
				</div>

				<div class="disclaimer">
					Wllama is running locally in your browser. Model responses may not always be accurate.
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	/* Base styles */
	:global(body) {
		margin: 0;
		padding: 0;
		font-family:
			-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
			'Helvetica Neue', sans-serif;
		font-size: 16px;
		line-height: 1.5;
		background-color: #f5f5f7;
		color: #333;
	}

	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 1rem;
	}

	h1 {
		text-align: center;
		margin-bottom: 1.5rem;
		font-size: 1.8rem;
		font-weight: 600;
	}

	/* Loading and Model Selection */
	.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		margin: 2rem 0;
	}

	.model-selector {
		width: 100%;
		max-width: 500px;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		padding: 1.75rem;
		border-radius: 16px;
		background-color: white;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
	}

	.model-selector h2 {
		font-size: 1.4rem;
		font-weight: 600;
		margin: 0;
	}

	.model-selector select {
		padding: 0.75rem;
		border-radius: 10px;
		border: 1px solid #ddd;
		font-size: 1rem;
		background-color: #f8f8f8;
	}

	.model-selector button {
		padding: 0.875rem;
		background-color: #0071e3;
		color: white;
		border: none;
		border-radius: 12px;
		cursor: pointer;
		font-size: 1.1rem;
		font-weight: 500;
		transition: background-color 0.2s;
	}

	.model-selector button:hover {
		background-color: #0062cc;
	}

	.inference-params {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin: 1rem 0;
		background-color: #f8f8f8;
		padding: 1rem;
		border-radius: 12px;
	}

	.inference-params h3 {
		font-size: 1.1rem;
		font-weight: 600;
		margin: 0 0 0.5rem 0;
	}

	.inference-params label {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		font-size: 1rem;
	}

	.inference-params input {
		padding: 0.625rem;
		border-radius: 8px;
		border: 1px solid #ddd;
		font-size: 1rem;
	}

	/* Chat Interface */
	.chat-interface {
		display: flex;
		flex-direction: column;
		height: calc(100vh - 6rem);
		border-radius: 16px;
		overflow: hidden;
		border: none;
		background-color: white;
		box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
	}

	.toolbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.25rem;
		background-color: #f8f8f8;
		border-bottom: 1px solid #e5e5e5;
	}

	.model-info {
		font-size: 1rem;
		font-weight: 500;
		color: #666;
	}

	.new-chat-btn {
		padding: 0.5rem 1rem;
		background-color: #0071e3;
		color: white;
		border: none;
		border-radius: 12px;
		cursor: pointer;
		font-size: 0.95rem;
		font-weight: 500;
		transition: background-color 0.2s;
	}

	.new-chat-btn:hover {
		background-color: #0062cc;
	}

	/* Chat Messages */
	.chat-messages {
		flex-grow: 1;
		overflow-y: auto;
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		background-color: #f5f5f7;
	}

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

	/* Input Area */
	.input-area {
		padding: 1rem 1.25rem;
		border-top: 1px solid #e5e5e5;
		background-color: white;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.message-input {
		display: flex;
		align-items: flex-end;
		gap: 0.75rem;
		background-color: #f0f0f0;
		border-radius: 18px;
		padding: 0.625rem 0.875rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	textarea {
		flex-grow: 1;
		padding: 0.625rem;
		border: none;
		border-radius: 12px;
		resize: none;
		font-family: inherit;
		font-size: 1.0625rem;
		line-height: 1.4;
		background-color: transparent;
		min-height: 24px;
		max-height: 120px;
		outline: none;
	}

	.send-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		background-color: #0071e3;
		color: white;
		border: none;
		border-radius: 50%;
		cursor: pointer;
		transition: background-color 0.2s;
		flex-shrink: 0;
		padding: 0;
	}

	.send-btn:hover {
		background-color: #0062cc;
	}

	.send-btn svg {
		width: 18px;
		height: 18px;
	}

	.send-btn:disabled {
		background-color: #b0b0b0;
		cursor: not-allowed;
	}

	.stop-btn {
		padding: 0.625rem 1rem;
		background-color: #ff3b30;
		color: white;
		border: none;
		border-radius: 12px;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 500;
		align-self: center;
		transition: background-color 0.2s;
	}

	.stop-btn:hover {
		background-color: #e0352b;
	}

	.disclaimer {
		margin-top: 0.375rem;
		font-size: 0.8125rem;
		color: #8e8e93;
		text-align: center;
	}

	.error {
		color: #ff3b30;
		background-color: #feeced;
		padding: 1.25rem;
		border-radius: 12px;
		text-align: center;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	progress {
		width: 100%;
		height: 0.5rem;
		border-radius: 4px;
		overflow: hidden;
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

	/* Responsive adjustments */
	@media (max-width: 600px) {
		.container {
			padding: 0.75rem;
		}

		h1 {
			font-size: 1.5rem;
			margin-bottom: 1rem;
		}

		.message-content {
			font-size: 1rem;
			padding: 0.75rem 1rem;
		}

		.message {
			max-width: 90%;
		}

		.chat-interface {
			height: calc(100vh - 5rem);
			border-radius: 12px;
		}
	}
</style>
