<script lang="ts">
	import MessageSquareIcon from 'virtual:icons/lucide/message-square';
	import MicIcon from 'virtual:icons/lucide/mic';
	import ImageIcon from 'virtual:icons/lucide/image';
</script>

<div class="bauhaus-container">
	<!-- Header Section -->
	<header class="header">
		<div class="title-block">
			<h1 class="main-title">LOCAL AI</h1>
		</div>
		<div class="subtitle-block">
			<p class="subtitle">Private AI tools that run in your browser</p>
		</div>
	</header>

	<!-- Main Grid -->
	<main class="main-grid">
		<!-- Chat Tool -->
		<a href="/chat" class="tool-card chat">
			<div class="geometric-icon">
				<div class="shape circle blue"></div>
			</div>
			<div class="tool-content">
				<h2>CHAT</h2>
				<p>Talk with AI models</p>
			</div>
		</a>

		<!-- Transcribe Tool -->
		<a href="/transcribe" class="tool-card transcribe">
			<div class="geometric-icon">
				<div class="shape triangle red"></div>
			</div>
			<div class="tool-content">
				<h2>TRANSCRIBE</h2>
				<p>Audio to text</p>
			</div>
		</a>

		<!-- Background Remover Tool -->
		<a href="/background-remover" class="tool-card background">
			<div class="geometric-icon">
				<div class="shape square yellow"></div>
			</div>
			<div class="tool-content">
				<h2>REMOVE BG</h2>
				<p>Delete backgrounds</p>
			</div>
		</a>

		<!-- Info Block -->
		<div class="info-block">
			<div class="info-line"></div>
			<p>100% PRIVATE</p>
			<p>NO DATA SENT</p>
			<p>OFFLINE READY</p>
		</div>
	</main>

	<!-- Decorative Elements -->
	<div class="floating-shapes">
		<div class="float-shape rect-1"></div>
		<div class="float-shape rect-2"></div>
		<div class="float-shape circle-1"></div>
	</div>
</div>

