<script lang="ts">
	// No props needed for this component
</script>

<div class="main-menu">
	<div class="menu-container">
		<header class="menu-header">
			<div class="title-decoration">
				<svg viewBox="0 0 200 60" width="200" height="60" class="organic-shape">
					<path
						d="M20,30 Q60,10 100,30 T180,30"
						stroke="var(--sage)"
						stroke-width="3"
						fill="none"
						opacity="0.4"
					/>
					<circle cx="50" cy="25" r="3" fill="var(--clay)" opacity="0.6" />
					<circle cx="120" cy="35" r="2" fill="var(--earth-dark)" opacity="0.5" />
					<circle cx="160" cy="20" r="2.5" fill="var(--sage)" opacity="0.7" />
				</svg>
			</div>
			<h1 class="main-title">
				<span class="title-line">Local AI Playground</span>
				<span class="title-subtitle">Crafted for Privacy</span>
			</h1>
			<p class="subtitle">
				Discover thoughtfully designed AI tools that run entirely in your browser. No data leaves
				your device—just pure, private intelligence at your fingertips.
			</p>
		</header>

		<div class="feature-grid">
			<a href="/chat" class="feature-card chat-card">
				<div class="card-organic-bg">
					<svg viewBox="0 0 100 100" width="100" height="100">
						<path
							d="M10,30 Q30,10 50,30 Q70,50 90,30 Q70,70 50,50 Q30,70 10,50 Z"
							fill="var(--sage)"
							opacity="0.1"
						/>
					</svg>
				</div>
				<div class="card-content">
					<div class="icon-container">
						<svg
							class="feature-icon"
							viewBox="0 0 24 24"
							width="32"
							height="32"
							stroke="currentColor"
							stroke-width="1.5"
							fill="none"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
						</svg>
					</div>
					<h2>Conversational AI</h2>
					<p class="feature-description">
						Engage with sophisticated language models like Gemma3 in natural conversation. Every
						word stays on your device, powered by WebAssembly and llama.cpp.
					</p>
					<div class="feature-highlights">
						<span class="highlight">Private by Design</span>
						<span class="highlight">Works Offline</span>
						<span class="highlight">No Tracking</span>
					</div>
				</div>
			</a>

			<a href="/transcribe" class="feature-card transcribe-card">
				<div class="card-organic-bg">
					<svg viewBox="0 0 100 100" width="100" height="100">
						<ellipse
							cx="50"
							cy="50"
							rx="35"
							ry="25"
							fill="var(--clay)"
							opacity="0.12"
							transform="rotate(15 50 50)"
						/>
					</svg>
				</div>
				<div class="card-content">
					<div class="icon-container">
						<svg
							class="feature-icon"
							viewBox="0 0 24 24"
							width="32"
							height="32"
							stroke="currentColor"
							stroke-width="1.5"
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
					<h2>Audio Transcription</h2>
					<p class="feature-description">
						Transform spoken words into text with Whisper AI. Upload audio files or record directly—
						all processing happens locally with remarkable accuracy.
					</p>
					<div class="feature-highlights">
						<span class="highlight">Studio Quality</span>
						<span class="highlight">Multiple Formats</span>
						<span class="highlight">Local Processing</span>
					</div>
				</div>
			</a>
		</div>

		<footer class="menu-footer">
			<div class="footer-decoration">
				<svg viewBox="0 0 300 20" width="300" height="20">
					<path
						d="M0,10 Q75,5 150,10 T300,10"
						stroke="var(--earth-medium)"
						stroke-width="1"
						fill="none"
						opacity="0.5"
					/>
					<circle cx="75" cy="10" r="1.5" fill="var(--sage)" opacity="0.6" />
					<circle cx="225" cy="10" r="1.5" fill="var(--clay)" opacity="0.6" />
				</svg>
			</div>
			<p>All processing happens locally using WebAssembly.</p>
			<p>Your data never leaves your browser—privacy by design.</p>
		</footer>
	</div>
</div>

