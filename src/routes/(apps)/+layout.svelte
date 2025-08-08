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

<div class="app-wrapper">
	<div class="container">
		<nav class="main-nav">
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
									stroke-width="2.5"
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
</div>

<style>
	/* Base styles with refined Neo-Brutalist approach */
	:global(html) {
		height: 100%;
	}

	:global(body) {
		margin: 0;
		padding: 0;
		font-family: 'Space Grotesk', system-ui, -apple-system, sans-serif;
		font-size: 16px;
		line-height: 1.5;
		background: linear-gradient(135deg, #FFE5B4 0%, #E6E6FA 50%, #B4E7CE 100%);
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
		background-image: 
			repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(0,0,0,.02) 40px, rgba(0,0,0,.02) 41px);
		pointer-events: none;
		z-index: 1;
	}

	@keyframes gradient-shift {
		0% { background-position: 0% 50%; }
		50% { background-position: 100% 50%; }
		100% { background-position: 0% 50%; }
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
		margin-bottom: 2rem;
		width: 100%;
	}

	.main-nav ul {
		display: flex;
		justify-content: center;
		gap: 1rem;
		padding: 0;
		margin: 0;
		list-style: none;
		background: #FFF;
		padding: 0.75rem;
		box-sizing: border-box;
		border: 3px solid #000;
		box-shadow: 5px 5px 0 #000;
		border-radius: 12px;
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
		padding: 0.75rem 1.25rem;
		text-decoration: none;
		color: #000;
		font-weight: 600;
		font-size: 1rem;
		transition: all 0.2s ease;
		background: #FFF;
		border: 2px solid transparent;
		border-radius: 8px;
		position: relative;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.main-nav a:hover {
		background: #FFE5B4;
		transform: translateY(-2px);
	}

	.main-nav a.active {
		background: #FFD700;
		border-color: #000;
		box-shadow: 3px 3px 0 #000;
	}

	.nav-icon {
		width: 20px;
		height: 20px;
	}

	/* Shared component styling - Refined Neo-Brutalist */
	:global(.card-interface) {
		border: 3px solid #000;
		background: #FFF;
		box-shadow: 6px 6px 0 #000;
		width: 100%;
		position: relative;
		border-radius: 12px;
		overflow: hidden;
		box-sizing: border-box;
	}

	:global(.toolbar) {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.25rem;
		background: linear-gradient(90deg, #FFD700 0%, #FFA500 100%);
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
		background: #FFF;
		min-height: 300px;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		box-sizing: border-box;
	}

	:global(.input-area) {
		padding: 1rem 1.25rem;
		border-top: 3px solid #000;
		background: #F5F5F5;
		box-sizing: border-box;
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
		padding: 0.875rem 1.75rem;
		background: #FFD700;
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
		background: #E0E0E0;
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
			padding: 0.625rem 0.875rem;
			font-size: 0.875rem;
		}

		:global(.toolbar) {
			padding: 0.875rem 1rem;
		}

		:global(.model-info) {
			font-size: 0.75rem;
		}

		:global(.content-area) {
			padding: 1rem;
			min-height: 250px;
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
