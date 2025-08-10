<script lang="ts">
	import { page } from '$app/stores';
	import '@fontsource/caveat/400.css';
	import '@fontsource/caveat/600.css';
	import '@fontsource/caveat/700.css';
	import '@fontsource/inter/400.css';
	import '@fontsource/inter/500.css';
	import '@fontsource/inter/600.css';

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
									fill="currentColor"
								>
									<!-- Forest Tree Home Icon -->
									<path
										d="M12 2l-3 4h2v2l-2 3h1.5v2l-2 3h1.5v6h5v-6h1.5l-2-3v-2h1.5l-2-3v-2h2l-3-4z"
										fill="#3a6e4a"
										stroke="#2d5d3a"
										stroke-width="0.5"
									/>
									<rect x="10.5" y="14" width="3" height="6" fill="#8b5a3c" />
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
											fill="currentColor"
										>
											<!-- Natural Speech Bubble -->
											<path
												d="M20 4c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h4l3 3 3-3h6c1.1 0 2-.9 2-2V4z"
												fill="#5a8c69"
												stroke="#4a7c59"
												stroke-width="0.5"
											/>
											<circle cx="8" cy="10" r="1.5" fill="#faf8f5" />
											<circle cx="12" cy="10" r="1.5" fill="#faf8f5" />
											<circle cx="16" cy="10" r="1.5" fill="#faf8f5" />
										</svg>
									{:else if link.icon === 'mic'}
										<svg
											class="nav-icon"
											viewBox="0 0 24 24"
											width="24"
											height="24"
											fill="currentColor"
										>
											<!-- Natural Microphone as Acorn -->
											<path
												d="M12 2c-1.5 0-3 1.5-3 3v6c0 1.5 1.5 3 3 3s3-1.5 3-3V5c0-1.5-1.5-3-3-3z"
												fill="#8b5a3c"
											/>
											<path
												d="M10 1c0-.5.5-1 2-1s2 .5 2 1v2c0 .5-.5 1-2 1s-2-.5-2-1V1z"
												fill="#6b4c3a"
											/>
											<path
												d="M18 11v1c0 3.3-2.7 6-6 6s-6-2.7-6-6v-1"
												stroke="#4a7c59"
												stroke-width="2"
												fill="none"
											/>
											<line x1="12" y1="18" x2="12" y2="22" stroke="#8b5a3c" stroke-width="2" />
											<path d="M9 22h6" stroke="#8b5a3c" stroke-width="2" />
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
	/* Nature Distilled Base Styles */
	:global(html) {
		height: 100%;
	}

	:global(body) {
		margin: 0;
		padding: 0;
		font-family:
			'Inter',
			system-ui,
			-apple-system,
			sans-serif;
		font-size: 16px;
		line-height: 1.6;
		background: linear-gradient(135deg, #faf8f5 0%, #f5f2ec 20%, #ebe5db 100%);
		background-attachment: fixed;
		color: #2a2a2a;
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
		background:
			radial-gradient(circle at 20% 30%, rgba(45, 93, 58, 0.03) 0%, transparent 40%),
			radial-gradient(circle at 80% 70%, rgba(106, 76, 58, 0.02) 0%, transparent 40%),
			linear-gradient(180deg, transparent 0%, rgba(139, 90, 60, 0.01) 100%);
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

	/* Nature Distilled Navigation */
	.main-nav {
		margin-bottom: 2rem;
		width: 100%;
	}

	.main-nav ul {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 1rem;
		padding: 0;
		margin: 0;
		list-style: none;
		background: rgba(250, 248, 245, 0.9);
		padding: 1rem 1.5rem;
		box-sizing: border-box;
		border: 1px solid rgba(58, 110, 74, 0.2);
		border-radius: 20px;
		backdrop-filter: blur(10px);
		box-shadow:
			0 8px 32px rgba(45, 93, 58, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
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
		gap: 0.625rem;
		padding: 0.875rem 1.25rem;
		text-decoration: none;
		color: #4a7c59;
		font-weight: 500;
		font-size: 0.95rem;
		font-family: 'Caveat', cursive;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		background: transparent;
		border: 1px solid transparent;
		border-radius: 15px;
		position: relative;
		letter-spacing: 0.2px;
	}

	.main-nav a:hover {
		background: rgba(90, 140, 105, 0.1);
		color: #3a6e4a;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(58, 110, 74, 0.2);
	}

	.main-nav a.active {
		background: linear-gradient(135deg, #5a8c69, #4a7c59);
		color: #faf8f5;
		border-color: rgba(45, 93, 58, 0.3);
		box-shadow:
			0 6px 20px rgba(58, 110, 74, 0.3),
			inset 0 1px 0 rgba(255, 255, 255, 0.2);
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

	/* Nature Distilled Shared Components */
	:global(.card-interface) {
		border: 1px solid rgba(74, 124, 89, 0.2);
		background: rgba(250, 248, 245, 0.95);
		backdrop-filter: blur(10px);
		box-shadow:
			0 20px 40px rgba(45, 93, 58, 0.1),
			0 8px 16px rgba(45, 93, 58, 0.05),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
		width: 100%;
		position: relative;
		border-radius: 24px;
		overflow: hidden;
		box-sizing: border-box;
	}

	:global(.toolbar) {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.25rem 1.5rem;
		background: linear-gradient(135deg, #5a8c69 0%, #4a7c59 100%);
		border-bottom: 1px solid rgba(58, 110, 74, 0.3);
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	:global(.model-info) {
		font-size: 1rem;
		font-weight: 600;
		font-family: 'Caveat', cursive;
		color: #faf8f5;
		letter-spacing: 0.3px;
		word-break: break-word;
		max-width: 100%;
	}

	:global(.content-area) {
		padding: 2rem;
		background: rgba(250, 248, 245, 0.5);
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		box-sizing: border-box;
		min-height: 0; /* allow children like chat list to control their own height */
	}

	:global(.input-area) {
		padding: 1.5rem;
		border-top: 1px solid rgba(74, 124, 89, 0.15);
		background: rgba(245, 242, 236, 0.8);
		backdrop-filter: blur(5px);
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
		background: linear-gradient(135deg, #5a8c69 0%, #4a7c59 100%);
		color: #faf8f5;
		border: 1px solid rgba(45, 93, 58, 0.3);
		border-radius: 16px;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 600;
		font-family: 'Caveat', cursive;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow:
			0 8px 24px rgba(58, 110, 74, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.2);
		letter-spacing: 0.3px;
		box-sizing: border-box;
	}

	:global(.primary-button:hover) {
		transform: translateY(-2px);
		box-shadow:
			0 12px 32px rgba(58, 110, 74, 0.3),
			inset 0 1px 0 rgba(255, 255, 255, 0.3);
		background: linear-gradient(135deg, #6b9d7a 0%, #5a8c69 100%);
	}

	:global(.primary-button:active) {
		transform: translateY(0);
		box-shadow:
			0 4px 16px rgba(58, 110, 74, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.1);
	}

	:global(.primary-button:disabled) {
		background: rgba(139, 90, 60, 0.3);
		color: rgba(250, 248, 245, 0.5);
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
			padding: 0.75rem 1rem;
		}

		.main-nav a {
			padding: 0.75rem 1rem;
			font-size: 0.9rem;
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
