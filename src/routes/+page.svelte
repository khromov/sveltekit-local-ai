<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="main-menu">
	<div class="menu-container">
		<header class="menu-header">
			<div class="title-container">
				<h1 class="main-title">
					<span class="title-line-1">LOCAL</span>
					<span class="title-line-2">AI CHAT</span>
				</h1>
				<div class="title-decoration"></div>
			</div>
			<p class="subtitle">Private AI tools that run entirely in your browser</p>
			<div class="subtitle-underline"></div>
		</header>

		<div class="feature-grid">
			<a href="/llama" class="feature-card chat-card">
				<div class="card-number">01</div>
				<div class="card-content">
					<div class="icon-container">
						<div class="icon-bg"></div>
						<svg
							class="feature-icon"
							viewBox="0 0 24 24"
							width="48"
							height="48"
							stroke="currentColor"
							stroke-width="3"
							fill="none"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
						</svg>
					</div>
					<h2>CHAT WITH AI</h2>
					<p class="feature-description">
						Have conversations with AI models that run completely offline. Your data never leaves your device.
					</p>
					<div class="feature-highlights">
						<span class="highlight">→ PRIVATE & SECURE</span>
						<span class="highlight">→ WORKS OFFLINE</span>
						<span class="highlight">→ NO DATA SHARING</span>
					</div>
					<div class="card-arrow">→</div>
				</div>
			</a>

			<a href="/whisper" class="feature-card transcribe-card">
				<div class="card-number">02</div>
				<div class="card-content">
					<div class="icon-container">
						<div class="icon-bg"></div>
						<svg
							class="feature-icon"
							viewBox="0 0 24 24"
							width="48"
							height="48"
							stroke="currentColor"
							stroke-width="3"
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
					<h2>TRANSCRIBE AUDIO</h2>
					<p class="feature-description">
						Convert speech to text using Whisper AI. Upload audio files or use the demo to see it in action.
					</p>
					<div class="feature-highlights">
						<span class="highlight">→ HIGH ACCURACY</span>
						<span class="highlight">→ MULTIPLE FORMATS</span>
						<span class="highlight">→ LOCAL PROCESSING</span>
					</div>
					<div class="card-arrow">→</div>
				</div>
			</a>
		</div>

		<footer class="menu-footer">
			<div class="footer-badge">WEBASSEMBLY POWERED</div>
			<p>All processing happens locally in your browser</p>
			<p>No data is sent to external servers</p>
		</footer>
	</div>
</div>

