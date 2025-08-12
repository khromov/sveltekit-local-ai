<script lang="ts">
	import { page } from '$app/state';
	import '@fontsource/space-grotesk/400.css';
	import '@fontsource/space-grotesk/500.css';
	import '@fontsource/space-grotesk/700.css';
	import '@fontsource/bebas-neue';
	import HomeIcon from 'virtual:icons/lucide/home';
	import MessageSquareIcon from 'virtual:icons/lucide/message-square';
	import MicIcon from 'virtual:icons/lucide/mic';
	import ImageIcon from 'virtual:icons/lucide/image';
	import GithubIcon from 'virtual:icons/lucide/github';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	// Navigation links
	const navLinks = [
		{ path: '/', label: '', icon: 'home' },
		{ path: '/chat', label: 'Chat', icon: 'chat' },
		{ path: '/transcribe', label: 'Transcribe', icon: 'mic' },
		{ path: '/background-remover', label: 'BG Remover', icon: 'image' }
	];

	// Check if a path is active
	function isActive(path: string): boolean {
		return page.url.pathname === path;
	}

	// Check if we're on the chat page (which uses fixed height)
	let isChatPage = $derived(page.url.pathname === '/chat');
</script>

<svelte:head>
	<title>{page.data.seo.title}</title>
	<meta name="description" content={page.data.seo.description} />

	<!-- Open Graph meta tags -->
	<meta property="og:title" content={page.data.seo.title} />
	<meta property="og:description" content={page.data.seo.description} />
	<meta property="og:image" content={page.data.seo.ogImage} />
	<meta property="og:url" content={page.data.seo.url} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Local AI Tools" />

	<!-- Twitter Card meta tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={page.data.seo.title} />
	<meta name="twitter:description" content={page.data.seo.description} />
	<meta name="twitter:image" content={page.data.seo.ogImage} />
</svelte:head>

