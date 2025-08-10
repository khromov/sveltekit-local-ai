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
									width="24"
									height="24"
									stroke="currentColor"
									stroke-width="2.5"
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
											width="24"
											height="24"
											stroke="currentColor"
											stroke-width="2.5"
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
											width="24"
											height="24"
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
		line-height: 1.6;
		background: linear-gradient(135deg, #f7f9f7 0%, #eef5ee 30%, #e3f2e3 70%, #d8eed8 100%);
		background-size: 400% 400%;
		background-attachment: fixed;
		animation: gentle-shift 30s ease infinite;
		color: #2e4a2e;
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
		background-image:
			radial-gradient(circle at 20% 80%, rgba(82, 121, 82, 0.03) 0%, transparent 50%),
			radial-gradient(circle at 80% 20%, rgba(107, 142, 107, 0.03) 0%, transparent 50%),
			linear-gradient(180deg, transparent 0%, rgba(46, 74, 46, 0.01) 100%);
		pointer-events: none;
		z-index: 1;
	}

	@keyframes gentle-shift {
		0% {
			background-position: 0% 0%;
		}
		25% {
			background-position: 100% 0%;
		}
		50% {
			background-position: 100% 100%;
		}
		75% {
			background-position: 0% 100%;
		}
		100% {
			background-position: 0% 0%;
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
		justify-content: flex-start;
		gap: 0.5rem;
		padding: 0;
		margin: 0;
		list-style: none;
		background: rgba(255, 255, 255, 0.9);
		padding: 0.75rem 1rem;
		box-sizing: border-box;
		border: 1px solid rgba(82, 121, 82, 0.2);
		box-shadow: 0 8px 32px rgba(82, 121, 82, 0.1);
		border-radius: 16px;
		backdrop-filter: blur(12px);
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
		padding: 0.75rem 1rem;
		text-decoration: none;
		color: #527952;
		font-weight: 500;
		font-size: 0.9rem;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		background: transparent;
		border: 1px solid transparent;
		border-radius: 12px;
		position: relative;
		text-transform: none;
		letter-spacing: 0.01em;
	}

	.main-nav a:hover {
		background: rgba(82, 121, 82, 0.08);
		color: #2e4a2e;
		transform: translateY(-1px);
		box-shadow: 0 4px 16px rgba(82, 121, 82, 0.15);
	}

	.main-nav a.active {
		background: linear-gradient(135deg, #527952 0%, #6b8e6b 100%);
		color: #ffffff;
		border-color: rgba(82, 121, 82, 0.3);
		box-shadow: 0 8px 24px rgba(82, 121, 82, 0.25);
	}

	.nav-icon {
		width: 20px;
		height: 20px;
	}

	.home-link {
		max-width: auto;
		flex: none;
		padding: 0.75rem !important;
	}

	/* Shared component styling - Refined Neo-Brutalist */
	:global(.card-interface) {
		border: 1px solid rgba(82, 121, 82, 0.2);
		background: rgba(255, 255, 255, 0.95);
		box-shadow: 0 16px 64px rgba(82, 121, 82, 0.12);
		width: 100%;
		position: relative;
		border-radius: 20px;
		overflow: hidden;
		box-sizing: border-box;
		backdrop-filter: blur(16px);
	}

	:global(.toolbar) {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.25rem 1.5rem;
		background: linear-gradient(135deg, #527952 0%, #6b8e6b 100%);
		border-bottom: 1px solid rgba(82, 121, 82, 0.2);
		flex-wrap: wrap;
		gap: 0.75rem;
		position: relative;
	}

	:global(.model-info) {
		font-size: 0.9rem;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.95);
		text-transform: none;
		letter-spacing: 0.01em;
		word-break: break-word;
		max-width: 100%;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	:global(.content-area) {
		padding: 1.5rem;
		background: rgba(255, 255, 255, 0.5);
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		box-sizing: border-box;
		min-height: 0;
		position: relative;
	}

	:global(.input-area) {
		padding: 1.25rem 1.5rem;
		border-top: 1px solid rgba(82, 121, 82, 0.15);
		background: rgba(247, 249, 247, 0.8);
		box-sizing: border-box;
		flex: 0 0 auto;
		backdrop-filter: blur(8px);
	}

	:global(.disclaimer) {
		margin-top: 0.75rem;
		font-size: 0.8125rem;
		font-weight: 400;
		color: rgba(82, 121, 82, 0.7);
		text-align: center;
		line-height: 1.5;
	}

	:global(.loading) {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		margin: 2rem 0;
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
		padding: 1rem 2rem;
		background: linear-gradient(135deg, #527952 0%, #6b8e6b 100%);
		color: #ffffff;
		border: 1px solid rgba(46, 74, 46, 0.2);
		border-radius: 12px;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 500;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 8px 32px rgba(82, 121, 82, 0.2);
		text-transform: none;
		letter-spacing: 0.01em;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		box-sizing: border-box;
		position: relative;
		overflow: hidden;
	}

	:global(.primary-button::before) {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
		transition: left 0.5s;
	}

	:global(.primary-button:hover) {
		background: linear-gradient(135deg, #6b8e6b 0%, #7da47d 100%);
		transform: translateY(-2px);
		box-shadow: 0 12px 48px rgba(82, 121, 82, 0.3);
	}

	:global(.primary-button:hover::before) {
		left: 100%;
	}

	:global(.primary-button:active) {
		transform: translateY(0);
		box-shadow: 0 4px 16px rgba(82, 121, 82, 0.2);
	}

	:global(.primary-button:disabled) {
		background: linear-gradient(135deg, #a0a0a0 0%, #b0b0b0 100%);
		color: #ffffff;
		cursor: not-allowed;
		transform: none;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
		opacity: 0.6;
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
			padding: 0.625rem 0.875rem;
			font-size: 0.875rem;
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
	}

	@media (max-width: 400px) {
		.container {
			padding: 0.5rem;
		}
	}
</style>
