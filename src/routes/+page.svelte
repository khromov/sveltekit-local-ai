<script lang="ts">
	import { Wllama, type DownloadProgressCallback } from '@wllama/wllama';
	import { onMount } from 'svelte';
	import { Template } from '@huggingface/jinja';
	import {
		WLLAMA_CONFIG_PATHS,
		DEFAULT_INFERENCE_PARAMS,
		DEFAULT_CHAT_TEMPLATE,
		AVAILABLE_MODELS,
		formatFileSize,
		type Message
	} from '$lib/wllama-config';

	import { chat, inferenceParams } from '$lib/stores';

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
	let messages: Message[] = $chat || [];
	let stopSignal = false;

	let params = $inferenceParams || DEFAULT_INFERENCE_PARAMS;

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
				n_threads: params.nThreads > 0 ? params.nThreads : undefined,
				n_ctx: params.nContext,
				n_batch: params.nBatch
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

		messages = [...messages, userMessage];

		// Add empty assistant message
		const assistantMessage: Message = {
			role: 'assistant',
			content: ''
		};

		messages = [...messages, assistantMessage];
		$chat = messages;

		inputText = '';
		isGenerating = true;
		stopSignal = false;

		try {
			// Format chat history for the model
			let formattedChat = await formatChatHistory(messages.slice(0, -1));
			console.log('Formatted chat:', formattedChat);

			// Generate completion
			await wllama.createCompletion(formattedChat, {
				nPredict: params.nPredict,
				sampling: {
					temp: params.temperature
				},
				onNewToken: (token, piece, currentText, optionals) => {
					// Update the last message with the current generated text
					messages[messages.length - 1].content = currentText;
					messages = [...messages];

					// If stop requested, abort generation
					if (stopSignal) {
						optionals.abortSignal();
					}
				}
			});

			// Save messages to storage
			$chat = messages;
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
		messages = [];
		//WllamaStorage.save('chat_messages', messages);
	}

	// Update inference parameters
	function updateParams() {
		$inferenceParams = params;
	}

	// Initialize on component mount
	onMount(() => {
		if (messages.length === 0) {
			// Add a system message for first-time users
			messages = [
				{
					role: 'system',
					content:
						"You are a helpful AI assistant. Answer the user's questions concisely and accurately."
				}
			];
			//WllamaStorage.save('chat_messages', messages);
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
							<input
								type="number"
								bind:value={params.nThreads}
								min="-1"
								max="32"
								on:change={updateParams}
							/>
						</label>
						<label>
							Context Size:
							<input
								type="number"
								bind:value={params.nContext}
								min="512"
								max="8192"
								on:change={updateParams}
							/>
						</label>
						<label>
							Temperature:
							<input
								type="number"
								bind:value={params.temperature}
								min="0"
								max="2"
								step="0.1"
								on:change={updateParams}
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
				<span>Model: {selectedModel.name}</span>
				<button on:click={newChat} class="new-chat-btn">New Chat</button>
			</div>

			<div class="chat-messages" id="chat-container">
				{#each messages as message, i}
					{#if message.role !== 'system'}
						<div class="message {message.role}-message">
							<div class="message-content">
								{#if message.role === 'assistant' && message.content === '' && isGenerating && i === messages.length - 1}
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
						placeholder="Type your message here..."
						rows="3"
						disabled={isGenerating}
						on:keydown={(e) => {
							if (e.key === 'Enter' && !e.shiftKey) {
								e.preventDefault();
								sendMessage();
							}
						}}
					></textarea>
					<button on:click={sendMessage} disabled={isGenerating || !inputText.trim()}>Send</button>
				</div>

				<div class="disclaimer">
					Wllama is running locally in your browser. Model responses may not always be accurate.
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 900px;
		margin: 0 auto;
		padding: 1rem;
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
	}

	h1 {
		text-align: center;
		margin-bottom: 1.5rem;
	}

	.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		margin: 2rem 0;
	}

	.model-selector {
		width: 100%;
		max-width: 500px;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1.5rem;
		border-radius: 8px;
		background-color: #f5f5f5;
	}

	.model-selector select {
		padding: 0.5rem;
		border-radius: 4px;
		border: 1px solid #ccc;
	}

	.model-selector button {
		padding: 0.75rem;
		background-color: #4caf50;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1rem;
	}

	.inference-params {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin: 1rem 0;
	}

	.chat-interface {
		display: flex;
		flex-direction: column;
		height: calc(100vh - 6rem);
		border-radius: 8px;
		overflow: hidden;
		border: 1px solid #ddd;
	}

	.toolbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 1rem;
		background-color: #f5f5f5;
		border-bottom: 1px solid #ddd;
	}

	.new-chat-btn {
		padding: 0.4rem 0.75rem;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	.chat-messages {
		flex-grow: 1;
		overflow-y: auto;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.message {
		display: flex;
		margin-bottom: 1rem;
	}

	.user-message {
		justify-content: flex-end;
	}

	.assistant-message {
		justify-content: flex-start;
	}

	.message-content {
		padding: 0.75rem 1rem;
		border-radius: 8px;
		max-width: 80%;
		white-space: pre-wrap;
	}

	.user-message .message-content {
		background-color: #007bff;
		color: white;
	}

	.assistant-message .message-content {
		background-color: #f0f0f0;
		color: #333;
	}

	.input-area {
		padding: 1rem;
		border-top: 1px solid #ddd;
		background-color: #f5f5f5;
	}

	.message-input {
		display: flex;
		gap: 0.5rem;
	}

	textarea {
		flex-grow: 1;
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		resize: none;
		font-family: inherit;
	}

	.message-input button {
		padding: 0 1rem;
		background-color: #4caf50;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	button:disabled {
		background-color: #cccccc;
		cursor: not-allowed;
	}

	.stop-btn {
		margin-bottom: 0.5rem;
		padding: 0.5rem 1rem;
		background-color: #dc3545;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	.disclaimer {
		margin-top: 0.5rem;
		font-size: 0.8rem;
		color: #666;
		text-align: center;
	}

	.error {
		color: #721c24;
		background-color: #f8d7da;
		padding: 1rem;
		border-radius: 4px;
		text-align: center;
	}

	progress {
		width: 100%;
		height: 0.75rem;
	}

	.typing-indicator {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
	}

	.typing-indicator span {
		width: 0.5rem;
		height: 0.5rem;
		background-color: #888;
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
</style>
