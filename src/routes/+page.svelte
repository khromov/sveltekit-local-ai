<script lang="ts">
	// No props needed for this component
</script>

<div class="main-menu">
	<div class="menu-container">
		<header class="menu-header">
			<h1 class="main-title">
				<span class="title-line">Local AI Playground</span>
			</h1>
			<p class="subtitle">
				On this page you'll find free, private AI tools that run entirely in your browser - and even
				offline!
			</p>
		</header>

		<div class="feature-grid">
			<a href="/chat" class="feature-card chat-card">
				<svg class="card-decoration" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
					<defs>
						<linearGradient id="leafGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
							<stop offset="0%" style="stop-color:rgba(82,121,82,0.1);stop-opacity:1" />
							<stop offset="100%" style="stop-color:rgba(107,142,107,0.05);stop-opacity:1" />
						</linearGradient>
					</defs>
					<path
						d="M20,80 Q40,20 80,30 Q120,40 150,15 Q170,10 190,25"
						stroke="url(#leafGradient1)"
						stroke-width="2"
						fill="none"
						opacity="0.6"
					/>
					<ellipse
						cx="35"
						cy="45"
						rx="8"
						ry="12"
						fill="url(#leafGradient1)"
						transform="rotate(45 35 45)"
						opacity="0.4"
					/>
					<ellipse
						cx="75"
						cy="60"
						rx="6"
						ry="10"
						fill="url(#leafGradient1)"
						transform="rotate(-30 75 60)"
						opacity="0.3"
					/>
					<ellipse
						cx="135"
						cy="40"
						rx="7"
						ry="11"
						fill="url(#leafGradient1)"
						transform="rotate(60 135 40)"
						opacity="0.35"
					/>
				</svg>
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
					<h2>Chat</h2>
					<p class="feature-description">
						Chat with Large Language Models like Gemma3, completely on-device thanks to llama.cpp
					</p>
					<div class="feature-highlights">
						<span class="highlight">Private & Secure</span>
						<span class="highlight">Works Offline</span>
						<span class="highlight">No Data Sharing</span>
					</div>
				</div>
			</a>

			<a href="/transcribe" class="feature-card transcribe-card">
				<svg class="card-decoration" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
					<defs>
						<linearGradient id="leafGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
							<stop offset="0%" style="stop-color:rgba(82,121,82,0.08);stop-opacity:1" />
							<stop offset="100%" style="stop-color:rgba(107,142,107,0.04);stop-opacity:1" />
						</linearGradient>
					</defs>
					<path
						d="M30,85 Q50,25 90,35 Q130,45 160,20"
						stroke="url(#leafGradient2)"
						stroke-width="2"
						fill="none"
						opacity="0.5"
					/>
					<circle cx="45" cy="50" r="5" fill="url(#leafGradient2)" opacity="0.3" />
					<circle cx="85" cy="65" r="4" fill="url(#leafGradient2)" opacity="0.25" />
					<circle cx="125" cy="45" r="6" fill="url(#leafGradient2)" opacity="0.3" />
					<path
						d="M170,30 Q175,35 180,30 Q185,25 190,30"
						stroke="url(#leafGradient2)"
						stroke-width="1.5"
						fill="none"
						opacity="0.4"
					/>
				</svg>
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
						Convert speech to text using Whisper AI. Upload any existing audio file and export as
						text or a subtitle file.
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
	/* Removed duplicate body styles - already handled in layout */

	.main-menu {
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
		line-height: 1.2;
		margin: 0 0 2rem 0;
		font-weight: 600;
		position: relative;
	}

	.title-line {
		background: linear-gradient(135deg, #527952 0%, #6b8e6b 100%);
		color: #ffffff;
		padding: 1rem 2rem;
		display: inline-block;
		border: 1px solid rgba(82, 121, 82, 0.3);
		box-shadow: 0 16px 64px rgba(82, 121, 82, 0.2);
		letter-spacing: 0.02em;
		text-transform: none;
		border-radius: 16px;
		position: relative;
		overflow: hidden;
	}

	.subtitle {
		font-size: 1.25rem;
		color: rgba(46, 74, 46, 0.8);
		margin: 0;
		font-weight: 400;
		background: rgba(255, 255, 255, 0.9);
		display: inline-block;
		padding: 0.75rem 2rem;
		border: 1px solid rgba(82, 121, 82, 0.2);
		box-shadow: 0 8px 32px rgba(82, 121, 82, 0.1);
		border-radius: 12px;
		backdrop-filter: blur(8px);
		line-height: 1.5;
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
		color: #2e4a2e;
		background: rgba(255, 255, 255, 0.95);
		border: 1px solid rgba(82, 121, 82, 0.2);
		padding: 0;
		box-shadow: 0 16px 64px rgba(82, 121, 82, 0.12);
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
		overflow: hidden;
		border-radius: 20px;
		animation: cardFade 0.8s ease-out;
		animation-fill-mode: both;
		backdrop-filter: blur(16px);
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
		top: 1.5rem;
		right: 1.5rem;
		background: linear-gradient(135deg, #527952 0%, #6b8e6b 100%);
		color: #ffffff;
		padding: 0.5rem 1rem;
		font-weight: 500;
		font-size: 0.8rem;
		letter-spacing: 0.02em;
		border-radius: 12px;
		text-transform: none;
		box-shadow: 0 4px 16px rgba(82, 121, 82, 0.25);
	}

	.feature-card:hover {
		transform: translateY(-8px);
		box-shadow: 0 24px 96px rgba(82, 121, 82, 0.2);
		border-color: rgba(82, 121, 82, 0.3);
	}

	.card-decoration {
		position: absolute;
		top: 0;
		right: 0;
		width: 200px;
		height: 100px;
		pointer-events: none;
		opacity: 0.6;
		transition: opacity 0.3s ease;
	}

	.feature-card:hover .card-decoration {
		opacity: 0.8;
	}

	.card-content {
		padding: 2rem;
		position: relative;
		z-index: 1;
	}

	.icon-container {
		margin-bottom: 2rem;
		width: fit-content;
		padding: 1rem;
		background: linear-gradient(135deg, rgba(82, 121, 82, 0.1) 0%, rgba(107, 142, 107, 0.15) 100%);
		border: 1px solid rgba(82, 121, 82, 0.2);
		border-radius: 16px;
		position: relative;
	}

	.feature-icon {
		color: #527952;
		display: block;
		filter: drop-shadow(0 2px 8px rgba(82, 121, 82, 0.2));
	}

	.feature-card h2 {
		font-size: 1.75rem;
		font-weight: 600;
		margin: 0 0 1.25rem 0;
		color: #2e4a2e;
		line-height: 1.3;
	}

	.feature-description {
		font-size: 1rem;
		color: rgba(46, 74, 46, 0.7);
		line-height: 1.6;
		margin: 0 0 2rem 0;
		font-weight: 400;
	}

	.feature-highlights {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.highlight {
		font-size: 0.8rem;
		color: #527952;
		padding: 0.5rem 1rem;
		background: rgba(82, 121, 82, 0.08);
		border: 1px solid rgba(82, 121, 82, 0.2);
		font-weight: 500;
		border-radius: 12px;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		white-space: nowrap;
	}

	.chat-card:hover .highlight,
	.transcribe-card:hover .highlight {
		background: rgba(82, 121, 82, 0.15);
		color: #2e4a2e;
		transform: translateY(-1px);
		box-shadow: 0 4px 16px rgba(82, 121, 82, 0.15);
	}

	.menu-footer {
		text-align: center;
		color: rgba(82, 121, 82, 0.6);
		font-size: 0.9rem;
		margin-top: 4rem;
		animation: fadeIn 0.8s ease-out;
		animation-delay: 0.6s;
		animation-fill-mode: both;
		font-weight: 400;
		line-height: 1.6;
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
