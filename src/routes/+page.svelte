<script lang="ts">
	// No props needed for this component
</script>

<div class="main-menu">
	<div class="menu-container">
		<header class="menu-header">
			<!-- Natural leaf decoration -->
			<svg class="header-decoration" viewBox="0 0 100 20" width="100" height="20">
				<path
					d="M10,10 Q20,5 30,10 T50,10 T70,10 T90,10"
					stroke="#5a8c69"
					stroke-width="2"
					fill="none"
					opacity="0.4"
				/>
				<circle cx="15" cy="8" r="3" fill="#4a7c59" opacity="0.3" />
				<circle cx="35" cy="12" r="2" fill="#6b4c3a" opacity="0.3" />
				<circle cx="55" cy="7" r="2.5" fill="#8b5a3c" opacity="0.3" />
				<circle cx="75" cy="11" r="2" fill="#4a7c59" opacity="0.3" />
			</svg>

			<h1 class="main-title">
				<span class="title-line">Local AI Garden</span>
			</h1>
			<p class="subtitle">
				Discover private, locally-grown AI tools that flourish entirely in your browser - no
				external connections needed.
			</p>
		</header>

		<div class="feature-grid">
			<a href="/chat" class="feature-card chat-card">
				<!-- Natural branch decoration -->
				<svg class="card-decoration" viewBox="0 0 60 40" width="60" height="40">
					<path
						d="M5,35 Q15,20 25,25 Q35,30 45,15"
						stroke="#5a8c69"
						stroke-width="3"
						fill="none"
						opacity="0.6"
					/>
					<circle cx="12" cy="28" r="4" fill="#4a7c59" />
					<circle cx="32" cy="27" r="3" fill="#3a6e4a" />
					<circle cx="40" cy="20" r="2.5" fill="#5a8c69" />
				</svg>

				<div class="card-content">
					<div class="icon-container">
						<svg class="feature-icon" viewBox="0 0 48 48" width="48" height="48">
							<!-- Tree-like chat bubble -->
							<path
								d="M40 18c0-2.2-1.8-4-4-4h-8c-2.2 0-4 1.8-4 4v12c0 2.2 1.8 4 4 4h4l6 6v-6c2.2 0 4-1.8 4-4V18z"
								fill="#5a8c69"
							/>
							<circle cx="30" cy="24" r="2" fill="#faf8f5" />
							<circle cx="36" cy="24" r="2" fill="#faf8f5" />
							<!-- Tree trunk base -->
							<rect x="20" y="38" width="4" height="6" fill="#8b5a3c" rx="2" />
							<!-- Small leaves -->
							<ellipse cx="18" cy="16" rx="3" ry="5" fill="#4a7c59" transform="rotate(-20 18 16)" />
							<ellipse cx="14" cy="12" rx="2" ry="4" fill="#3a6e4a" transform="rotate(-45 14 12)" />
						</svg>
					</div>
					<h2>Natural Conversations</h2>
					<p class="feature-description">
						Engage in thoughtful dialogue with AI models that grow and learn, all while keeping your
						conversations rooted in privacy.
					</p>
					<div class="feature-highlights">
						<span class="highlight">Privately Grown</span>
						<span class="highlight">Locally Rooted</span>
						<span class="highlight">Organically Secure</span>
					</div>
				</div>
			</a>

			<a href="/transcribe" class="feature-card transcribe-card">
				<!-- Organic vine decoration -->
				<svg class="card-decoration" viewBox="0 0 50 45" width="50" height="45">
					<path
						d="M45,5 Q35,15 30,25 Q25,35 15,40"
						stroke="#8b5a3c"
						stroke-width="2.5"
						fill="none"
						opacity="0.5"
					/>
					<ellipse cx="38" cy="10" rx="2" ry="3" fill="#4a7c59" transform="rotate(30 38 10)" />
					<ellipse cx="28" cy="20" rx="1.5" ry="2.5" fill="#5a8c69" transform="rotate(-15 28 20)" />
					<ellipse cx="20" cy="32" rx="2.5" ry="3" fill="#3a6e4a" transform="rotate(45 20 32)" />
				</svg>

				<div class="card-content">
					<div class="icon-container">
						<svg class="feature-icon" viewBox="0 0 48 48" width="48" height="48">
							<!-- Acorn-shaped microphone with natural elements -->
							<path d="M24 8c-3 0-6 3-6 6v12c0 3 3 6 6 6s6-3 6-6V14c0-3-3-6-6-6z" fill="#8b5a3c" />
							<path d="M20 4c0-1 1-2 4-2s4 1 4 2v4c0 1-1 2-4 2s-4-1-4-2V4z" fill="#6b4c3a" />
							<path
								d="M36 20v2c0 6.6-5.4 12-12 12s-12-5.4-12-12v-2"
								stroke="#4a7c59"
								stroke-width="3"
								fill="none"
							/>
							<rect x="22" y="34" width="4" height="8" fill="#8b5a3c" rx="1" />
							<rect x="18" y="42" width="12" height="2" fill="#6b4c3a" rx="1" />
							<!-- Sound waves as leaves -->
							<ellipse
								cx="12"
								cy="16"
								rx="2"
								ry="4"
								fill="#5a8c69"
								opacity="0.6"
								transform="rotate(-30 12 16)"
							/>
							<ellipse
								cx="36"
								cy="18"
								rx="1.5"
								ry="3"
								fill="#4a7c59"
								opacity="0.5"
								transform="rotate(25 36 18)"
							/>
						</svg>
					</div>
					<h2>Audio Transcription</h2>
					<p class="feature-description">
						Transform spoken words into written text using natural AI processing. Your audio stays
						rooted in your device, never leaving your digital garden.
					</p>
					<div class="feature-highlights">
						<span class="highlight">Naturally Accurate</span>
						<span class="highlight">Format Flexible</span>
						<span class="highlight">Locally Harvested</span>
					</div>
				</div>
			</a>
		</div>

		<footer class="menu-footer">
			<svg class="footer-decoration" viewBox="0 0 80 12" width="80" height="12">
				<path
					d="M5,6 Q20,2 40,6 T75,6"
					stroke="#5a8c69"
					stroke-width="1.5"
					fill="none"
					opacity="0.5"
				/>
				<circle cx="15" cy="5" r="1.5" fill="#4a7c59" opacity="0.4" />
				<circle cx="35" cy="7" r="1" fill="#8b5a3c" opacity="0.4" />
				<circle cx="55" cy="4" r="1.2" fill="#3a6e4a" opacity="0.4" />
			</svg>
			<p>All processing grows naturally within your browser's ecosystem.</p>
			<p>Your data remains rooted in your device, never shared with the outside world.</p>
		</footer>
	</div>
