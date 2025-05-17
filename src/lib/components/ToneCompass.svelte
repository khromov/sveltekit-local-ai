<script lang="ts">
	export let message: string;
	export let isGenerating: boolean;
	export let direction: string;
	export let originalMessage: string;
	export let errorMessage: string;
	export let adjustTone: (dir: 'up' | 'down' | 'left' | 'right') => Promise<void>;
	export let resetMessage: () => void;
</script>

<div class="compass-container">
	<div class="compass-grid">
		<!-- Empty top-left cell -->
		<div class="grid-cell"></div>

		<!-- Up Button -->
		<div class="grid-cell up-cell">
			<button
				class="compass-btn up-btn"
				onclick={() => adjustTone('up')}
				disabled={isGenerating || !message.trim()}
			>
				{#if isGenerating && direction === 'up'}
					<div class="loading-dots">
						<span></span><span></span><span></span>
					</div>
				{:else}
					<span>Formal</span>
				{/if}
			</button>
		</div>

		<!-- Empty top-right cell -->
		<div class="grid-cell"></div>

		<!-- Left Button -->
		<div class="grid-cell left-cell">
			<button
				class="compass-btn left-btn"
				onclick={() => adjustTone('left')}
				disabled={isGenerating || !message.trim()}
			>
				{#if isGenerating && direction === 'left'}
					<div class="loading-dots">
						<span></span><span></span><span></span>
					</div>
				{:else}
					<span>Concise</span>
				{/if}
			</button>
		</div>

		<!-- Center Message Box -->
		<div class="grid-cell center-cell">
			<div class="message-container">
				<textarea
					bind:value={message}
					placeholder="Enter your message here or select a preset above"
					disabled={isGenerating}
				></textarea>
				{#if originalMessage}
					<button onclick={resetMessage} class="reset-btn" disabled={isGenerating}> Reset </button>
				{/if}
				{#if errorMessage}
					<div class="error-message">{errorMessage}</div>
				{/if}
			</div>
		</div>

		<!-- Right Button -->
		<div class="grid-cell right-cell">
			<button
				class="compass-btn right-btn"
				onclick={() => adjustTone('right')}
				disabled={isGenerating || !message.trim()}
			>
				{#if isGenerating && direction === 'right'}
					<div class="loading-dots">
						<span></span><span></span><span></span>
					</div>
				{:else}
					<span>Elaborate</span>
				{/if}
			</button>
		</div>

		<!-- Empty bottom-left cell -->
		<div class="grid-cell"></div>

		<!-- Down Button -->
		<div class="grid-cell down-cell">
			<button
				class="compass-btn down-btn"
				onclick={() => adjustTone('down')}
				disabled={isGenerating || !message.trim()}
			>
				{#if isGenerating && direction === 'down'}
					<div class="loading-dots">
						<span></span><span></span><span></span>
					</div>
				{:else}
					<span>Casual</span>
				{/if}
			</button>
		</div>

		<!-- Empty bottom-right cell -->
		<div class="grid-cell"></div>
	</div>
</div>

<style>
	.compass-container {
		width: 100%;
		margin: 1rem 0;
		display: flex;
		justify-content: center;
	}

	.compass-grid {
		display: grid;
		grid-template-columns: minmax(80px, 1fr) minmax(300px, 3fr) minmax(80px, 1fr);
		grid-template-rows: auto auto auto;
		gap: 1rem;
		width: 100%;
		max-width: 800px; /* Increased from 550px */
		margin: 0 auto;
	}

	.grid-cell {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.up-cell {
		grid-row: 1;
		grid-column: 2;
	}

	.left-cell {
		grid-row: 2;
		grid-column: 1;
		justify-content: flex-end; /* Push button to the right edge of the cell */
		padding-right: 10px;
	}

	.center-cell {
		grid-row: 2;
		grid-column: 2;
		padding: 0 10px; /* Add some horizontal padding */
	}

	.right-cell {
		grid-row: 2;
		grid-column: 3;
		justify-content: flex-start; /* Push button to the left edge of the cell */
		padding-left: 10px;
	}

	.down-cell {
		grid-row: 3;
		grid-column: 2;
	}

	.message-container {
		position: relative;
		width: 100%;
	}

	textarea {
		width: 100%;
		height: 120px;
		padding: 1rem;
		border-radius: 16px;
		border: 3px solid #78c2ad;
		background-color: #ffffff;
		font-family: 'Nunito', sans-serif;
		font-size: 1rem;
		line-height: 1.5;
		resize: none;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		transition: all 0.2s;
		color: #5b5b5b;
		box-sizing: border-box;
	}

	textarea:focus {
		outline: none;
		border-color: #5c8d89;
		box-shadow: 0 4px 12px rgba(92, 141, 137, 0.3);
	}

	.compass-btn {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		border: none;
		color: white;
		font-family: 'Nunito', sans-serif;
		font-size: 0.9rem;
		font-weight: bold;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	}

	.compass-btn:hover:not(:disabled) {
		transform: scale(1.1);
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
	}

	.compass-btn:active:not(:disabled) {
		transform: scale(0.95);
	}

	.compass-btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.up-btn {
		background-color: #4e7a76;
	}

	.down-btn {
		background-color: #f8a978;
	}

	.left-btn {
		background-color: #f5c2c1;
	}

	.right-btn {
		background-color: #a0d2db;
	}

	.reset-btn {
		position: absolute;
		bottom: -15px;
		left: 50%;
		transform: translateX(-50%);
		background-color: #ffe4e1;
		color: #5b5b5b;
		border: 2px solid #f5c2c1;
		border-radius: 12px;
		padding: 0.4rem 1rem;
		font-size: 0.9rem;
		cursor: pointer;
		transition: all 0.2s;
		font-family: 'Nunito', sans-serif;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		white-space: nowrap;
	}

	.reset-btn:hover:not(:disabled) {
		background-color: #f5c2c1;
		transform: translateX(-50%) translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	.reset-btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.error-message {
		color: #e57373;
		font-size: 0.9rem;
		text-align: center;
		margin-top: 0.5rem;
	}

	/* Loading Animation */
	.loading-dots {
		display: flex;
		gap: 4px;
		align-items: center;
		justify-content: center;
	}

	.loading-dots span {
		width: 8px;
		height: 8px;
		background-color: white;
		border-radius: 50%;
		display: inline-block;
		animation: bounce 1.4s infinite ease-in-out both;
	}

	.loading-dots span:nth-child(1) {
		animation-delay: -0.32s;
	}

	.loading-dots span:nth-child(2) {
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

	/* Responsive styles */
	@media (max-width: 768px) {
		.compass-grid {
			grid-template-columns: minmax(70px, 1fr) minmax(200px, 2fr) minmax(70px, 1fr);
			gap: 0.75rem;
		}

		.compass-btn {
			width: 70px;
			height: 70px;
			font-size: 0.8rem;
		}

		textarea {
			height: 100px;
		}
	}

	@media (max-width: 500px) {
		.compass-grid {
			grid-template-columns: 1fr;
			grid-template-rows: auto auto auto auto auto;
			gap: 0.75rem;
		}

		.up-cell {
			grid-row: 1;
			grid-column: 1;
		}

		.center-cell {
			grid-row: 3;
			grid-column: 1;
			margin: 0.75rem 0;
			padding: 0;
		}

		.left-cell {
			grid-row: 2;
			grid-column: 1;
			justify-content: center;
			padding-right: 0;
		}

		.right-cell {
			grid-row: 4;
			grid-column: 1;
			justify-content: center;
			padding-left: 0;
		}

		.down-cell {
			grid-row: 5;
			grid-column: 1;
		}
	}
</style>