<style>
	.main-menu {
		min-height: 100vh;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding: 2rem 1rem 3rem;
		box-sizing: border-box;
		position: relative;
		z-index: 2;
	}

	.menu-container {
		width: 100%;
		max-width: 1100px;
		margin: 0 auto;
	}

	.menu-header {
		text-align: center;
		margin-bottom: 3rem;
		animation: fadeIn 0.8s ease-out;
		position: relative;
	}

	.title-decoration {
		margin-bottom: 1rem;
		display: flex;
		justify-content: center;
	}

	.organic-shape {
		filter: drop-shadow(0 2px 4px rgba(139, 111, 71, 0.2));
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
		font-size: 3rem;
		line-height: 1.2;
		margin: 0 0 1rem 0;
		font-weight: 300;
		color: var(--text-primary);
	}

	.title-line {
		display: block;
		font-weight: 700;
		font-family: 'Bebas Neue', sans-serif;
		letter-spacing: 0.1em;
		margin-bottom: 0.5rem;
		background: linear-gradient(135deg, var(--mocha-mousse), var(--clay));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.title-subtitle {
		display: block;
		font-size: 1.2rem;
		font-weight: 400;
		color: var(--text-secondary);
		font-style: italic;
		letter-spacing: 0.03em;
	}

	.subtitle {
		font-size: 1.1rem;
		color: var(--text-secondary);
		margin: 0;
		font-weight: 400;
		max-width: 600px;
		margin: 0 auto;
		line-height: 1.6;
		letter-spacing: 0.01em;
	}

	.feature-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
		gap: 2.5rem;
		margin-bottom: 4rem;
		padding: 0 1rem;
	}

	.feature-card {
		display: block;
		text-decoration: none;
		color: var(--text-primary);
		background: rgba(245, 241, 235, 0.8);
		backdrop-filter: blur(15px);
		border: 1px solid var(--earth-medium);
		padding: 0;
		box-shadow:
			0 8px 32px rgba(139, 111, 71, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
		transition: all 0.4s ease;
		position: relative;
		overflow: hidden;
		border-radius: 1.5rem;
		animation: cardFade 0.8s ease-out;
		animation-fill-mode: both;
	}

	.feature-card:nth-child(1) {
		animation-delay: 0.2s;
	}

	.feature-card:nth-child(2) {
		animation-delay: 0.4s;
	}

	@keyframes cardFade {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.card-organic-bg {
		position: absolute;
		top: -20px;
		right: -20px;
		z-index: 0;
		opacity: 0.6;
	}

	.feature-card:hover {
		transform: translateY(-8px);
		box-shadow:
			0 16px 48px rgba(139, 111, 71, 0.25),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
	}

	.card-content {
		padding: 2.5rem;
		position: relative;
		z-index: 1;
	}

	.icon-container {
		margin-bottom: 1.5rem;
		width: fit-content;
		padding: 1rem;
		background: linear-gradient(135deg, var(--sage), var(--clay));
		border: 1px solid var(--earth-medium);
		border-radius: 1rem;
		box-shadow:
			0 4px 15px rgba(139, 111, 71, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.3);
	}

	.feature-icon {
		color: var(--cream);
		display: block;
		filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
	}

	.feature-card h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin: 0 0 1rem 0;
		color: var(--text-primary);
		letter-spacing: 0.02em;
	}

	.feature-description {
		font-size: 1rem;
		color: var(--text-secondary);
		line-height: 1.7;
		margin: 0 0 1.5rem 0;
		letter-spacing: 0.01em;
	}

	.feature-highlights {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.highlight {
		font-size: 0.85rem;
		color: var(--text-primary);
		padding: 0.5rem 1rem;
		background: rgba(167, 132, 106, 0.1);
		border: 1px solid var(--earth-medium);
		font-weight: 500;
		border-radius: 1.5rem;
		transition: all 0.3s ease;
		letter-spacing: 0.02em;
	}

	.chat-card:hover .highlight {
		background: rgba(156, 175, 136, 0.2);
		border-color: var(--sage);
	}

	.transcribe-card:hover .highlight {
		background: rgba(193, 154, 107, 0.2);
		border-color: var(--clay);
	}

	.menu-footer {
		text-align: center;
		color: var(--text-light);
		font-size: 0.95rem;
		margin-top: 4rem;
		animation: fadeIn 0.8s ease-out;
		animation-delay: 0.6s;
		animation-fill-mode: both;
		position: relative;
	}

	.footer-decoration {
		display: flex;
		justify-content: center;
		margin-bottom: 1rem;
	}

	.menu-footer p {
		margin: 0.5rem 0;
		font-weight: 400;
		letter-spacing: 0.01em;
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.main-menu {
			padding: 2rem 1rem;
		}

		.main-title {
			font-size: 2.5rem;
		}

		.title-line {
			font-size: 2.5rem;
		}

		.title-subtitle {
			font-size: 1rem;
		}

		.subtitle {
			font-size: 1rem;
			padding: 0 1rem;
		}

		.feature-grid {
			grid-template-columns: 1fr;
			gap: 2rem;
			padding: 0;
		}

		.feature-card h2 {
			font-size: 1.35rem;
		}

		.card-content {
			padding: 2rem;
		}
	}

	@media (max-width: 480px) {
		.main-title {
			font-size: 2rem;
		}

		.title-line {
			font-size: 2rem;
		}

		.card-content {
			padding: 1.5rem;
		}

		.feature-highlights {
			gap: 0.5rem;
		}

		.highlight {
			font-size: 0.8rem;
			padding: 0.4rem 0.8rem;
		}

		.title-decoration,
		.footer-decoration {
			display: none;
		}
	}
</style>