</div>

<style>
	/* Nature Distilled Home Page Styles */

	.main-menu {
		min-height: 100vh;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding: 2rem 1.5rem 3rem;
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
		position: relative;
		animation: naturalFadeIn 0.8s ease-out;
	}

	.header-decoration {
		margin-bottom: 1.5rem;
		opacity: 0.6;
	}

	@keyframes naturalFadeIn {
		from {
			opacity: 0;
			transform: translateY(30px) scale(0.98);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	.main-title {
		font-size: 3.8rem;
		line-height: 1.2;
		margin: 0 0 2rem 0;
		font-weight: 700;
		font-family: 'Caveat', cursive;
	}

	.title-line {
		background: linear-gradient(135deg, #4a7c59 0%, #3a6e4a 100%);
		color: #faf8f5;
		padding: 1rem 2.5rem;
		display: inline-block;
		border: 1px solid rgba(45, 93, 58, 0.3);
		border-radius: 25px;
		box-shadow:
			0 12px 32px rgba(58, 110, 74, 0.2),
			inset 0 2px 0 rgba(255, 255, 255, 0.2);
		letter-spacing: 1px;
		position: relative;
		backdrop-filter: blur(10px);
	}

	.title-line::before {
		content: '';
		position: absolute;
		top: -5px;
		left: -5px;
		right: -5px;
		bottom: -5px;
		background: linear-gradient(45deg, rgba(90, 140, 105, 0.3), rgba(74, 124, 89, 0.2));
		border-radius: 30px;
		z-index: -1;
		filter: blur(8px);
	}

	.subtitle {
		font-size: 1.3rem;
		color: #4a7c59;
		margin: 0;
		font-weight: 500;
		font-family: 'Inter', sans-serif;
		background: rgba(250, 248, 245, 0.9);
		display: inline-block;
		padding: 1rem 2rem;
		border: 1px solid rgba(74, 124, 89, 0.2);
		border-radius: 20px;
		box-shadow:
			0 8px 24px rgba(74, 124, 89, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
		backdrop-filter: blur(5px);
		line-height: 1.5;
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
		color: #2a2a2a;
		background: rgba(250, 248, 245, 0.95);
		backdrop-filter: blur(15px);
		border: 1px solid rgba(74, 124, 89, 0.2);
		padding: 0;
		box-shadow:
			0 20px 50px rgba(45, 93, 58, 0.1),
			0 8px 20px rgba(45, 93, 58, 0.05),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
		overflow: hidden;
		border-radius: 28px;
		animation: naturalCardFade 0.8s ease-out;
		animation-fill-mode: both;
	}

	.feature-card:nth-child(1) {
		animation-delay: 0.3s;
	}

	.feature-card:nth-child(2) {
		animation-delay: 0.5s;
	}

	.card-decoration {
		position: absolute;
		top: 1rem;
		right: 1.5rem;
		opacity: 0.7;
		z-index: 1;
	}

	@keyframes naturalCardFade {
		from {
			opacity: 0;
			transform: translateY(40px) scale(0.95);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	.feature-card:hover {
		transform: translateY(-8px) scale(1.02);
		box-shadow:
			0 25px 60px rgba(45, 93, 58, 0.15),
			0 12px 25px rgba(45, 93, 58, 0.08),
			inset 0 2px 0 rgba(255, 255, 255, 1);
		border-color: rgba(90, 140, 105, 0.3);
	}

	.feature-card:hover .card-decoration {
		opacity: 1;
		transform: scale(1.1) rotate(5deg);
	}

	.card-content {
		padding: 2.5rem;
		position: relative;
		z-index: 2;
	}

	.icon-container {
		margin-bottom: 2rem;
		width: fit-content;
		padding: 1rem;
		background: rgba(90, 140, 105, 0.15);
		border: 1px solid rgba(74, 124, 89, 0.3);
		border-radius: 20px;
		backdrop-filter: blur(5px);
		box-shadow:
			0 8px 16px rgba(58, 110, 74, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.7);
	}

	.feature-icon {
		display: block;
		opacity: 0.9;
	}

	.feature-card h2 {
		font-size: 2rem;
		font-weight: 700;
		font-family: 'Caveat', cursive;
		margin: 0 0 1.2rem 0;
		color: #3a6e4a;
		letter-spacing: 0.5px;
	}

	.feature-description {
		font-size: 1.05rem;
		color: #4a4a4a;
		line-height: 1.7;
		margin: 0 0 2rem 0;
		font-family: 'Inter', sans-serif;
		font-weight: 400;
	}

	.feature-highlights {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.highlight {
		font-size: 0.9rem;
		color: #4a7c59;
		padding: 0.5rem 1rem;
		background: rgba(90, 140, 105, 0.1);
		border: 1px solid rgba(74, 124, 89, 0.25);
		font-weight: 500;
		font-family: 'Caveat', cursive;
		border-radius: 15px;
		backdrop-filter: blur(3px);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow:
			0 2px 8px rgba(58, 110, 74, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.5);
	}

	.feature-card:hover .highlight {
		background: rgba(90, 140, 105, 0.2);
		color: #3a6e4a;
		border-color: rgba(58, 110, 74, 0.4);
		transform: translateY(-1px);
		box-shadow:
			0 4px 12px rgba(58, 110, 74, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.7);
	}

	.menu-footer {
		text-align: center;
		color: #6b4c3a;
		font-size: 1rem;
		font-family: 'Inter', sans-serif;
		margin-top: 4rem;
		animation: naturalFadeIn 0.8s ease-out;
		animation-delay: 0.7s;
		animation-fill-mode: both;
		position: relative;
	}

	.footer-decoration {
		margin-bottom: 1.5rem;
		opacity: 0.8;
	}

	.menu-footer p {
		margin: 0.75rem 0;
		font-weight: 400;
		opacity: 0.8;
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.main-menu {
			padding: 2rem 1rem;
		}

		.main-title {
			font-size: 3rem;
		}

		.title-line {
			padding: 0.75rem 1.5rem;
			font-size: 2.5rem;
		}

		.subtitle {
			font-size: 1.1rem;
			padding: 0.75rem 1.5rem;
		}

		.feature-grid {
			grid-template-columns: 1fr;
			gap: 2rem;
			padding: 0 0.5rem;
		}

		.feature-card h2 {
			font-size: 1.8rem;
		}
	}

	@media (max-width: 480px) {
		.main-title {
			font-size: 2.5rem;
		}

		.title-line {
			font-size: 2rem;
			padding: 0.625rem 1.25rem;
		}

		.card-content {
			padding: 2rem;
		}

		.feature-highlights {
			gap: 0.5rem;
		}

		.highlight {
			font-size: 0.85rem;
			padding: 0.4rem 0.8rem;
		}
	}
</style>