<style>
	/* Base styles */
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: 'Space Grotesk', monospace;
		font-size: 16px;
		line-height: 1.5;
		background: linear-gradient(135deg, #FFD93D 0%, #FFB6C1 25%, #98FB98 50%, #87CEEB 75%, #DDA0DD 100%);
		background-size: 400% 400%;
		animation: gradient-shift 15s ease infinite;
		color: #000;
		overflow-x: hidden;
	}

	:global(body)::before {
		content: '';
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-image: 
			repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,0,0,.05) 35px, rgba(0,0,0,.05) 70px),
			repeating-linear-gradient(-45deg, transparent, transparent 35px, rgba(255,255,255,.03) 35px, rgba(255,255,255,.03) 70px);
		pointer-events: none;
		z-index: 1;
	}

	@keyframes gradient-shift {
		0% { background-position: 0% 50%; }
		50% { background-position: 100% 50%; }
		100% { background-position: 0% 50%; }
	}

	.main-menu {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem 1rem;
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
		margin-bottom: 4rem;
		animation: slideDown 0.6s ease-out;
		position: relative;
	}

	@keyframes slideDown {
		from {
			transform: translateY(-50px) rotate(-2deg);
			opacity: 0;
		}
		to {
			transform: translateY(0) rotate(0);
			opacity: 1;
		}
	}

	.title-container {
		position: relative;
		display: inline-block;
		margin-bottom: 2rem;
	}

	.main-title {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 5rem;
		line-height: 0.9;
		margin: 0;
		display: flex;
		flex-direction: column;
		transform: rotate(-2deg);
	}

	.title-line-1 {
		background: #000;
		color: #FFD93D;
		padding: 0.5rem 2rem;
		display: inline-block;
		border: 4px solid #000;
		box-shadow: 6px 6px 0 #FF69B4;
		margin-bottom: -4px;
		z-index: 2;
		position: relative;
		letter-spacing: 4px;
	}

	.title-line-2 {
		background: #FF69B4;
		color: #000;
		padding: 0.5rem 2rem;
		display: inline-block;
		border: 4px solid #000;
		box-shadow: 6px 6px 0 #98FB98;
		letter-spacing: 4px;
		transform: rotate(2deg);
	}

	.title-decoration {
		position: absolute;
		width: 100%;
		height: 100%;
		top: -10px;
		left: -10px;
		border: 3px dashed #000;
		border-radius: 50% 20% 30% 70% / 30% 70% 20% 50%;
		pointer-events: none;
		opacity: 0.3;
		transform: scale(1.2);
	}

	.subtitle {
		font-size: 1.375rem;
		color: #000;
		margin: 0;
		font-weight: 700;
		background: #98FB98;
		display: inline-block;
		padding: 0.75rem 2rem;
		border: 3px solid #000;
		box-shadow: 5px 5px 0 #000;
		transform: rotate(1deg);
		position: relative;
	}

	.subtitle-underline {
		width: 200px;
		height: 8px;
		background: repeating-linear-gradient(
			90deg,
			#000,
			#000 10px,
			transparent 10px,
			transparent 20px
		);
		margin: 1rem auto 0;
	}

	.feature-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
		gap: 3rem;
		margin-bottom: 4rem;
		padding: 0 1rem;
	}

	.feature-card {
		display: block;
		text-decoration: none;
		color: #000;
		background: #FFF;
		border: 4px solid #000;
		padding: 0;
		box-shadow: 8px 8px 0 #000;
		transition: all 0.15s ease;
		position: relative;
		overflow: hidden;
		animation: cardPop 0.6s ease-out;
		animation-delay: 0.2s;
		animation-fill-mode: both;
		transform: rotate(-1deg);
	}

	@keyframes cardPop {
		from {
			transform: scale(0.8) rotate(-5deg);
			opacity: 0;
		}
		to {
			transform: scale(1) rotate(-1deg);
			opacity: 1;
		}
	}

	.feature-card:nth-child(2) {
		animation-delay: 0.4s;
		transform: rotate(1deg);
	}

	.card-number {
		position: absolute;
		top: -2px;
		left: -2px;
		background: #000;
		color: #FFD93D;
		padding: 0.5rem 1.5rem;
		font-family: 'Bebas Neue', sans-serif;
		font-size: 2rem;
		letter-spacing: 2px;
		border-right: 4px solid #000;
		border-bottom: 4px solid #000;
		z-index: 10;
	}

	.feature-card:hover {
		transform: translate(-5px, -5px) rotate(0deg);
		box-shadow: 13px 13px 0 #000;
	}

	.chat-card {
		background: linear-gradient(135deg, #FFF 60%, rgba(255, 217, 61, 0.2) 100%);
	}

	.transcribe-card {
		background: linear-gradient(135deg, #FFF 60%, rgba(152, 251, 152, 0.2) 100%);
	}

	.card-content {
		padding: 3rem 2rem 2rem;
		text-align: left;
		position: relative;
	}

	.icon-container {
		margin-bottom: 2rem;
		position: relative;
		width: fit-content;
	}

	.icon-bg {
		position: absolute;
		width: 80px;
		height: 80px;
		background: #FFD93D;
		border: 3px solid #000;
		top: -10px;
		left: -10px;
		border-radius: 30% 70% 70% 30% / 60% 40% 60% 40%;
		transform: rotate(15deg);
	}

	.transcribe-card .icon-bg {
		background: #98FB98;
	}

	.feature-icon {
		color: #000;
		display: block;
		position: relative;
		z-index: 2;
		background: #FFF;
		padding: 10px;
		border: 3px solid #000;
		box-shadow: 4px 4px 0 #000;
	}

	.feature-card h2 {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 2.5rem;
		font-weight: 400;
		margin: 0 0 1rem 0;
		color: #000;
		letter-spacing: 2px;
		position: relative;
	}

	.feature-card h2::after {
		content: '';
		position: absolute;
		bottom: -5px;
		left: 0;
		width: 60px;
		height: 4px;
		background: #000;
	}

	.feature-description {
		font-size: 1.125rem;
		color: #000;
		line-height: 1.6;
		margin: 0 0 2rem 0;
		font-weight: 500;
	}

	.feature-highlights {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-top: 2rem;
	}

	.highlight {
		font-size: 1rem;
		color: #000;
		padding: 0.75rem 1rem;
		background: #FFD93D;
		border: 2px solid #000;
		font-weight: 700;
		letter-spacing: 0.5px;
		box-shadow: 3px 3px 0 #000;
		transition: all 0.15s ease;
	}

	.transcribe-card .highlight {
		background: #98FB98;
	}

	.feature-card:hover .highlight {
		transform: translate(-2px, -2px);
		box-shadow: 5px 5px 0 #000;
	}

	.card-arrow {
		position: absolute;
		bottom: 20px;
		right: 20px;
		font-size: 3rem;
		font-weight: 900;
		color: #000;
		background: #FFD93D;
		width: 60px;
		height: 60px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 3px solid #000;
		border-radius: 50%;
		box-shadow: 4px 4px 0 #000;
		transition: all 0.15s ease;
	}

	.transcribe-card .card-arrow {
		background: #98FB98;
	}

	.feature-card:hover .card-arrow {
		transform: translate(-3px, -3px) rotate(45deg);
		box-shadow: 7px 7px 0 #000;
	}

	.menu-footer {
		text-align: center;
		color: #000;
		font-size: 1rem;
		animation: fadeIn 0.6s ease-out;
		animation-delay: 0.6s;
		animation-fill-mode: both;
		margin-top: 4rem;
		position: relative;
	}

	.footer-badge {
		display: inline-block;
		background: #000;
		color: #FFD93D;
		padding: 0.75rem 2rem;
		font-family: 'Bebas Neue', sans-serif;
		font-size: 1.5rem;
		letter-spacing: 2px;
		border: 4px solid #000;
		box-shadow: 6px 6px 0 #FF69B4;
		margin-bottom: 1.5rem;
		transform: rotate(-2deg);
	}

	.menu-footer p {
		margin: 0.5rem 0;
		font-weight: 600;
		background: #FFF;
		display: inline-block;
		padding: 0.5rem 1.5rem;
		border: 2px solid #000;
		box-shadow: 3px 3px 0 #000;
		margin: 0.5rem;
	}

	/* Animations */
	@keyframes fadeIn {
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

		.main-title {
			font-size: 3.5rem;
		}

		.subtitle {
			font-size: 1.125rem;
			padding: 0.5rem 1.5rem;
		}

		.feature-grid {
			grid-template-columns: 1fr;
			gap: 2rem;
			padding: 0;
		}

		.feature-card {
			min-width: auto;
		}

		.feature-card h2 {
			font-size: 2rem;
		}

		.feature-description {
			font-size: 1rem;
		}
	}

	@media (max-width: 480px) {
		.main-title {
			font-size: 2.5rem;
		}

		.title-line-1,
		.title-line-2 {
			padding: 0.375rem 1.25rem;
		}

		.card-content {
			padding: 3rem 1.5rem 2rem;
		}

		.feature-highlights {
			gap: 0.5rem;
		}

		.highlight {
			font-size: 0.875rem;
			padding: 0.5rem 0.75rem;
		}
	}
</style>
