<script lang="ts">
	// No props needed for this component
</script>

<div class="main-menu">
	<div class="menu-container">
		<header class="menu-header">
			<h1 class="main-title">
				<span class="title-line">Local AI Playground</span>
			</h1>
			<p class="subtitle">Private AI tools that run entirely in your browser</p>
		</header>

		<div class="feature-grid">
			<a href="/chat" class="feature-card chat-card">
				<div class="card-number">Tool #01</div>
				<div class="card-content">
					<div class="icon-container">
						<svg
							class="feature-icon"
							viewBox="0 0 24 24"
							width="48"
							height="48"
							stroke="currentColor"
							stroke-width="2.5"
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
						<span class="highlight">Private & Secure</span>
						<span class="highlight">Works Offline</span>
						<span class="highlight">No Data Sharing</span>
					</div>
				</div>
			</a>

			<a href="/transcribe" class="feature-card transcribe-card">
				<div class="card-number">Tool #02</div>
				<div class="card-content">
					<div class="icon-container">
						<svg
							class="feature-icon"
							viewBox="0 0 24 24"
							width="48"
							height="48"
							stroke="currentColor"
							stroke-width="2.5"
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
						<span class="highlight">High Accuracy</span>
						<span class="highlight">Multiple Formats</span>
						<span class="highlight">Local Processing</span>
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
			'Space Grotesk',
			system-ui,
			-apple-system,
			sans-serif;
		font-size: 16px;
		line-height: 1.5;
		background: linear-gradient(135deg, #ffe5b4 0%, #e6e6fa 50%, #b4e7ce 100%);
		background-size: 200% 200%;
		animation: gradient-shift 20s ease infinite;
		color: #000;
		overflow-x: hidden;
	}

	@keyframes gradient-shift {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}

	.main-menu {
		margin-top: 1rem;
		min-height: 100vh;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding: 1rem 1rem 2rem;
		box-sizing: border-box;
		position: relative;
		z-index: 2;
	}

	.menu-container {
		width: 100%;
		max-width: 1000px;
		margin: 0 auto;
	}

	.menu-header {
		text-align: center;
		margin-bottom: 2rem;
		animation: fadeIn 0.6s ease-out;
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

	.main-title {
		font-size: 3.5rem;
		line-height: 1.1;
		margin: 0 0 1.5rem 0;
		font-weight: 800;
	}

	.title-line {
		background: #000;
		color: #ffd700;
		padding: 0.5rem 2rem;
		display: inline-block;
		border: 3px solid #000;
		box-shadow: 5px 5px 0 #000;
		letter-spacing: 2px;
		text-transform: uppercase;
	}

	.subtitle {
		font-size: 1.25rem;
		color: #000;
		margin: 0;
		font-weight: 500;
		background: #fff;
		display: inline-block;
		padding: 0.5rem 1.5rem;
		border: 2px solid #000;
		box-shadow: 3px 3px 0 #000;
	}

	.feature-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		gap: 2rem;
		margin-bottom: 3rem;
		padding: 0 1rem;
	}

	.feature-card {
		display: block;
		text-decoration: none;
		color: #000;
		background: #fff;
		border: 3px solid #000;
		padding: 0;
		box-shadow: 5px 5px 0 #000;
		transition: all 0.2s ease;
		position: relative;
		overflow: hidden;
		border-radius: 12px;
		animation: cardFade 0.6s ease-out;
		animation-fill-mode: both;
	}

	.feature-card:nth-child(1) {
		animation-delay: 0.2s;
	}

	.feature-card:nth-child(2) {
		animation-delay: 0.3s;
	}

	@keyframes cardFade {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.card-number {
		position: absolute;
		top: 1rem;
		right: 1rem;
		background: #000;
		color: #ffd700;
		padding: 0.25rem 0.75rem;
		font-weight: 700;
		font-size: 0.875rem;
		letter-spacing: 1px;
		border-radius: 4px;
		text-transform: uppercase;
	}

	.feature-card:hover {
		transform: translate(-3px, -3px);
		box-shadow: 8px 8px 0 #000;
	}

	.card-content {
		padding: 2rem;
	}

	.icon-container {
		margin-bottom: 1.5rem;
		width: fit-content;
		padding: 0.75rem;
		background: #ffe5b4;
		border: 2px solid #000;
		border-radius: 8px;
	}

	.feature-icon {
		color: #000;
		display: block;
	}

	.feature-card h2 {
		font-size: 1.75rem;
		font-weight: 700;
		margin: 0 0 1rem 0;
		color: #000;
	}

	.feature-description {
		font-size: 1rem;
		color: #333;
		line-height: 1.6;
		margin: 0 0 1.5rem 0;
	}

	.feature-highlights {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.highlight {
		font-size: 0.875rem;
		color: #000;
		padding: 0.375rem 0.75rem;
		background: #f0f0f0;
		border: 2px solid #000;
		font-weight: 600;
		border-radius: 4px;
		transition: all 0.2s ease;
	}

	.chat-card:hover .highlight {
		background: #ffe5b4;
	}

	.transcribe-card:hover .highlight {
		background: #b4e7ce;
	}

	.menu-footer {
		text-align: center;
		color: #666;
		font-size: 0.9375rem;
		margin-top: 3rem;
		animation: fadeIn 0.6s ease-out;
		animation-delay: 0.5s;
		animation-fill-mode: both;
	}

	.menu-footer p {
		margin: 0.5rem 0;
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.main-menu {
			padding: 1.5rem 1rem;
		}

		.main-title {
			font-size: 2.5rem;
		}

		.title-line {
			padding: 0.375rem 1.25rem;
			font-size: 2rem;
		}

		.subtitle {
			font-size: 1.125rem;
			padding: 0.375rem 1rem;
		}

		.feature-grid {
			grid-template-columns: 1fr;
			gap: 1.5rem;
			padding: 0;
		}

		.feature-card h2 {
			font-size: 1.5rem;
		}
	}

	@media (max-width: 480px) {
		.main-title {
			font-size: 2rem;
		}

		.card-content {
			padding: 1.5rem;
		}

		.feature-highlights {
			gap: 0.375rem;
		}

		.highlight {
			font-size: 0.8125rem;
			padding: 0.25rem 0.5rem;
		}
	}
</style>
