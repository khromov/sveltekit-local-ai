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
								stroke-width="2"
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
								stroke-width="2"
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
	/* Base styles */
	:global(body) {
		margin: 0;
		padding: 0;
		font-family:
			-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
			'Helvetica Neue', sans-serif;
		font-size: 16px;
		line-height: 1.5;
		background-color: #f5f5f7;
		color: #333;
	}

	.container {
		width: 100%;
		max-width: 800px;
		margin: 0 auto;
		padding: 1rem;
		box-sizing: border-box;
	}

	.content-wrapper {
		width: 100%;
	}

	/* Navigation styles */
	.main-nav {
		margin-bottom: 1.5rem;
		width: 100%;
	}

	.main-nav ul {
		display: flex;
		justify-content: center;
		gap: 1rem;
		padding: 0;
		margin: 0;
		list-style: none;
		border-radius: 16px;
		background-color: white;
		padding: 0.5rem;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
		width: 100%;
		box-sizing: border-box;
	}

	.main-nav li {
		flex: 1;
		max-width: 180px;
	}

	.main-nav a {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.75rem 1.25rem;
		border-radius: 12px;
		text-decoration: none;
		color: #666;
		font-weight: 500;
		transition: all 0.2s ease;
	}

	.main-nav a:hover {
		background-color: #f0f0f0;
		color: #0071e3;
	}

	.main-nav a.active {
		background-color: #0071e3;
		color: white;
	}

	.nav-icon {
		width: 16px;
		height: 16px;
	}

	/* Shared component styling */
	:global(.card-interface) {
		border-radius: 16px;
		overflow: hidden;
		border: none;
		background-color: white;
		box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
		width: 100%;
	}

	:global(.toolbar) {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.25rem;
		background-color: #f8f8f8;
		border-bottom: 1px solid #e5e5e5;
	}

	:global(.model-info) {
		font-size: 1rem;
		font-weight: 500;
		color: #666;
	}

	:global(.content-area) {
		padding: 1.25rem;
		background-color: #f5f5f7;
		min-height: 300px;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	:global(.input-area) {
		padding: 1rem 1.25rem;
		border-top: 1px solid #e5e5e5;
		background-color: white;
	}

	:global(.disclaimer) {
		margin-top: 0.375rem;
		font-size: 0.8125rem;
		color: #8e8e93;
		text-align: center;
	}

	:global(.loading) {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.75rem;
		margin: 1rem 0;
		animation: fadeIn 0.4s ease-out;
		width: 100%;
	}

	:global(.loading-progress) {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
		padding: 2.5rem;
		background-color: white;
		border-radius: 20px;
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
		width: 100%;
		text-align: center;
	}

	:global(.loading-progress h3) {
		font-size: 1.5rem;
		font-weight: 600;
		margin: 0;
		color: #111;
	}

	:global(.progress-container) {
		width: 100%;
		margin: 0.5rem 0;
	}

	:global(.progress-bar) {
		height: 0.6rem;
		background-color: #e1e1e1;
		border-radius: 8px;
		overflow: hidden;
		width: 100%;
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	:global(.progress-bar-fill) {
		height: 100%;
		background-color: #0071e3;
		border-radius: 8px;
		background-image: linear-gradient(
			45deg,
			rgba(255, 255, 255, 0.15) 25%,
			transparent 25%,
			transparent 50%,
			rgba(255, 255, 255, 0.15) 50%,
			rgba(255, 255, 255, 0.15) 75%,
			transparent 75%,
			transparent
		);
		background-size: 1rem 1rem;
		animation: progress-animation 1s linear infinite;
	}

	:global(.loading-message) {
		font-size: 0.9375rem;
		color: #666;
		margin: 0;
		max-width: 320px;
	}

	:global(.error) {
		color: #ff3b30;
		background-color: #feeced;
		padding: 1.5rem;
		border-radius: 16px;
		text-align: center;
		box-shadow: 0 2px 12px rgba(255, 59, 48, 0.15);
		width: 100%;
		max-width: 500px;
		animation: errorPulse 2s infinite alternate;
	}

	:global(.error p) {
		font-size: 1.0625rem;
		margin-bottom: 1.25rem;
		line-height: 1.5;
	}

	:global(.error button) {
		padding: 0.875rem 1.5rem;
		background-color: #ff3b30;
		color: white;
		border: none;
		border-radius: 12px;
		cursor: pointer;
		font-size: 1.0625rem;
		font-weight: 500;
		transition: all 0.2s;
		box-shadow: 0 2px 8px rgba(255, 59, 48, 0.3);
	}

	:global(.error button:hover) {
		background-color: #e0352b;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(255, 59, 48, 0.4);
	}

	:global(.error button:active) {
		transform: translateY(0);
		box-shadow: 0 1px 3px rgba(255, 59, 48, 0.3);
	}

	:global(.primary-button) {
		padding: 0.875rem 1.5rem;
		background-color: #0071e3;
		color: white;
		border: none;
		border-radius: 14px;
		cursor: pointer;
		font-size: 1.125rem;
		font-weight: 500;
		transition: all 0.2s;
		box-shadow: 0 2px 8px rgba(0, 113, 227, 0.3);
	}

	:global(.primary-button:hover) {
		background-color: #0062cc;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(0, 113, 227, 0.4);
	}

	:global(.primary-button:active) {
		transform: translateY(0);
		box-shadow: 0 1px 3px rgba(0, 113, 227, 0.3);
	}

	:global(.primary-button:disabled) {
		background-color: #b0b0b0;
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
	}

	/* Animations */
	@keyframes -global-fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes -global-progress-animation {
		0% {
			background-position: 0 0;
		}
		100% {
			background-position: 1rem 0;
		}
	}

	@keyframes errorPulse {
		0% {
			box-shadow: 0 2px 12px rgba(255, 59, 48, 0.15);
		}
		100% {
			box-shadow: 0 2px 16px rgba(255, 59, 48, 0.3);
		}
	}

	/* Responsive adjustments */
	@media (max-width: 600px) {
		.container {
			padding: 0.75rem 1rem;
			margin: 0 auto;
		}

		.main-nav ul {
			gap: 0.5rem;
			padding: 0.375rem;
		}

		.main-nav a {
			padding: 0.625rem 0.75rem;
			font-size: 0.9375rem;
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
			border-radius: 12px;
		}

		:global(.content-area) {
			min-height: 250px;
		}

		:global(.loading-progress) {
			padding: 1.75rem;
		}
	}
</style>
