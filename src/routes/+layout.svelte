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
	<!-- Nature-inspired decorative elements -->
	<svg
		class="nature-decoration"
		style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; opacity: 0.03;"
	>
		<pattern id="leaf-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
			<g transform="translate(50, 50)">
				<path
					d="M0,-30 Q-15,-15 -15,0 Q-15,15 0,30 Q15,15 15,0 Q15,-15 0,-30"
					fill="currentColor"
					opacity="0.3"
					transform="rotate(45)"
				/>
			</g>
			<g transform="translate(150, 150)">
				<circle cx="0" cy="0" r="3" fill="currentColor" opacity="0.2" />
				<circle cx="10" cy="5" r="2" fill="currentColor" opacity="0.15" />
				<circle cx="-8" cy="8" r="2.5" fill="currentColor" opacity="0.18" />
			</g>
		</pattern>
		<rect width="100%" height="100%" fill="url(#leaf-pattern)" />
	</svg>

	<div class="container">
		<nav class="main-nav">
			<ul>
				{#each navLinks as link (link.path)}
					{#if link.icon === 'home'}
						<li class="home-item">
							<a
								href={link.path}
								class:active={isActive(link.path)}
								class:home-link={link.icon === 'home'}
							>
								<!-- Organic home icon -->
								<svg class="nav-icon" viewBox="0 0 24 24" width="24" height="24" fill="none">
									<path
										d="M3 9.5L12 2L21 9.5V20C21 21 20 22 19 22H5C4 22 3 21 3 20V9.5Z"
										stroke="currentColor"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M9 22V12H15V22"
										stroke="currentColor"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<circle cx="12" cy="8" r="1.5" fill="currentColor" opacity="0.3" />
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
										<!-- Organic chat bubble -->
										<svg class="nav-icon" viewBox="0 0 24 24" width="24" height="24" fill="none">
											<path
												d="M20 14C20 15.5 18.5 17 17 17H7L3 21V5C3 3.5 4.5 2 6 2H17C18.5 2 20 3.5 20 5V14Z"
												stroke="currentColor"
												stroke-width="1.5"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
											<circle cx="8" cy="9" r="0.5" fill="currentColor" />
											<circle cx="12" cy="9" r="0.5" fill="currentColor" />
											<circle cx="16" cy="9" r="0.5" fill="currentColor" />
										</svg>
									{:else if link.icon === 'mic'}
										<!-- Organic microphone -->
										<svg class="nav-icon" viewBox="0 0 24 24" width="24" height="24" fill="none">
											<path
												d="M12 1C10.5 1 9 2.5 9 4V12C9 13.5 10.5 15 12 15C13.5 15 15 13.5 15 12V4C15 2.5 13.5 1 12 1Z"
												stroke="currentColor"
												stroke-width="1.5"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
											<path
												d="M19 10V12C19 15.5 16 19 12 19C8 19 5 15.5 5 12V10"
												stroke="currentColor"
												stroke-width="1.5"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
											<line
												x1="12"
												y1="19"
												x2="12"
												y2="23"
												stroke="currentColor"
												stroke-width="1.5"
												stroke-linecap="round"
											/>
											<line
												x1="8"
												y1="23"
												x2="16"
												y2="23"
												stroke="currentColor"
												stroke-width="1.5"
												stroke-linecap="round"
											/>
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
	/* Nature Distilled Color Palette */
	:global(:root) {
		/* Deep forest greens */
		--forest-primary: #2d5a3d;
		--forest-deep: #1e3a29;
		--forest-light: #4a7c59;
		--forest-muted: #6b8f71;

		/* Earthy neutrals */
		--earth-clay: #c4a57b;
		--earth-soil: #8b6f47;
		--earth-sand: #e8dcc6;
		--earth-stone: #a8a390;

		/* Natural accents */
		--moss-green: #88b378;
		--sage-green: #a8b99f;
		--bark-brown: #6b4c3a;
		--leaf-gold: #d4a574;

		/* Background tones */
		--bg-cream: #faf8f3;
		--bg-warm: #f5f0e8;
		--bg-cool: #f0f4f0;

		/* Text colors */
		--text-primary: #2c2416;
		--text-secondary: #5a5243;
		--text-muted: #8b8070;
	}

	/* Base styles with Nature Distilled aesthetic */
	:global(html) {
		height: 100%;
	}

	:global(body) {
		margin: 0;
		padding: 0;
		font-family:
			'Space Grotesk',
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			sans-serif;
		font-size: 16px;
		line-height: 1.6;
		background: linear-gradient(
			180deg,
			var(--bg-cream) 0%,
			var(--bg-warm) 50%,
			var(--bg-cool) 100%
		);
		background-attachment: fixed;
		color: var(--text-primary);
		position: relative;
		overflow-x: hidden;
		min-height: 100vh;
		/* Subtle paper texture effect */
		background-image:
			linear-gradient(180deg, var(--bg-cream) 0%, var(--bg-warm) 50%, var(--bg-cool) 100%),
			repeating-linear-gradient(
				90deg,
				transparent,
				transparent 2px,
				rgba(139, 111, 71, 0.03) 2px,
				rgba(139, 111, 71, 0.03) 4px
			);
	}

	/* Organic decoration */
	.nature-decoration {
		color: var(--forest-primary);
		animation: gentle-sway 20s ease-in-out infinite;
	}

	@keyframes gentle-sway {
		0%,
		100% {
			transform: translateX(0) rotate(0deg);
		}
		50% {
			transform: translateX(5px) rotate(1deg);
		}
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

	/* Navigation styles - Nature Distilled */
	.main-nav {
		margin-bottom: 2rem;
		width: 100%;
	}

	.main-nav ul {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 0.75rem;
		padding: 0;
		margin: 0;
		list-style: none;
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.9) 0%,
			rgba(250, 248, 243, 0.95) 100%
		);
		padding: 0.875rem;
		box-sizing: border-box;
		border: 1px solid rgba(139, 111, 71, 0.2);
		border-radius: 16px;
		backdrop-filter: blur(10px);
		box-shadow:
			0 4px 20px rgba(46, 90, 61, 0.08),
			inset 0 1px 0 rgba(255, 255, 255, 0.5);
	}

	.center-items {
		display: flex;
		gap: 0.75rem;
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
		padding: 0.625rem 1.125rem;
		text-decoration: none;
		color: var(--text-secondary);
		font-weight: 500;
		font-size: 0.9375rem;
		transition: all 0.3s ease;
		background: transparent;
		border: 1px solid transparent;
		border-radius: 12px;
		position: relative;
		letter-spacing: 0.02em;
	}

	.main-nav a:hover {
		background: rgba(136, 179, 120, 0.15);
		color: var(--forest-primary);
		transform: translateY(-1px);
	}

	.main-nav a.active {
		background: linear-gradient(135deg, var(--forest-light) 0%, var(--forest-primary) 100%);
		color: white;
		box-shadow:
			0 2px 10px rgba(45, 90, 61, 0.25),
			inset 0 1px 0 rgba(255, 255, 255, 0.1);
	}

	.nav-icon {
		width: 20px;
		height: 20px;
		transition: transform 0.3s ease;
	}

	.main-nav a:hover .nav-icon {
		transform: scale(1.1);
	}

	.home-link {
		padding: 0.625rem !important;
	}

	/* Shared component styling - Nature Distilled */
	:global(.card-interface) {
		border: 1px solid rgba(139, 111, 71, 0.2);
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.95) 0%,
			rgba(250, 248, 243, 0.98) 100%
		);
		box-shadow:
			0 8px 32px rgba(46, 90, 61, 0.1),
			0 2px 8px rgba(139, 111, 71, 0.08);
		width: 100%;
		position: relative;
		border-radius: 20px;
		overflow: hidden;
		box-sizing: border-box;
		backdrop-filter: blur(10px);
	}

	:global(.toolbar) {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.25rem 1.5rem;
		background: linear-gradient(135deg, var(--forest-light) 0%, var(--forest-primary) 100%);
		border-bottom: 1px solid rgba(255, 255, 255, 0.2);
		flex-wrap: wrap;
		gap: 0.5rem;
		position: relative;
		overflow: hidden;
	}

	:global(.toolbar)::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: repeating-linear-gradient(
			90deg,
			transparent,
			transparent 100px,
			rgba(255, 255, 255, 0.05) 100px,
			rgba(255, 255, 255, 0.05) 200px
		);
		pointer-events: none;
	}

	:global(.model-info) {
		font-size: 0.9375rem;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.95);
		letter-spacing: 0.03em;
		word-break: break-word;
		max-width: 100%;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	:global(.content-area) {
		padding: 2rem;
		background: transparent;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		box-sizing: border-box;
		min-height: 0;
	}

	:global(.input-area) {
		padding: 1.5rem;
		border-top: 1px solid rgba(139, 111, 71, 0.15);
		background: linear-gradient(180deg, transparent 0%, rgba(250, 248, 243, 0.5) 100%);
		box-sizing: border-box;
		flex: 0 0 auto;
	}

	:global(.disclaimer) {
		margin-top: 0.75rem;
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--text-muted);
		text-align: center;
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
		padding: 0.875rem 1.75rem;
		background: linear-gradient(135deg, var(--forest-light) 0%, var(--forest-primary) 100%);
		color: white;
		border: 1px solid rgba(46, 90, 61, 0.3);
		border-radius: 12px;
		cursor: pointer;
		font-size: 0.9375rem;
		font-weight: 600;
		transition: all 0.3s ease;
		box-shadow:
			0 4px 16px rgba(45, 90, 61, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.1);
		letter-spacing: 0.03em;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		box-sizing: border-box;
	}

	:global(.primary-button:hover) {
		transform: translateY(-2px);
		box-shadow:
			0 6px 24px rgba(45, 90, 61, 0.25),
			inset 0 1px 0 rgba(255, 255, 255, 0.15);
		background: linear-gradient(135deg, var(--moss-green) 0%, var(--forest-light) 100%);
	}

	:global(.primary-button:active) {
		transform: translateY(0);
		box-shadow:
			0 2px 8px rgba(45, 90, 61, 0.2),
			inset 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	:global(.primary-button:disabled) {
		background: linear-gradient(135deg, var(--earth-stone) 0%, var(--text-muted) 100%);
		color: rgba(255, 255, 255, 0.6);
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
		opacity: 0.7;
	}

	/* Responsive adjustments */
	@media (max-width: 600px) {
		.container {
			padding: 1rem;
		}

		.main-nav ul {
			gap: 0.5rem;
			padding: 0.75rem;
		}

		.main-nav a {
			padding: 0.5rem 0.875rem;
			font-size: 0.875rem;
		}

		.home-link {
			padding: 0.5rem !important;
		}

		:global(.toolbar) {
			padding: 1rem 1.25rem;
		}

		:global(.model-info) {
			font-size: 0.875rem;
		}

		:global(.content-area) {
			padding: 1.25rem;
		}

		:global(.input-area) {
			padding: 1.25rem;
		}
	}

	@media (max-width: 400px) {
		.container {
			padding: 0.75rem;
		}
	}
</style>
