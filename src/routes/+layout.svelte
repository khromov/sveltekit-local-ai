<script lang="ts">
	import '../app.css';
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
		{
			path: '/transcribe',
			label: 'Transcribe',
			icon: 'mic'
		}
	];

	// Check if a path is active
	function isActive(path: string): boolean {
		return $page.url.pathname === path;
	}
</script>

<div
	class="before:bg-repeating-stripes-4 relative z-[2] flex min-h-screen flex-col before:pointer-events-none before:fixed before:inset-0 before:z-[1] before:content-['']"
>
	<div class="mx-auto box-border flex w-full max-w-[900px] flex-1 flex-col p-4">
		<nav class="mb-4 w-full">
			<ul
				class="shadow-neo-lg m-0 box-border flex list-none items-center justify-start gap-4 rounded-xl border-[3px] border-black bg-white p-0 p-3"
			>
				<div class="flex gap-4">
					{#each navLinks as link (link.path)}
						{#if link.icon === 'home'}
							<li class="flex-none">
								<a
									href={link.path}
									class="hover:bg-neo-peach relative flex flex-row items-center justify-center gap-2 rounded-lg border-2 border-transparent bg-white px-5 py-3 text-base font-semibold tracking-[0.5px] text-black uppercase no-underline transition-all duration-200 ease-in-out hover:-translate-y-0.5 {isActive(
										link.path
									)
										? 'bg-neo-yellow-light shadow-neo border-black'
										: ''} {link.icon === 'home' ? 'max-w-auto flex-none !p-3' : ''}"
								>
									<svg
										class="h-5 w-5"
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
					{#each navLinks as link (link.path)}
						{#if link.icon !== 'home'}
							<li class="list-none">
								<a
									href={link.path}
									class="hover:bg-neo-peach relative flex flex-row items-center justify-center gap-2 rounded-lg border-2 border-transparent bg-white px-5 py-3 text-base font-semibold tracking-[0.5px] text-black uppercase no-underline transition-all duration-200 ease-in-out hover:-translate-y-0.5 {isActive(
										link.path
									)
										? 'bg-neo-yellow-light shadow-neo border-black'
										: ''}"
								>
									{#if link.icon === 'chat'}
										<svg
											class="h-5 w-5"
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
											class="h-5 w-5"
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

		<div class="relative flex w-full flex-1 flex-col overflow-x-hidden">
			{@render children?.()}
		</div>
	</div>
</div>

<style>
	/* Global styles */
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

	/* Shared component styling */
	:global(.card-interface) {
		border: 3px solid #000;
		background: #fff;
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
		min-height: 0;
	}

	:global(.input-area) {
		padding: 1rem 1.25rem;
		border-top: 3px solid #000;
		background: #f5f5f5;
		box-sizing: border-box;
		flex: 0 0 auto;
	}

	/* Responsive adjustments */
	@media (max-width: 600px) {
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
	}
</style>
