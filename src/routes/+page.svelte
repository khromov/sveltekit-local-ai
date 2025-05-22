<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="main-menu">
	<div class="menu-container">
		<header class="menu-header">
			<h1>Local AI Chat</h1>
			<p class="subtitle">Private AI tools that run entirely in your browser</p>
		</header>

		<div class="feature-grid">
			<a href="/llama" class="feature-card chat-card">
				<div class="card-content">
					<div class="icon-container">
						<svg
							class="feature-icon"
							viewBox="0 0 24 24"
							width="48"
							height="48"
							stroke="currentColor"
							stroke-width="2"
							fill="none"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
						</svg>
					</div>
					<h2>Chat with AI</h2>
					<p class="feature-description">
						Have conversations with AI models that run completely offline. Your data never leaves
						your device.
					</p>
					<div class="feature-highlights">
						<span class="highlight">• Private & Secure</span>
						<span class="highlight">• Works Offline</span>
						<span class="highlight">• No Data Sharing</span>
					</div>
				</div>
			</a>

			<a href="/whisper" class="feature-card transcribe-card">
				<div class="card-content">
					<div class="icon-container">
						<svg
							class="feature-icon"
							viewBox="0 0 24 24"
							width="48"
							height="48"
							stroke="currentColor"
							stroke-width="2"
							fill="none"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
							<path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
							<line x1="12" y1="19" x2="12" y2="23"></line>
							<line x1="8" y1="23" x2="16" y2="23"></line>
						</svg>
					</div>
					<h2>Transcribe Audio</h2>
					<p class="feature-description">
						Convert speech to text using Whisper AI. Upload audio files or use the demo to see it in
						action.
					</p>
					<div class="feature-highlights">
						<span class="highlight">• High Accuracy</span>
						<span class="highlight">• Multiple Formats</span>
						<span class="highlight">• Local Processing</span>
					</div>
				</div>
			</a>
		</div>

		<footer class="menu-footer">
			<p>All processing happens locally in your browser using WebAssembly.</p>
			<p>No data is sent to external servers.</p>
		</footer>
	</div>
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

	.main-menu {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem 1rem;
		box-sizing: border-box;
	}

	.menu-container {
		width: 100%;
		max-width: 900px;
		margin: 0 auto;
	}

	.menu-header {
		text-align: center;
		margin-bottom: 3rem;
		animation: fadeInUp 0.6s ease-out;
	}

	.menu-header h1 {
		font-size: 3rem;
		font-weight: 700;
		margin: 0 0 1rem 0;
		color: #1a1a1a;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	.subtitle {
		font-size: 1.25rem;
		color: #666;
		margin: 0;
		font-weight: 400;
	}

	.feature-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		gap: 2rem;
		margin-bottom: 3rem;
	}

	.feature-card {
		display: block;
		text-decoration: none;
		color: inherit;
		background-color: white;
		border-radius: 20px;
		padding: 2rem;
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
		transition: all 0.3s ease;
		border: 2px solid transparent;
		animation: fadeInUp 0.6s ease-out;
		animation-delay: 0.2s;
		animation-fill-mode: both;
	}

	.feature-card:hover {
		transform: translateY(-8px);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
		border-color: #e5e5ea;
	}

	.chat-card:hover {
		border-color: #0071e3;
		box-shadow: 0 8px 32px rgba(0, 113, 227, 0.15);
	}

	.transcribe-card:hover {
		border-color: #28a745;
		box-shadow: 0 8px 32px rgba(40, 167, 69, 0.15);
	}

	.card-content {
		text-align: center;
	}

	.icon-container {
		margin-bottom: 1.5rem;
	}

	.feature-icon {
		color: #0071e3;
		margin: 0 auto;
		display: block;
	}

	.transcribe-card .feature-icon {
		color: #28a745;
	}

	.feature-card h2 {
		font-size: 1.75rem;
		font-weight: 600;
		margin: 0 0 1rem 0;
		color: #1a1a1a;
	}

	.feature-description {
		font-size: 1.125rem;
		color: #555;
		line-height: 1.6;
		margin: 0 0 1.5rem 0;
	}

	.feature-highlights {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-top: 1.5rem;
	}

	.highlight {
		font-size: 0.9375rem;
		color: #666;
		padding: 0.5rem 1rem;
		background-color: #f8f9fa;
		border-radius: 12px;
		border: 1px solid #e9ecef;
	}

	.chat-card:hover .highlight {
		background-color: #f0f4ff;
		border-color: #d4e5ff;
		color: #0056b3;
	}

	.transcribe-card:hover .highlight {
		background-color: #f0fff4;
		border-color: #c3e6cb;
		color: #155724;
	}

	.menu-footer {
		text-align: center;
		color: #8e8e93;
		font-size: 0.9375rem;
		animation: fadeInUp 0.6s ease-out;
		animation-delay: 0.4s;
		animation-fill-mode: both;
	}

	.menu-footer p {
		margin: 0.5rem 0;
	}

	/* Animations */
	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.main-menu {
			padding: 1.5rem 1rem;
		}

		.menu-header h1 {
			font-size: 2.25rem;
		}

		.subtitle {
			font-size: 1.125rem;
		}

		.feature-grid {
			grid-template-columns: 1fr;
			gap: 1.5rem;
			margin-bottom: 2rem;
		}

		.feature-card {
			padding: 1.5rem;
		}

		.feature-card h2 {
			font-size: 1.5rem;
		}

		.feature-description {
			font-size: 1rem;
		}

		.feature-highlights {
			margin-top: 1rem;
		}
	}

	@media (max-width: 480px) {
		.menu-header h1 {
			font-size: 1.875rem;
		}

		.feature-card {
			padding: 1.25rem;
		}

		.feature-highlights {
			gap: 0.375rem;
		}

		.highlight {
			font-size: 0.875rem;
			padding: 0.375rem 0.75rem;
		}
	}
</style>
