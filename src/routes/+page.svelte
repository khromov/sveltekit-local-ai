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
	let previousProgress = 0;
	let downloadError = false;
	let modelSelection = AVAILABLE_MODELS[0].url;
	let selectedModel = AVAILABLE_MODELS[0];
	let inputText = '';
	let stopSignal = false;
	let chatContainer: HTMLElement;
	let inputElement: HTMLTextAreaElement;

	// Scroll to the bottom of the chat
	function scrollToBottom() {
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	}

	// Focus the input field
	function focusInput() {
		if (inputElement && isModelLoaded && !isGenerating) {
			setTimeout(() => {
				inputElement.focus();
			}, 10);
		}
	}

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

			// Focus input after model loads
			focusInput();
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
		setTimeout(scrollToBottom, 0);

		// Add empty assistant message
		const assistantMessage: Message = {
			role: 'assistant',
			content: ''
		};

		$messages = [...$messages, assistantMessage];

		// Scroll to see empty assistant message with typing indicator
		setTimeout(scrollToBottom, 0);

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

					// Scroll to bottom with each new token when generating
					scrollToBottom();

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

			// Focus the input field when generation is complete
			focusInput();
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

		// Focus the input field after clearing chat
		focusInput();
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

	// Reset textarea height on input clear
	$: if (inputText === '') {
		if (inputElement) {
			inputElement.style.height = 'auto';
		}
	}
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
				<div class="loading-progress">
					<h3>Loading Model</h3>
					<p class="download-percentage">{downloadProgress}% Complete</p>
					<div class="progress-container">
						<div class="progress-bar">
							<div
								class="progress-bar-fill"
								style="width: {downloadProgress}%; transition: width {downloadProgress >
								previousProgress
									? '0.5s'
									: '0s'} ease"
							></div>
						</div>
					</div>
					<p class="loading-message">
						This might take a moment. The model is being downloaded to your browser.
					</p>
				</div>
			{:else}
				<div class="model-selector">
					<h2>Select a Model to Get Started</h2>
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
							<span>Threads <span class="param-hint">(0 for auto)</span></span>
							<input type="number" bind:value={$inferenceParams.nThreads} min="-1" max="32" />
						</label>
						<label>
							<span>Context Size</span>
							<input type="number" bind:value={$inferenceParams.nContext} min="512" max="8192" />
						</label>
						<label>
							<span>Temperature</span>
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
					<p class="model-note">Model will be downloaded and run locally in your browser</p>
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

				<div class="message-input" class:disabled={isGenerating}>
					<textarea
						bind:this={inputElement}
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
							// Reset height first to get accurate scrollHeight
							target.style.height = '24px';
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
		background: linear-gradient(to right, #0071e3, #42aaff);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		text-fill-color: transparent;
	}

	/* Loading and Model Selection */
	.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.75rem;
		margin: 2.5rem 0;
		animation: fadeIn 0.4s ease-out;
		width: 100%;
	}

	.loading-progress {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
		padding: 2.5rem;
		background-color: white;
		border-radius: 20px;
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
		width: 100%;
		max-width: 500px;
		text-align: center;
	}

	.loading-progress h3 {
		font-size: 1.5rem;
		font-weight: 600;
		margin: 0;
		color: #111;
	}

	.download-percentage {
		font-size: 1.125rem;
		font-weight: 500;
		color: #0071e3;
		margin: 0;
	}

	.progress-container {
		width: 100%;
		margin: 0.5rem 0;
	}

	.progress-bar {
		height: 0.6rem;
		background-color: #e1e1e1;
		border-radius: 8px;
		overflow: hidden;
		width: 100%;
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	.progress-bar-fill {
		height: 100%;
		background-color: #0071e3;
		border-radius: 8px;
		background-image: linear-gradient(
			45deg,
			rgba(255, 255, 255, 0.15) 25%,
			transparent 25%,
			transparent 50%,
			rgba(255, 255, 255, 0.15) 50%,
			rgba(255, 255, 255, 0.15) 75%,
			transparent 75%,
			transparent
		);
		background-size: 1rem 1rem;
		animation: progress-animation 1s linear infinite;
	}

	.loading-message {
		font-size: 0.9375rem;
		color: #666;
		margin: 0;
		max-width: 320px;
	}

	.model-note {
		font-size: 0.875rem;
		color: #777;
		text-align: center;
		margin-top: 0.5rem;
	}

	.param-hint {
		font-size: 0.875rem;
		color: #777;
		font-weight: normal;
	}

	.model-selector {
		width: 100%;
		max-width: 500px;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 2rem;
		border-radius: 20px;
		background-color: white;
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
	}

	.model-selector h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin: 0;
		color: #111;
		text-align: center;
	}

	.model-selector select {
		padding: 0.875rem;
		border-radius: 12px;
		border: 1px solid #e1e1e1;
		font-size: 1.0625rem;
		background-color: #f8f8f8;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
		appearance: none;
		background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
		background-repeat: no-repeat;
		background-position: right 0.875rem center;
		background-size: 1em;
		padding-right: 2.5rem;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}

	.model-selector select:focus {
		border-color: #0071e3;
		outline: none;
		box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.2);
	}

	.model-selector button {
		padding: 1rem;
		background-color: #0071e3;
		color: white;
		border: none;
		border-radius: 14px;
		cursor: pointer;
		font-size: 1.125rem;
		font-weight: 500;
		transition: all 0.2s;
		box-shadow: 0 2px 8px rgba(0, 113, 227, 0.3);
	}

	.model-selector button:hover {
		background-color: #0062cc;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(0, 113, 227, 0.4);
	}

	.model-selector button:active {
		transform: translateY(0);
		box-shadow: 0 1px 3px rgba(0, 113, 227, 0.3);
	}

	.inference-params {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin: 0.5rem 0;
		background-color: #f7f7f9;
		padding: 1.5rem;
		border-radius: 16px;
		box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
	}

	.inference-params h3 {
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0 0 0.75rem 0;
		color: #333;
		text-align: center;
	}

	.inference-params label {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		font-size: 1.0625rem;
		color: #444;
	}

	.inference-params input {
		padding: 0.75rem;
		border-radius: 10px;
		border: 1px solid #e1e1e1;
		font-size: 1.0625rem;
		background-color: white;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}

	.inference-params input:focus {
		border-color: #0071e3;
		outline: none;
		box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.2);
	}

	.error {
		color: #ff3b30;
		background-color: #feeced;
		padding: 1.5rem;
		border-radius: 16px;
		text-align: center;
		box-shadow: 0 2px 12px rgba(255, 59, 48, 0.15);
		width: 100%;
		max-width: 500px;
		animation: errorPulse 2s infinite alternate;
	}

	.error p {
		font-size: 1.0625rem;
		margin-bottom: 1.25rem;
		line-height: 1.5;
	}

	.error button {
		padding: 0.875rem 1.5rem;
		background-color: #ff3b30;
		color: white;
		border: none;
		border-radius: 12px;
		cursor: pointer;
		font-size: 1.0625rem;
		font-weight: 500;
		transition: all 0.2s;
		box-shadow: 0 2px 8px rgba(255, 59, 48, 0.3);
	}

	.error button:hover {
		background-color: #e0352b;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(255, 59, 48, 0.4);
	}

	.error button:active {
		transform: translateY(0);
		box-shadow: 0 1px 3px rgba(255, 59, 48, 0.3);
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
		background-color: #f0f0f0;
		border-radius: 18px;
		padding: 0.625rem 1.125rem 0.625rem 0.875rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		position: relative;
		transition: background-color 0.2s;
	}

	.message-input.disabled {
		background-color: #e5e5e5;
		opacity: 0.8;
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
		width: calc(100% - 50px); /* Make room for the send button */
		transition: color 0.2s;
	}

	textarea:disabled {
		color: #777;
		cursor: not-allowed;
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
		padding: 0;
		position: absolute;
		right: 8px;
		bottom: 8px;
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

	/* Animations */
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

	@keyframes progress-animation {
		0% {
			background-position: 0 0;
		}
		100% {
			background-position: 1rem 0;
		}
	}

	@keyframes errorPulse {
		0% {
			box-shadow: 0 2px 12px rgba(255, 59, 48, 0.15);
		}
		100% {
			box-shadow: 0 2px 16px rgba(255, 59, 48, 0.3);
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

		.model-selector {
			padding: 1.5rem;
		}

		.inference-params {
			padding: 1.25rem;
		}

		.loading-progress {
			padding: 1.75rem;
		}
	}
</style>