<div class="app-wrapper">
	<div class="container" class:fullWidth={page.url.pathname === '/og'} class:chat-layout={isChatPage}>
		<nav class="main-nav">
			<ul>
				<div class="nav-left">
					{#each navLinks as link (link.path)}
						{#if link.icon === 'home'}
							<li class="home-item">
								<a
									href={link.path}
									class:active={isActive(link.path)}
									class:home-link={link.icon === 'home'}
								>
									<HomeIcon style="width: 20px; height: 20px; stroke-width: 2.5" />
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
											<MessageSquareIcon style="width: 20px; height: 20px; stroke-width: 2.5" />
										{:else if link.icon === 'mic'}
											<MicIcon style="width: 20px; height: 20px; stroke-width: 2.5" />
										{:else if link.icon === 'image'}
											<ImageIcon style="width: 20px; height: 20px; stroke-width: 2.5" />
										{/if}
										{#if link.label}
											<span>{link.label}</span>
										{/if}
									</a>
								</li>
							{/if}
						{/each}
					</div>
				</div>
				<li class="home-item github-item">
					<a
						href="https://github.com/khromov/sveltekit-local-ai"
						class="home-link"
						aria-label="View source on GitHub"
						target="_blank"
						rel="noopener noreferrer"
					>
						<GithubIcon style="width: 20px; height: 20px; stroke-width: 2.5" />
					</a>
				</li>
			</ul>
		</nav>

		<div class="content-wrapper">
			{@render children?.()}
		</div>
	</div>
</div>

<style>
	/* Neo-Brutalist Design System */
	:root {
		/* Colors - Primary */
		--color-primary: #ffd700;
		--color-primary-dark: #ffd93d;
		--color-primary-hover: #ffcc00;

		/* Colors - State */
		--color-success: #98fb98;
		--color-success-hover: #90ee90;
		--color-danger: #ff6b6b;
		--color-danger-hover: #ff5252;
		--color-warning: #ffa500;
		--color-warning-hover: #ff8c00;

		/* Colors - Accent */
		--color-accent-pink: #ff69b4;
		--color-accent-blue: #87ceeb;
		--color-accent-light-green: #b4e7ce;

		/* Colors - Background */
		--color-background-main: #fff;
		--color-background-secondary: #f5f5f5;
		--color-background-tertiary: #f0f0f0;
		--color-background-disabled: #e0e0e0;
		--color-background-cream: #fffacd;
		--color-background-light-blue: #f0f8ff;
		--color-background-light-green: #f0fff0;
		--color-background-light-pink: #ffe4e1;

		/* Colors - Border */
		--color-border-primary: #000;
		--color-border-secondary: #333;

		/* Colors - Text */
		--color-text-primary: #000;
		--color-text-secondary: #333;
		--color-text-tertiary: #666;
		--color-text-disabled: #999;
		--color-text-inverse: #fff;
		--color-text-danger: #d62828;

		/* Colors - Gradient Backgrounds */
		--color-gradient-gold: #ffe5b4;
		--color-gradient-lavender: #e6e6fa;
		--color-gradient-mint: #b4e7ce;

		/* Typography */
		--font-family-primary: 'Space Grotesk', system-ui, -apple-system, sans-serif;
		--font-family-display: 'Bebas Neue', sans-serif;

		/* Shadows & Effects */
		--shadow-brutalist-small: 2px 2px 0 var(--color-border-primary);
		--shadow-brutalist-medium: 4px 4px 0 var(--color-border-primary);
		--shadow-brutalist-large: 6px 6px 0 var(--color-border-primary);
		--shadow-brutalist-xlarge: 8px 8px 0 var(--color-border-primary);

		/* Borders */
		--border-brutalist-thin: 2px solid var(--color-border-primary);
		--border-brutalist-thick: 3px solid var(--color-border-primary);
		--border-brutalist-extra-thick: 4px solid var(--color-border-primary);
	}

	/* Base styles with refined Neo-Brutalist approach */
	:global(html) {
		height: 100%;
	}

	:global(body) {
		margin: 0;
		padding: 0;
		font-family: var(--font-family-primary);
		font-size: 16px;
		line-height: 1.5;
		background: linear-gradient(135deg, var(--color-gradient-gold) 0%, var(--color-gradient-lavender) 50%, var(--color-gradient-mint) 100%);
		background-size: 200% 200%;
		background-attachment: fixed;
		animation: gradient-shift 20s ease infinite;
		color: var(--color-text-primary);
		position: relative;
		overflow-x: hidden;
		min-height: 100vh;
	}

	:global(body)::before {
		content: '';
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-image: repeating-linear-gradient(
			0deg,
			transparent,
			transparent 40px,
			rgba(0, 0, 0, 0.02) 40px,
			rgba(0, 0, 0, 0.02) 41px
		);
		pointer-events: none;
		z-index: 1;
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

	.container.fullWidth {
		width: 100% !important;
		max-width: 9000px;
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
		padding: 1rem;
		box-sizing: border-box;
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	/* Only apply height constraints for chat layout */
	.container.chat-layout {
		height: 100vh; /* Full viewport height for chat interface */
	}

	.content-wrapper {
		width: 100%;
		position: relative;
		flex: 1;
		display: flex;
		flex-direction: column;
		min-height: 0; /* Critical for nested flex scrolling */
	}

	/* Only apply overflow hidden for chat layout */
	.container.chat-layout .content-wrapper {
		overflow: hidden; /* Prevent overall page scroll when chat scrolls */
	}

	/* Navigation styles - Refined Neo-Brutalist */
	.main-nav {
		margin-bottom: 1rem;
		width: 100%;
		flex: 0 0 auto; /* Don't grow/shrink */
	}

	.main-nav ul {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0;
		margin: 0;
		list-style: none;
		background: var(--color-background-main);
		padding: 0.75rem;
		box-sizing: border-box;
		border: var(--border-brutalist-thick);
		box-shadow: 5px 5px 0 var(--color-border-primary);
		border-radius: 12px;
	}

	.nav-left {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: nowrap;
		overflow-x: auto;
		flex: 1;
		min-width: 0;
		scrollbar-width: thin;
		scrollbar-color: var(--color-border-primary) transparent;
		padding-top: 4px;
		padding-bottom: 4px;
	}

	.nav-left::-webkit-scrollbar {
		height: 2px;
	}

	.nav-left::-webkit-scrollbar-thumb {
		background: var(--color-border-primary);
	}

	.center-items {
		display: flex;
		gap: 1rem;
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
		color: var(--color-text-primary);
		font-weight: 600;
		font-size: 1rem;
		transition: all 0.2s ease;
		background: var(--color-background-main);
		border: 2px solid transparent;
		border-radius: 8px;
		position: relative;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.main-nav a:hover {
		background: var(--color-gradient-gold);
		transform: translateY(-2px);
	}

	.main-nav a.active {
		background: var(--color-primary);
		border-color: var(--color-border-primary);
		box-shadow: var(--shadow-brutalist-medium);
	}

	.home-link {
		padding: 0.75rem !important;
	}

	.github-item .home-link {
		border: var(--border-brutalist-thick);
		box-shadow: var(--shadow-brutalist-medium);
	}

	/* Shared component styling - Refined Neo-Brutalist */
	:global(.card-interface) {
		border: var(--border-brutalist-thick);
		background: var(--color-background-main);
		box-shadow: var(--shadow-brutalist-large);
		width: 100%;
		position: relative;
		border-radius: 12px;
		overflow: hidden;
		box-sizing: border-box;
		border-bottom-right-radius: 16px;
		display: flex;
		flex-direction: column;
	}

	/* Only apply flex and scrolling constraints to fixed-height CardInterfaces */
	:global(.chat-layout .card-interface.fixed-height) {
		flex: 1; /* Take remaining space */
		min-height: 0; /* Critical for flex scrolling */
	}

	:global(.toolbar) {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.25rem;
		background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-warning) 100%);
		border-bottom: var(--border-brutalist-thick);
		flex-wrap: wrap;
		gap: 0.5rem;
		flex: 0 0 auto; /* Don't grow/shrink */
	}

	:global(.model-info) {
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--color-text-primary);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		word-break: break-word;
		max-width: 100%;
	}

	:global(.content-area) {
		padding: 1.5rem;
		background: var(--color-background-main);
		display: flex;
		flex-direction: column;
		gap: 1rem;
		box-sizing: border-box;
	}

	/* Only apply flex and scrolling constraints to content areas in chat layout with fixed-height CardInterfaces */
	:global(.chat-layout .card-interface.fixed-height .content-area) {
		flex: 1; /* Take remaining space */
		min-height: 0; /* Critical for flex scrolling */
		overflow-y: auto; /* Allow scrolling when needed */
	}

	:global(.input-area) {
		padding: 1rem 1.25rem;
		border-top: var(--border-brutalist-thick);
		background: var(--color-background-secondary);
		box-sizing: border-box;
		flex: 0 0 auto; /* Don't grow/shrink */
	}

	:global(.disclaimer) {
		margin-top: 0.5rem;
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--color-text-tertiary);
		text-align: center;
	}

	:global(.loading) {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		animation: fadeIn 0.4s ease-out;
		width: 100%;
		box-sizing: border-box;
		flex: 1;
		justify-content: center;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	:global(.primary-button) {
		padding: 0.875rem 1.75rem;
		background: var(--color-primary);
		color: var(--color-text-primary);
		border: var(--border-brutalist-thick);
		border-radius: 8px;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 700;
		transition: all 0.2s;
		box-shadow: var(--shadow-brutalist-medium);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-family: var(--font-family-primary);
		box-sizing: border-box;
	}

	:global(.primary-button:hover) {
		transform: translate(-2px, -2px);
		box-shadow: var(--shadow-brutalist-large);
	}

	:global(.primary-button:active) {
		transform: translate(0);
		box-shadow: var(--shadow-brutalist-small);
	}

	:global(.primary-button:disabled) {
		background: var(--color-background-disabled);
		color: var(--color-text-disabled);
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
	}

	/* Responsive adjustments */
	@media (max-width: 600px) {
		.container {
			padding: 0.75rem;
		}

		.container.chat-layout {
			height: 100vh; /* Full height on mobile */
		}

		.main-nav ul {
			gap: 0.5rem;
			padding: 0.5rem;
		}

		.main-nav a {
			padding: 0.625rem;
			font-size: 0.875rem;
		}

		.main-nav a span {
			display: none;
		}

		.home-link {
			padding: 0.625rem !important;
		}

		:global(.toolbar) {
			padding: 0.875rem 1rem;
		}

		:global(.model-info) {
			font-size: 0.75rem;
		}

		:global(.content-area) {
			padding: 1rem;
		}

		:global(.input-area) {
			padding: 0.875rem 1rem;
		}

		:global(.loading) {
			align-items: stretch;
			padding: 0;
		}

		.nav-left {
			gap: 0.5rem;
		}

		.center-items {
			gap: 0.5rem;
		}

		.github-item .home-link {
			border: var(--border-brutalist-thin);
			box-shadow: var(--shadow-brutalist-small);
		}
	}

	@media (max-width: 400px) {
		.container {
			padding: 0.5rem;
		}

		.main-nav a {
			padding: 0.5rem 0.75rem;
			font-size: 0.8125rem;
		}

		.nav-left {
			gap: 0.375rem;
		}

		.center-items {
			gap: 0.375rem;
		}

		.github-item .home-link {
			border: var(--border-brutalist-thin);
			box-shadow: var(--shadow-brutalist-small);
		}
	}
</style>
