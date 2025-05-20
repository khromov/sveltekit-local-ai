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
	let chatContainer: HTMLElement | undefined = $state();
	let inputElement: HTMLTextAreaElement | undefined = $state();
	
	// Screen wake lock state
	let wakeLock: WakeLockSentinel | null = $state(null);

	// Request a screen wake lock to keep screen on during text generation
	async function requestWakeLock() {
		try {
			if ('wakeLock' in navigator && navigator.wakeLock) {
				// Release any existing wake lock
				if (wakeLock) {
					await wakeLock.release();
					wakeLock = null;
				}
				
				// Request a new wake lock
				wakeLock = await navigator.wakeLock.request('screen');
				console.log('Wake lock acquired');
				
				// Add event listener for when wake lock is released
				wakeLock.addEventListener('release', () => {
					console.log('Wake lock released');
					wakeLock = null;
				});
			}
		} catch (err) {
			console.error('Could not acquire wake lock:', err);
			wakeLock = null;
		}
	}

	// Release any active wake lock
	async function releaseWakeLock() {
		if (wakeLock) {
			try {
				await wakeLock.release();
				wakeLock = null;
				console.log('Wake lock released');
			} catch (err) {
				console.error('Error releasing wake lock:', err);
			}
		}
	}

	// Handle visibility change events to reacquire wake lock if needed
	function handleVisibilityChange() {
		if (document.visibilityState === 'visible' && isGenerating && !wakeLock) {
			requestWakeLock();
		}
	}

	// Set up event listeners
	onMount(() => {
		// Set up visibility change listener to handle wake lock when tab becomes visible
		document.addEventListener('visibilitychange', handleVisibilityChange);
		
		return () => {
			// Clean up
			document.removeEventListener('visibilitychange', handleVisibilityChange);
			releaseWakeLock();
		};
	});

	// Scroll to the bottom of the chat
	function scrollToBottom() {
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
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
			
			// Release wake lock when generation is complete
			await releaseWakeLock();

			// Focus the input field when generation is complete
			if (inputElement) {
				setTimeout(() => {
					if (inputElement) {
						inputElement.focus();
					}
				}, 10);
			}
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
		if (inputElement) {
			setTimeout(() => {
				inputElement.focus();
			}, 10);
		}
	}

	function focusAfterMount(node: HTMLTextAreaElement) {
		if (node && !node.disabled) {
			node.focus();
		}
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
		if (isModelLoaded && inputElement) {
			setTimeout(() => {
				inputElement.focus();
			}, 100);
		}
	});
</script>

{#if !isModelLoaded}
	<div class="loading">
		{#if downloadError}
			<div class="error">
				<p>Failed to load model. Please check your connection and try again.</p>
				<button onclick={loadModel} disabled={isLoading}>
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
					This will take a couple of minutes. The chat model is being downloaded to your browser.
				</p>
			</div>
		{:else}
			<div class="model-selector">
				<h2>On-device, local chat in your web browser. Select a model to start.</h2>

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
						<span>Threads <span class="param-hint">(-1 for auto)</span></span>
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
				<button onclick={loadModel} class="primary-button">Load Model</button>
				<p class="model-note">Model will be downloaded and run locally in your browser</p>
			</div>
		{/if}
	</div>
{:else}
	<div class="card-interface">
		<div class="toolbar">
			<span class="model-info">Model: {selectedModel.name}</span>
			<button onclick={newChat} class="new-chat-btn">New Chat</button>
		</div>

		<div bind:this={chatContainer} class="chat-messages content-area" id="chat-container">
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
				<button onclick={stopGeneration} class="stop-btn">Stop Generation</button>
			{/if}

			<div class="message-input" class:is-disabled={isGenerating}>
				<textarea
					bind:this={inputElement}
					bind:value={inputText}
					placeholder="Message"
					rows="1"
					disabled={isGenerating}
					use:focusAfterMount
					onkeydown={(e) => {
						if (e.key === 'Enter' && !e.shiftKey) {
							e.preventDefault();
							sendMessage();
						}
					}}
				></textarea>
				<button
					onclick={sendMessage}
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

<style>
	/* Model selector styling */
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
		margin: 0 auto;
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

	.download-percentage {
		font-size: 1.125rem;
		font-weight: 500;
		color: #0071e3;
		margin: 0;
	}

	/* Chat specific styling */
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

	.chat-messages {
		height: clamp(350px, calc(100vh - 250px), 600px);
		overflow-y: auto;
		max-height: calc(100vh - 250px);
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

	.message-input {
		display: flex;
		align-items: flex-end;
		background-color: #f0f0f0;
		border-radius: 18px;
		padding: 0.625rem 1.125rem 0.625rem 0.875rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		position: relative;
		transition: background-color 0.2s;
		margin-bottom: 0.5rem;
	}

	.message-input.is-disabled {
		background-color: #dfdfdf;
	}

	.message-input.is-disabled textarea {
		color: #777;
		cursor: not-allowed;
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
		min-height: 20px; /* Lower start height */
		max-height: 120px;
		outline: none;
		width: calc(100% - 50px); /* Make room for the send button */
		transition: color 0.2s;
		overflow: hidden; /* Hide scrollbar */
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
		display: block;
		margin: 0 auto 0.75rem;
		transition: background-color 0.2s;
	}

	.stop-btn:hover {
		background-color: #e0352b;
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

	/* Responsive adjustments for the main page */
	@media (max-width: 600px) {
		.message {
			max-width: 90%;
		}

		.chat-messages {
			height: clamp(250px, calc(100vh - 220px), 400px);
			max-height: calc(100vh - 220px);
		}
	}
</style>