<style>
	/* Reset and base */
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: 'Space Grotesk', 'Helvetica Neue', Arial, sans-serif;
		background: #f5f5f5;
		color: #000;
		overflow-x: hidden;
	}

	/* Container */
	.bauhaus-container {
		min-height: 100vh;
		padding: 2rem;
		box-sizing: border-box;
		position: relative;
		max-width: 1200px;
		margin: 0 auto;
	}

	/* Header */
	.header {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 4rem;
		position: relative;
	}

	.title-block {
		background: #000;
		color: #fff;
		padding: 2rem 3rem;
		width: fit-content;
		position: relative;
		transform: rotate(-1deg);
	}

	.title-block::after {
		content: '';
		position: absolute;
		top: 0.5rem;
		left: 0.5rem;
		right: 0.5rem;
		bottom: 0.5rem;
		border: 3px solid #ff0000;
		pointer-events: none;
	}

	.main-title {
		margin: 0;
		font-size: 3.5rem;
		font-weight: 900;
		letter-spacing: 0.05em;
		line-height: 0.9;
	}

	.subtitle-block {
		background: #ffffff;
		border: 3px solid #000;
		padding: 1rem 2rem;
		width: fit-content;
		margin-left: auto;
		margin-right: 2rem;
		transform: rotate(1deg);
	}

	.subtitle {
		margin: 0;
		font-size: 1.2rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.02em;
	}

	/* Main Grid */
	.main-grid {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-template-rows: auto auto;
		gap: 2rem;
		position: relative;
	}

	/* Tool Cards */
	.tool-card {
		background: #fff;
		border: 4px solid #000;
		padding: 2rem;
		text-decoration: none;
		color: #000;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
		position: relative;
		min-height: 200px;
		justify-content: center;
	}

	.tool-card:hover {
		transform: translate(-3px, -3px);
		box-shadow: 6px 6px 0 #000;
	}

	.tool-card.chat {
		transform: rotate(-2deg);
	}

	.tool-card.transcribe {
		transform: rotate(1deg);
	}

	.tool-card.background {
		transform: rotate(-1deg);
	}

	.tool-card:hover.chat,
	.tool-card:hover.transcribe,
	.tool-card:hover.background {
		transform: translate(-3px, -3px) rotate(0deg);
	}

	/* Geometric Icons */
	.geometric-icon {
		width: 80px;
		height: 80px;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.shape {
		border: 3px solid #000;
	}

	.circle {
		width: 60px;
		height: 60px;
		border-radius: 50%;
	}

	.triangle {
		width: 0;
		height: 0;
		border: none;
		border-left: 30px solid transparent;
		border-right: 30px solid transparent;
		border-bottom: 52px solid #ff0000;
		background: none;
	}

	.square {
		width: 60px;
		height: 60px;
	}

	.blue {
		background: #0066ff;
	}

	.red {
		/* Triangle color is set above */
	}

	.yellow {
		background: #ffdd00;
	}

	/* Tool Content */
	.tool-content {
		text-align: center;
	}

	.tool-content h2 {
		margin: 0 0 0.5rem 0;
		font-size: 1.4rem;
		font-weight: 900;
		letter-spacing: 0.05em;
	}

	.tool-content p {
		margin: 0;
		font-size: 1rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.02em;
		opacity: 0.8;
	}

	/* Info Block */
	.info-block {
		grid-column: 1 / -1;
		background: #ffdd00;
		border: 4px solid #000;
		padding: 2rem;
		text-align: center;
		position: relative;
		transform: rotate(0.5deg);
		margin-top: 2rem;
	}

	.info-line {
		width: 100px;
		height: 4px;
		background: #000;
		margin: 0 auto 1rem auto;
	}

	.info-block p {
		margin: 0.5rem 0;
		font-size: 1.1rem;
		font-weight: 700;
		letter-spacing: 0.1em;
	}

	/* Floating Decorative Shapes */
	.floating-shapes {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		pointer-events: none;
		z-index: -1;
	}

	.float-shape {
		position: absolute;
		border: 3px solid #000;
	}

	.rect-1 {
		width: 40px;
		height: 60px;
		background: #ff0000;
		top: 20%;
		right: 10%;
		transform: rotate(45deg);
		opacity: 0.3;
	}

	.rect-2 {
		width: 30px;
		height: 80px;
		background: #0066ff;
		bottom: 30%;
		left: 5%;
		transform: rotate(-20deg);
		opacity: 0.3;
	}

	.circle-1 {
		width: 50px;
		height: 50px;
		background: #ffdd00;
		border-radius: 50%;
		top: 50%;
		right: 5%;
		opacity: 0.3;
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.bauhaus-container {
			padding: 1rem;
		}

		.main-grid {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		.main-title {
			font-size: 2.5rem;
		}

		.title-block {
			padding: 1.5rem 2rem;
		}

		.subtitle-block {
			margin-left: 0;
			margin-right: 0;
		}

		.tool-card {
			min-height: 160px;
			padding: 1.5rem;
		}

		.geometric-icon {
			width: 60px;
			height: 60px;
		}

		.circle,
		.square {
			width: 45px;
			height: 45px;
		}

		.triangle {
			border-left: 22px solid transparent;
			border-right: 22px solid transparent;
			border-bottom: 38px solid #ff0000;
		}

		.tool-content h2 {
			font-size: 1.2rem;
		}

		.tool-content p {
			font-size: 0.9rem;
		}

		/* Simplify floating shapes on mobile */
		.floating-shapes {
			display: none;
		}
	}

	@media (max-width: 480px) {
		.main-title {
			font-size: 2rem;
		}

		.title-block {
			padding: 1rem 1.5rem;
		}

		.subtitle {
			font-size: 1rem;
		}

		.tool-card {
			min-height: 140px;
			padding: 1rem;
		}

		.info-block {
			padding: 1.5rem;
		}

		.info-block p {
			font-size: 1rem;
		}
	}
</style>
