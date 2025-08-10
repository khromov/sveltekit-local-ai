<script lang="ts">
	import { page } from '$app/stores';
	import '@fontsource/space-grotesk/400.css';
	import '@fontsource/space-grotesk/500.css';
	import '@fontsource/space-grotesk/700.css';
	import '@fontsource/bebas-neue';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	// Navigation links
	const navLinks = [
		{ path: '/', label: '', icon: 'home' },
		{ path: '/chat', label: 'Chat', icon: 'chat' },
		{ path: '/transcribe', label: 'Transcribe', icon: 'mic' }
	];

	// Check if a path is active
	function isActive(path: string): boolean {
		return $page.url.pathname === path;
	}
</script>

<div class="app-wrapper">
	<div class="container">
		<nav class="main-nav">
			<div class="nav-organic-shape">
				<svg viewBox="0 0 100 20" width="100" height="20">
					<path
						d="M0,10 Q25,2 50,10 T100,10"
						stroke="var(--earth-dark)"
						stroke-width="2"
						fill="none"
						opacity="0.3"
					/>
				</svg>
			</div>
			<ul>
				{#each navLinks as link (link.path)}
					{#if link.icon === 'home'}
						<li class="home-item">
							<a
								href={link.path}
								class:active={isActive(link.path)}
								class:home-link={link.icon === 'home'}
							>
								<svg
									class="nav-icon"
									viewBox="0 0 24 24"
									width="22"
									height="22"
									stroke="currentColor"
									stroke-width="1.5"
									fill="none"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
									<polyline points="9,22 9,12 15,12 15,22"></polyline>
								</svg>
								{#if link.label}
									<span>{link.label}</span>
								{/if}
							</a>
						</li>
					{/if}
				{/each}
				<div class="center-items">
					{#each navLinks as link (link.path)}
						{#if link.icon !== 'home'}
							<li>
								<a href={link.path} class:active={isActive(link.path)}>
									{#if link.icon === 'chat'}
										<svg
											class="nav-icon"
											viewBox="0 0 24 24"
											width="22"
											height="22"
											stroke="currentColor"
											stroke-width="1.5"
											fill="none"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
											></path>
										</svg>
									{:else if link.icon === 'mic'}
										<svg
											class="nav-icon"
											viewBox="0 0 24 24"
											width="22"
											height="22"
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
									{/if}
									{#if link.label}
										<span>{link.label}</span>
									{/if}
								</a>
							</li>
						{/if}
					{/each}
				</div>
			</ul>
		</nav>

		<div class="content-wrapper">
			{@render children?.()}
		</div>
	</div>
</div>

<style>
	/* Nature distilled color palette */
	:global(:root) {
		--mocha-mousse: #a7846a;
		--earth-light: #d4c4b0;
		--earth-medium: #b8a288;
		--earth-dark: #8b6f47;
		--clay: #c19a6b;
		--soil: #5d4e37;
		--sage: #9caf88;
		--stone: #a8a090;
		--bark: #8b7355;
		--cream: #f5f1eb;
		--sand: #e6ddd4;
		--text-primary: #3c2e26;
		--text-secondary: #6b5b4f;
		--text-light: #8b7965;
	}

	/* Base styles with nature distilled approach */
	:global(html) {
		height: 100%;
	}

	:global(body) {
		margin: 0;
		padding: 0;
		font-family: 'Space Grotesk', 'Georgia', 'Times New Roman', serif;
		font-size: 16px;
		line-height: 1.6;
		background: linear-gradient(135deg, var(--cream) 0%, var(--sand) 35%, var(--earth-light) 100%);
		background-attachment: fixed;
		color: var(--text-primary);
		position: relative;
		overflow-x: hidden;
		min-height: 100vh;
		letter-spacing: 0.01em;
	}

	/* Subtle paper texture overlay */
	:global(body)::before {
		content: '';
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-image:
			repeating-linear-gradient(
				0deg,
				transparent,
				transparent 3px,
				rgba(139, 111, 71, 0.02) 3px,
				rgba(139, 111, 71, 0.02) 6px
			),
			repeating-linear-gradient(
				90deg,
				transparent,
				transparent 3px,
				rgba(139, 111, 71, 0.01) 3px,
				rgba(139, 111, 71, 0.01) 6px
			);
		pointer-events: none;
		z-index: 1;
	}

	.app-wrapper {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		position: relative;
		z-index: 2;
	}

	.container {
		width: 100%;
		max-width: 900px;
		margin: 0 auto;
		padding: 1.5rem;
		box-sizing: border-box;
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.content-wrapper {
		width: 100%;
		position: relative;
		overflow-x: hidden;
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	/* Navigation styles - Nature distilled */
	.main-nav {
		margin-bottom: 2rem;
		width: 100%;
		position: relative;
	}

	.nav-organic-shape {
		position: absolute;
		top: -8px;
		left: 0;
		right: 0;
		opacity: 0.3;
		z-index: 0;
	}

	.main-nav ul {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 0.5rem;
		padding: 0;
		margin: 0;
		list-style: none;
		background: rgba(245, 241, 235, 0.9);
		backdrop-filter: blur(10px);
		padding: 1rem 1.5rem;
		box-sizing: border-box;
		border: 1px solid var(--earth-medium);
		border-radius: 2rem;
		box-shadow:
			0 4px 20px rgba(139, 111, 71, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
		position: relative;
		z-index: 1;
	}

	.center-items {
		display: flex;
		gap: 0.5rem;
	}

	.center-items li {
		list-style: none;
	}

	.main-nav li {
		flex: none;
	}

	.main-nav a {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.75rem 1.25rem;
		text-decoration: none;
		color: var(--text-primary);
		font-weight: 500;
		font-size: 0.95rem;
		transition: all 0.3s ease;
		background: transparent;
		border: 1px solid transparent;
		border-radius: 1.5rem;
		position: relative;
		letter-spacing: 0.02em;
	}

	.main-nav a:hover {
		background: rgba(167, 132, 106, 0.1);
		color: var(--soil);
		transform: translateY(-1px);
		box-shadow: 0 2px 10px rgba(139, 111, 71, 0.15);
	}

	.main-nav a.active {
		background: linear-gradient(135deg, var(--mocha-mousse), var(--clay));
		color: var(--cream);
		box-shadow:
			0 3px 15px rgba(139, 111, 71, 0.25),
			inset 0 1px 0 rgba(255, 255, 255, 0.2);
	}

	.nav-icon {
		width: 18px;
		height: 18px;
		opacity: 0.8;
	}

	.home-link {
		max-width: auto;
		flex: none;
		padding: 0.75rem !important;
		border-radius: 50% !important;
	}

	/* Shared component styling - Nature distilled */
	:global(.card-interface) {
		border: 1px solid var(--earth-medium);
		background: rgba(245, 241, 235, 0.95);
		backdrop-filter: blur(10px);
		box-shadow:
			0 8px 32px rgba(139, 111, 71, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
		width: 100%;
		position: relative;
		border-radius: 1.5rem;
		overflow: hidden;
		box-sizing: border-box;
	}

	:global(.toolbar) {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.25rem 1.5rem;
		background: linear-gradient(135deg, var(--clay) 0%, var(--mocha-mousse) 100%);
		border-bottom: 1px solid var(--earth-dark);
		flex-wrap: wrap;
		gap: 0.75rem;
		position: relative;
	}

	/* Organic decoration for toolbar */
	:global(.toolbar)::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: repeating-linear-gradient(
			90deg,
			var(--earth-dark),
			var(--earth-dark) 4px,
			transparent 4px,
			transparent 8px
		);
		opacity: 0.3;
	}

	:global(.model-info) {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--cream);
		letter-spacing: 0.05em;
		word-break: break-word;
		max-width: 100%;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
	}

	:global(.content-area) {
		padding: 2rem;
		background: rgba(245, 241, 235, 0.6);
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		box-sizing: border-box;
		min-height: 0;
		position: relative;
	}

	/* Subtle organic pattern overlay */
	:global(.content-area)::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-image:
			radial-gradient(circle at 20% 30%, rgba(156, 175, 136, 0.05) 2px, transparent 2px),
			radial-gradient(circle at 80% 70%, rgba(139, 111, 71, 0.03) 1px, transparent 1px);
		background-size:
			60px 60px,
			40px 40px;
		pointer-events: none;
		z-index: 0;
	}

	:global(.content-area > *) {
		position: relative;
		z-index: 1;
	}

	:global(.input-area) {
		padding: 1.5rem 2rem;
		border-top: 1px solid var(--earth-medium);
		background: rgba(230, 221, 212, 0.8);
		backdrop-filter: blur(5px);
		box-sizing: border-box;
		flex: 0 0 auto;
	}

	:global(.disclaimer) {
		margin-top: 0.75rem;
		font-size: 0.85rem;
		font-weight: 400;
		color: var(--text-secondary);
		text-align: center;
		font-style: italic;
	}

	:global(.loading) {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		margin: 2rem 0;
		animation: fadeIn 0.6s ease-out;
		width: 100%;
		box-sizing: border-box;
		flex: 1;
		justify-content: center;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(15px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	:global(.primary-button) {
		padding: 1rem 2rem;
		background: linear-gradient(135deg, var(--mocha-mousse), var(--clay));
		color: var(--cream);
		border: 1px solid var(--earth-dark);
		border-radius: 2rem;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 500;
		transition: all 0.3s ease;
		box-shadow:
			0 4px 15px rgba(139, 111, 71, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.2);
		letter-spacing: 0.02em;
		font-family: 'Space Grotesk', 'Georgia', serif;
		box-sizing: border-box;
		position: relative;
		overflow: hidden;
	}

	:global(.primary-button:hover) {
		transform: translateY(-2px);
		box-shadow:
			0 6px 20px rgba(139, 111, 71, 0.3),
			inset 0 1px 0 rgba(255, 255, 255, 0.3);
		background: linear-gradient(135deg, var(--clay), var(--mocha-mousse));
	}

	:global(.primary-button:active) {
		transform: translateY(0);
		box-shadow:
			0 2px 8px rgba(139, 111, 71, 0.3),
			inset 0 1px 0 rgba(255, 255, 255, 0.1);
	}

	:global(.primary-button:disabled) {
		background: var(--stone);
		color: var(--text-light);
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
		opacity: 0.6;
	}

	/* Responsive adjustments */
	@media (max-width: 600px) {
		.container {
			padding: 1rem;
		}

		.main-nav ul {
			gap: 0.25rem;
			padding: 0.75rem 1rem;
		}

		.main-nav a {
			padding: 0.6rem 1rem;
			font-size: 0.9rem;
		}

		.home-link {
			padding: 0.6rem !important;
		}

		:global(.toolbar) {
			padding: 1rem 1.25rem;
		}

		:global(.model-info) {
			font-size: 0.8rem;
		}

		:global(.content-area) {
			padding: 1.5rem;
			min-height: 0;
		}

		:global(.input-area) {
			padding: 1.25rem 1.5rem;
		}

		:global(.loading) {
			align-items: stretch;
			padding: 0;
		}
	}

	@media (max-width: 400px) {
		.container {
			padding: 0.75rem;
		}
	}
</style>
