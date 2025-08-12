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
	<div class="container" class:fullWidth={page.url.pathname === '/og'}>
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
									<HomeIcon class="nav-icon" />
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
											<MessageSquareIcon class="nav-icon" />
										{:else if link.icon === 'mic'}
											<MicIcon class="nav-icon" />
										{:else if link.icon === 'image'}
											<ImageIcon class="nav-icon" />
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
						<GithubIcon class="nav-icon" />
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
	/* Base styles with refined Neo-Brutalist approach */
	:global(html) {
		height: 100%;
	}

	:global(body) {
		margin: 0;
		padding: 0;
		font-family:
			'Space Grotesk',
			system-ui,
			-apple-system,
			sans-serif;
		font-size: 16px;
		line-height: 1.5;
		background: linear-gradient(135deg, #ffe5b4 0%, #e6e6fa 50%, #b4e7ce 100%);
		background-size: 200% 200%;
		background-attachment: fixed;
		animation: gradient-shift 20s ease infinite;
		color: #000;
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

	.content-wrapper {
		width: 100%;
		position: relative;
		overflow-x: hidden;
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	/* Navigation styles - Refined Neo-Brutalist */
	.main-nav {
		margin-bottom: 1rem;
		width: 100%;
	}

	.main-nav ul {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0;
		margin: 0;
		list-style: none;
		background: #fff;
		padding: 0.75rem;
		box-sizing: border-box;
		border: 3px solid #000;
		box-shadow: 5px 5px 0 #000;
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
		scrollbar-color: #000 transparent;
		padding-top: 4px;
		padding-bottom: 4px;
	}

	.nav-left::-webkit-scrollbar {
		height: 2px;
	}

	.nav-left::-webkit-scrollbar-thumb {
		background: #000;
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
		color: #000;
		font-weight: 600;
		font-size: 1rem;
		transition: all 0.2s ease;
		background: #fff;
		border: 2px solid transparent;
		border-radius: 8px;
		position: relative;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.main-nav a:hover {
		background: #ffe5b4;
		transform: translateY(-2px);
	}

	.main-nav a.active {
		background: #ffd700;
		border-color: #000;
		box-shadow: 3px 3px 0 #000;
	}

	:global(.nav-icon) {
		width: 20px;
		height: 20px;
		stroke-width: 2.5;
	}

	.home-link {
		padding: 0.75rem !important;
	}

	.github-item .home-link {
		border: 3px solid #000;
		box-shadow: 3px 3px 0 #000;
	}

	/* Shared component styling - Refined Neo-Brutalist */
	:global(.card-interface) {
		border: 3px solid #000;
		background: #fff;
		box-shadow: 6px 6px 0 #000;
		width: 100%;
		position: relative;
		border-radius: 12px;
		overflow: hidden;
		box-sizing: border-box;
		border-bottom-right-radius: 16px;
	}

	:global(.toolbar) {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.25rem;
		background: linear-gradient(90deg, #ffd700 0%, #ffa500 100%);
		border-bottom: 3px solid #000;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	:global(.model-info) {
		font-size: 0.875rem;
		font-weight: 700;
		color: #000;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		word-break: break-word;
		max-width: 100%;
	}

	:global(.content-area) {
		padding: 1.5rem;
		background: #fff;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		box-sizing: border-box;
		min-height: 0; /* allow children like chat list to control their own height */
	}

	:global(.input-area) {
		padding: 1rem 1.25rem;
		border-top: 3px solid #000;
		background: #f5f5f5;
		box-sizing: border-box;
		flex: 0 0 auto;
	}

	:global(.disclaimer) {
		margin-top: 0.5rem;
		font-size: 0.8125rem;
		font-weight: 500;
		color: #666;
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
		background: #ffd700;
		color: #000;
		border: 3px solid #000;
		border-radius: 8px;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 700;
		transition: all 0.2s;
		box-shadow: 4px 4px 0 #000;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		box-sizing: border-box;
	}

	:global(.primary-button:hover) {
		transform: translate(-2px, -2px);
		box-shadow: 6px 6px 0 #000;
	}

	:global(.primary-button:active) {
		transform: translate(0);
		box-shadow: 2px 2px 0 #000;
	}

	:global(.primary-button:disabled) {
		background: #e0e0e0;
		color: #999;
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
	}

	/* Responsive adjustments */
	@media (max-width: 600px) {
		.container {
			padding: 0.75rem;
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
			min-height: 0;
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
			border: 2px solid #000;
			box-shadow: 2px 2px 0 #000;
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
			border: 2px solid #000;
			box-shadow: 2px 2px 0 #000;
		}
	}
</style>
