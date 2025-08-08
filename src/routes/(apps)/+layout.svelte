<script lang="ts">
	import { page } from '$app/stores';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	// Navigation links
	const navLinks = [
		{ path: '/llama', label: 'Chat', icon: 'chat' },
		{ path: '/whisper', label: 'Transcribe', icon: 'mic' }
	];

	// Check if a path is active
	function isActive(path: string): boolean {
		return $page.url.pathname === path;
	}
</script>

<div class="container">
	<nav class="main-nav">
		<div class="nav-bg-shape"></div>
		<ul>
			{#each navLinks as link}
				<li>
					<a href={link.path} class:active={isActive(link.path)}>
						{#if link.icon === 'chat'}
							<svg
								class="nav-icon"
								viewBox="0 0 24 24"
								width="24"
								height="24"
								stroke="currentColor"
								stroke-width="3"
								fill="none"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
							</svg>
						{:else if link.icon === 'mic'}
							<svg
								class="nav-icon"
								viewBox="0 0 24 24"
								width="24"
								height="24"
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
						{/if}
						<span>{link.label}</span>
					</a>
				</li>
			{/each}
		</ul>
	</nav>

	<div class="content-wrapper">
		{@render children?.()}
	</div>
</div>

<style>
	/* Base styles with Neo-Brutalist approach */
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
		position: relative;
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

	.container {
		width: 100%;
		max-width: 900px;
		margin: 0 auto;
		padding: 1rem;
		box-sizing: border-box;
		position: relative;
		z-index: 2;
	}

	.content-wrapper {
		width: 100%;
		position: relative;
	}

	/* Navigation styles - Neo-Brutalist */
	.main-nav {
		margin-bottom: 2rem;
		width: 100%;
		position: relative;
	}

	.nav-bg-shape {
		position: absolute;
		top: -5px;
		left: -10px;
		right: -10px;
		bottom: -5px;
		background: #000;
		border-radius: 20% 80% 70% 30% / 30% 30% 70% 70%;
		transform: rotate(-1deg);
		z-index: -1;
	}

	.main-nav ul {
		display: flex;
		justify-content: center;
		gap: 1.5rem;
		padding: 0;
		margin: 0;
		list-style: none;
		background: #FFF;
		padding: 1rem;
		box-sizing: border-box;
		border: 4px solid #000;
		border-radius: 15% 85% 85% 15% / 85% 15% 85% 15%;
		position: relative;
		box-shadow: 8px 8px 0 #000;
	}

	.main-nav li {
		flex: 1;
		max-width: 200px;
	}

	.main-nav a {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.875rem 1.5rem;
		text-decoration: none;
		color: #000;
		font-weight: 700;
		font-size: 1.1rem;
		transition: all 0.15s ease;
		background: #FFD93D;
		border: 3px solid #000;
		border-radius: 50% 20% 30% 70% / 30% 70% 20% 50%;
		position: relative;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.main-nav a:hover {
		transform: translate(-3px, -3px);
		box-shadow: 6px 6px 0 #000;
		background: #FF69B4;
	}

	.main-nav a.active {
		background: #98FB98;
		transform: translate(-3px, -3px);
		box-shadow: 6px 6px 0 #000;
	}

	.nav-icon {
		width: 20px;
		height: 20px;
	}

	/* Shared component styling - Neo-Brutalist */
	:global(.card-interface) {
		border: 4px solid #000;
		background: #FFF;
		box-shadow: 10px 10px 0 #000;
		width: 100%;
		position: relative;
		border-radius: 0;
		overflow: visible;
		transform: rotate(-0.5deg);
	}

	:global(.card-interface)::before {
		content: '';
		position: absolute;
		top: -8px;
		left: -8px;
		right: -8px;
		bottom: -8px;
		background: #FF69B4;
		border: 3px solid #000;
		z-index: -1;
		border-radius: 30% 70% 70% 30% / 60% 40% 60% 40%;
		transform: rotate(1deg);
	}

	:global(.toolbar) {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.25rem 1.5rem;
		background: linear-gradient(135deg, #FFD93D 0%, #FF69B4 100%);
		border-bottom: 4px solid #000;
		position: relative;
	}

	:global(.toolbar)::after {
		content: '';
		position: absolute;
		bottom: -8px;
		left: 0;
		right: 0;
		height: 4px;
		background: repeating-linear-gradient(
			90deg,
			#000,
			#000 10px,
			transparent 10px,
			transparent 20px
		);
	}

	:global(.model-info) {
		font-size: 1.1rem;
		font-weight: 700;
		color: #000;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	:global(.content-area) {
		padding: 1.5rem;
		background: #FFF;
		min-height: 300px;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		position: relative;
		background-image: 
			radial-gradient(circle at 20% 80%, rgba(255, 182, 193, 0.1) 0%, transparent 50%),
			radial-gradient(circle at 80% 20%, rgba(152, 251, 152, 0.1) 0%, transparent 50%);
	}

	:global(.input-area) {
		padding: 1.25rem 1.5rem;
		border-top: 4px solid #000;
		background: linear-gradient(135deg, #98FB98 0%, #87CEEB 100%);
		position: relative;
	}

	:global(.disclaimer) {
		margin-top: 0.75rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: #000;
		text-align: center;
		background: #FFD93D;
		padding: 0.5rem;
		border: 2px solid #000;
		border-radius: 50% 20% 30% 70% / 30% 70% 20% 50%;
		display: inline-block;
		margin-left: auto;
		margin-right: auto;
		width: fit-content;
		box-shadow: 3px 3px 0 #000;
	}

	:global(.loading) {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		margin: 2rem 0;
		animation: wobble 2s ease-in-out infinite;
		width: 100%;
	}

	@keyframes wobble {
		0%, 100% { transform: rotate(-1deg); }
		50% { transform: rotate(1deg); }
	}

	:global(.loading-progress) {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		padding: 2.5rem;
		background: #FFF;
		border: 4px solid #000;
		box-shadow: 10px 10px 0 #000;
		width: 100%;
		text-align: center;
		position: relative;
		transform: rotate(-1deg);
	}

	:global(.loading-progress)::before {
		content: '⚡';
		position: absolute;
		top: -20px;
		right: 20px;
		font-size: 2rem;
		animation: pulse 1s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.2); }
	}

	:global(.loading-progress h3) {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 2rem;
		font-weight: 400;
		margin: 0;
		color: #000;
		text-transform: uppercase;
		letter-spacing: 2px;
	}

	:global(.progress-container) {
		width: 100%;
		margin: 1rem 0;
	}

	:global(.progress-bar) {
		height: 1.5rem;
		background: #FFF;
		border: 3px solid #000;
		overflow: hidden;
		width: 100%;
		position: relative;
	}

	:global(.progress-bar-fill) {
		height: 100%;
		background: repeating-linear-gradient(
			45deg,
			#FFD93D,
			#FFD93D 10px,
			#FF69B4 10px,
			#FF69B4 20px
		);
		border-right: 3px solid #000;
		position: relative;
		animation: progress-animation 1s linear infinite;
	}

	:global(.loading-message) {
		font-size: 1rem;
		font-weight: 600;
		color: #000;
		margin: 0;
		max-width: 400px;
		padding: 1rem;
		background: #98FB98;
		border: 3px solid #000;
		border-radius: 30% 70% 70% 30% / 60% 40% 60% 40%;
		box-shadow: 5px 5px 0 #000;
	}

	:global(.error) {
		color: #000;
		background: #FF6B6B;
		padding: 2rem;
		border: 4px solid #000;
		text-align: center;
		box-shadow: 8px 8px 0 #000;
		width: 100%;
		max-width: 600px;
		animation: shake 0.5s ease-in-out;
		position: relative;
		transform: rotate(-2deg);
	}

	@keyframes shake {
		0%, 100% { transform: translateX(0) rotate(-2deg); }
		25% { transform: translateX(-10px) rotate(-2deg); }
		75% { transform: translateX(10px) rotate(-2deg); }
	}

	:global(.error)::before {
		content: '⚠️';
		position: absolute;
		top: -25px;
		left: 50%;
		transform: translateX(-50%);
		font-size: 2.5rem;
	}

	:global(.error p) {
		font-size: 1.125rem;
		font-weight: 600;
		margin-bottom: 1.5rem;
		line-height: 1.5;
	}

	:global(.error button) {
		padding: 1rem 2rem;
		background: #FFD93D;
		color: #000;
		border: 4px solid #000;
		cursor: pointer;
		font-size: 1.125rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 1px;
		transition: all 0.15s;
		box-shadow: 6px 6px 0 #000;
		font-family: 'Space Grotesk', monospace;
	}

	:global(.error button:hover) {
		transform: translate(-3px, -3px);
		box-shadow: 9px 9px 0 #000;
		background: #98FB98;
	}

	:global(.error button:active) {
		transform: translate(0);
		box-shadow: 3px 3px 0 #000;
	}

	:global(.primary-button) {
		padding: 1rem 2rem;
		background: #FFD93D;
		color: #000;
		border: 4px solid #000;
		cursor: pointer;
		font-size: 1.25rem;
		font-weight: 700;
		transition: all 0.15s;
		box-shadow: 6px 6px 0 #000;
		text-transform: uppercase;
		letter-spacing: 1px;
		font-family: 'Space Grotesk', monospace;
		border-radius: 20% 5% 20% 5% / 5% 20% 5% 20%;
	}

	:global(.primary-button:hover) {
		transform: translate(-3px, -3px);
		box-shadow: 9px 9px 0 #000;
		background: #FF69B4;
	}

	:global(.primary-button:active) {
		transform: translate(0);
		box-shadow: 3px 3px 0 #000;
	}

	:global(.primary-button:disabled) {
		background: #CCC;
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
		opacity: 0.7;
	}

	/* Animations */
	@keyframes -global-fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px) rotate(-2deg);
		}
		to {
			opacity: 1;
			transform: translateY(0) rotate(-2deg);
		}
	}

	@keyframes -global-progress-animation {
		0% {
			background-position: 0 0;
		}
		100% {
			background-position: 40px 0;
		}
	}

	/* Responsive adjustments */
	@media (max-width: 600px) {
		.container {
			padding: 0.75rem;
		}

		.main-nav ul {
			gap: 0.75rem;
			padding: 0.75rem;
			flex-direction: column;
		}

		.main-nav a {
			padding: 0.75rem 1rem;
			font-size: 1rem;
		}

		:global(.loading) {
			align-items: stretch;
		}

		:global(.loading-progress),
		:global(.error) {
			width: auto;
			max-width: none;
		}

		:global(.card-interface) {
			box-shadow: 6px 6px 0 #000;
		}

		:global(.content-area) {
			min-height: 250px;
		}

		:global(.loading-progress) {
			padding: 1.75rem;
		}
	}
</style>
