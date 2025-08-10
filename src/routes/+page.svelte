<script lang="ts">
	// No props needed for this component
</script>

<div class="main-menu">
	<!-- Decorative nature elements -->
	<svg
		class="nature-decoration-top"
		width="100%"
		height="200"
		style="position: absolute; top: 0; left: 0; opacity: 0.1; pointer-events: none;"
	>
		<defs>
			<pattern
				id="branch-pattern"
				x="0"
				y="0"
				width="300"
				height="150"
				patternUnits="userSpaceOnUse"
			>
				<g stroke="currentColor" stroke-width="1" fill="none" opacity="0.5">
					<path d="M0,75 Q50,50 100,75 T200,75 T300,75" />
					<path d="M50,50 L45,40 M50,50 L55,40" />
					<path d="M150,50 L145,40 M150,50 L155,40" />
					<path d="M250,50 L245,40 M250,50 L255,40" />
				</g>
				<g fill="currentColor" opacity="0.3">
					<circle cx="75" cy="30" r="15" />
					<circle cx="175" cy="45" r="12" />
					<circle cx="275" cy="35" r="18" />
				</g>
			</pattern>
		</defs>
		<rect width="100%" height="100%" fill="url(#branch-pattern)" />
	</svg>

	<div class="menu-container">
		<header class="menu-header">
			<div class="title-wrapper">
				<!-- Decorative leaf SVG -->
				<svg class="leaf-decoration left" width="60" height="60" viewBox="0 0 60 60">
					<path
						d="M30,10 Q20,20 20,35 Q20,50 30,55 Q40,50 40,35 Q40,20 30,10"
						fill="currentColor"
						opacity="0.2"
					/>
					<path d="M30,10 L30,55" stroke="currentColor" stroke-width="1" opacity="0.3" />
					<path
						d="M30,25 L25,20 M30,35 L35,30 M30,45 L25,40"
						stroke="currentColor"
						stroke-width="0.5"
						opacity="0.2"
					/>
				</svg>

				<h1 class="main-title">
					<span class="title-line">Local AI</span>
					<span class="title-line subtitle">Playground</span>
				</h1>

				<svg class="leaf-decoration right" width="60" height="60" viewBox="0 0 60 60">
					<path
						d="M30,10 Q40,20 40,35 Q40,50 30,55 Q20,50 20,35 Q20,20 30,10"
						fill="currentColor"
						opacity="0.2"
					/>
					<path d="M30,10 L30,55" stroke="currentColor" stroke-width="1" opacity="0.3" />
					<path
						d="M30,25 L35,20 M30,35 L25,30 M30,45 L35,40"
						stroke="currentColor"
						stroke-width="0.5"
						opacity="0.2"
					/>
				</svg>
			</div>

			<p class="subtitle-text">
				Free, private AI tools that run entirely in your browser — even offline. Your data never
				leaves your device.
			</p>
		</header>

		<div class="feature-grid">
			<a href="/chat" class="feature-card chat-card">
				<div class="card-number">01</div>

				<!-- Nature-inspired chat icon -->
				<div class="icon-container">
					<svg class="feature-icon" viewBox="0 0 80 80" width="64" height="64">
						<g
							stroke="currentColor"
							fill="none"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path
								d="M65 45C65 50 60 55 55 55H25L15 65V20C15 15 20 10 25 10H55C60 10 65 15 65 20V45Z"
								fill="var(--moss-green)"
								fill-opacity="0.15"
							/>
							<path
								d="M65 45C65 50 60 55 55 55H25L15 65V20C15 15 20 10 25 10H55C60 10 65 15 65 20V45Z"
							/>
							<circle cx="30" cy="32" r="2" fill="currentColor" />
							<circle cx="40" cy="32" r="2" fill="currentColor" />
							<circle cx="50" cy="32" r="2" fill="currentColor" />
						</g>
						<!-- Decorative leaves -->
						<g fill="currentColor" opacity="0.2">
							<path d="M10,15 Q5,10 5,5 Q10,5 15,10 Q10,10 10,15" transform="rotate(-30 10 10)" />
							<path
								d="M70,60 Q65,55 65,50 Q70,50 75,55 Q70,55 70,60"
								transform="rotate(45 70 55)"
							/>
						</g>
					</svg>
				</div>

				<div class="card-content">
					<h2>AI Chat</h2>
					<p class="feature-description">
						Converse with advanced language models like Gemma3, running completely on your device
						through WebAssembly technology.
					</p>
					<div class="feature-highlights">
						<span class="highlight">
							<svg
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
								style="display: inline-block; vertical-align: middle; margin-right: 4px;"
							>
								<circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" />
								<path
									d="M5 8L7 10L11 6"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
							100% Private
						</span>
						<span class="highlight">
							<svg
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
								style="display: inline-block; vertical-align: middle; margin-right: 4px;"
							>
								<circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" />
								<path
									d="M8 4V8L11 11"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linecap="round"
								/>
							</svg>
							Works Offline
						</span>
					</div>
				</div>
			</a>

			<a href="/transcribe" class="feature-card transcribe-card">
				<div class="card-number">02</div>

				<!-- Nature-inspired microphone icon -->
				<div class="icon-container">
					<svg class="feature-icon" viewBox="0 0 80 80" width="64" height="64">
						<g
							stroke="currentColor"
							fill="none"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path
								d="M40 10C35 10 30 15 30 20V40C30 45 35 50 40 50C45 50 50 45 50 40V20C50 15 45 10 40 10Z"
								fill="var(--sage-green)"
								fill-opacity="0.15"
							/>
							<path
								d="M40 10C35 10 30 15 30 20V40C30 45 35 50 40 50C45 50 50 45 50 40V20C50 15 45 10 40 10Z"
							/>
							<path d="M60 35V40C60 50 50 60 40 60C30 60 20 50 20 40V35" />
							<line x1="40" y1="60" x2="40" y2="70" />
							<line x1="30" y1="70" x2="50" y2="70" />
							<!-- Sound waves -->
							<path d="M25 30Q20 30 15 25" opacity="0.3" />
							<path d="M55 30Q60 30 65 25" opacity="0.3" />
						</g>
						<!-- Decorative elements -->
						<g fill="currentColor" opacity="0.2">
							<circle cx="15" cy="20" r="3" />
							<circle cx="65" cy="20" r="3" />
							<path d="M40,5 Q38,3 38,0 Q40,0 42,3 Q40,3 40,5" />
						</g>
					</svg>
				</div>

				<div class="card-content">
					<h2>Audio Transcription</h2>
					<p class="feature-description">
						Transform speech into text using Whisper AI. Upload audio files or record directly, with
						support for multiple export formats.
					</p>
					<div class="feature-highlights">
						<span class="highlight">
							<svg
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
								style="display: inline-block; vertical-align: middle; margin-right: 4px;"
							>
								<rect
									x="3"
									y="3"
									width="10"
									height="10"
									rx="2"
									stroke="currentColor"
									stroke-width="1.5"
								/>
								<path
									d="M6 8L7.5 9.5L10 6.5"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
							High Accuracy
						</span>
						<span class="highlight">
							<svg
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
								style="display: inline-block; vertical-align: middle; margin-right: 4px;"
							>
								<path
									d="M8 2L10 6L14 6.5L11 9.5L11.5 13.5L8 11.5L4.5 13.5L5 9.5L2 6.5L6 6L8 2Z"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linejoin="round"
								/>
							</svg>
							SRT Export
						</span>
					</div>
				</div>
			</a>
		</div>

		<footer class="menu-footer">
			<div class="footer-content">
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					style="display: inline-block; vertical-align: middle; margin-right: 8px;"
				>
					<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" />
					<path
						d="M12 6V12L16 16"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
					/>
				</svg>
				<p>Powered by WebAssembly • Processing happens 100% locally • No external servers</p>
			</div>
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

	.nature-decoration-top {
		color: var(--forest-primary);
	}

	.menu-container {
		width: 100%;
		max-width: 1000px;
		margin: 0 auto;
		position: relative;
	}

	.menu-header {
		text-align: center;
		margin-bottom: 3rem;
		animation: fadeIn 0.8s ease-out;
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

	.title-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 2rem;
		margin-bottom: 1.5rem;
	}

	.leaf-decoration {
		color: var(--forest-primary);
		animation: gentle-float 6s ease-in-out infinite;
	}

	.leaf-decoration.left {
		animation-delay: 0s;
	}

	.leaf-decoration.right {
		animation-delay: 3s;
	}

	@keyframes gentle-float {
		0%,
		100% {
			transform: translateY(0) rotate(0deg);
		}
		50% {
			transform: translateY(-10px) rotate(5deg);
		}
	}

	.main-title {
		font-size: clamp(2.5rem, 5vw, 4rem);
		line-height: 1;
		margin: 0;
		font-weight: 300;
		color: var(--forest-primary);
		letter-spacing: -0.02em;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.title-line {
		display: block;
		background: linear-gradient(135deg, var(--forest-primary) 0%, var(--forest-light) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.title-line.subtitle {
		font-size: 0.6em;
		font-weight: 600;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		opacity: 0.8;
	}

	.subtitle-text {
		font-size: 1.125rem;
		color: var(--text-secondary);
		margin: 0 auto;
		max-width: 600px;
		font-weight: 400;
		line-height: 1.6;
		letter-spacing: 0.01em;
	}

	.feature-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
		gap: 2rem;
		margin-bottom: 3rem;
	}

	.feature-card {
		display: block;
		text-decoration: none;
		color: var(--text-primary);
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.9) 0%,
			rgba(250, 248, 243, 0.95) 100%
		);
		border: 1px solid rgba(139, 111, 71, 0.15);
		padding: 0;
		border-radius: 20px;
		transition: all 0.3s ease;
		position: relative;
		overflow: hidden;
		backdrop-filter: blur(10px);
		box-shadow:
			0 4px 20px rgba(46, 90, 61, 0.08),
			0 1px 3px rgba(139, 111, 71, 0.1);
		animation: cardFade 0.8s ease-out;
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
			transform: translateY(30px);
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
		color: var(--text-muted);
		font-size: 0.875rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		opacity: 0.5;
	}

	.feature-card:hover {
		transform: translateY(-4px);
		box-shadow:
			0 8px 32px rgba(46, 90, 61, 0.15),
			0 2px 8px rgba(139, 111, 71, 0.1);
		border-color: rgba(46, 90, 61, 0.2);
	}

	.icon-container {
		padding: 2rem 2rem 1rem;
		display: flex;
		justify-content: center;
	}

	.feature-icon {
		color: var(--forest-primary);
		display: block;
		transition: transform 0.3s ease;
	}

	.feature-card:hover .feature-icon {
		transform: scale(1.05) rotate(2deg);
	}

	.card-content {
		padding: 0 2rem 2rem;
	}

	.feature-card h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin: 0 0 0.75rem 0;
		color: var(--forest-primary);
		letter-spacing: -0.01em;
	}

	.feature-description {
		font-size: 0.975rem;
		color: var(--text-secondary);
		line-height: 1.6;
		margin: 0 0 1.5rem 0;
	}

	.feature-highlights {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.highlight {
		font-size: 0.875rem;
		color: var(--forest-deep);
		padding: 0.5rem 0.875rem;
		background: linear-gradient(
			135deg,
			rgba(136, 179, 120, 0.15) 0%,
			rgba(168, 185, 159, 0.1) 100%
		);
		border: 1px solid rgba(46, 90, 61, 0.2);
		font-weight: 500;
		border-radius: 8px;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		gap: 0.25rem;
		letter-spacing: 0.01em;
	}

	.feature-card:hover .highlight {
		background: linear-gradient(
			135deg,
			rgba(136, 179, 120, 0.25) 0%,
			rgba(168, 185, 159, 0.2) 100%
		);
		transform: translateX(2px);
	}

	.menu-footer {
		text-align: center;
		margin-top: 4rem;
		padding-top: 2rem;
		border-top: 1px solid rgba(139, 111, 71, 0.1);
		animation: fadeIn 0.8s ease-out;
		animation-delay: 0.5s;
		animation-fill-mode: both;
	}

	.footer-content {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		color: var(--text-muted);
		font-size: 0.9375rem;
	}

	.footer-content p {
		margin: 0;
		letter-spacing: 0.02em;
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.main-menu {
			padding: 1.5rem 1rem;
		}

		.title-wrapper {
			gap: 1rem;
		}

		.leaf-decoration {
			width: 40px;
			height: 40px;
		}

		.main-title {
			font-size: clamp(2rem, 8vw, 3rem);
		}

		.subtitle-text {
			font-size: 1rem;
			padding: 0 1rem;
		}

		.feature-grid {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		.feature-card h2 {
			font-size: 1.375rem;
		}
	}

	@media (max-width: 480px) {
		.title-wrapper {
			flex-direction: column;
			gap: 0.5rem;
		}

		.leaf-decoration {
			display: none;
		}

		.card-content {
			padding: 0 1.5rem 1.5rem;
		}

		.icon-container {
			padding: 1.5rem 1.5rem 1rem;
		}

		.feature-highlights {
			gap: 0.5rem;
		}

		.highlight {
			font-size: 0.8125rem;
			padding: 0.375rem 0.625rem;
		}
	}
</style>
