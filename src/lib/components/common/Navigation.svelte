<script lang="ts">
	import GithubIcon from 'virtual:icons/lucide/github';
	import GlobeIcon from 'virtual:icons/lucide/globe';
	import { createLocalizedLink, locales } from '$lib/i18n-utils';

	interface NavLink {
		path: string;
		label: string;
		Icon: any;
	}

	interface Props {
		currentLang: string;
		navLinks: NavLink[];
		page: {
			url: {
				pathname: string;
			};
		};
	}

	let { currentLang, navLinks, page }: Props = $props();

	function isActive(path: string): boolean {
		if (page.url.pathname === path) {
			return true;
		}
		const isLanguageHomePage = locales.some((locale) => path === `/${locale}`);
		if (!isLanguageHomePage && path !== '/' && page.url.pathname.startsWith(path + '/')) {
			return true;
		}
		return false;
	}
</script>

<nav class="main-nav">
	<ul>
		<div class="nav-left">
			{#each navLinks as link (link.path)}
				<li class="nav-item" class:home-item={!link.label}>
					<a href={link.path} class:active={isActive(link.path)} class:home-link={!link.label}>
						<link.Icon style="width: 20px; height: 20px; stroke-width: 2.5" />
						{#if link.label}
							<span>{link.label}</span>
						{/if}
					</a>
				</li>
			{/each}
		</div>
		<li class="home-item language-item">
			<a
				href={createLocalizedLink('/language', currentLang)}
				class="home-link"
				aria-label="Change language"
			>
				<GlobeIcon style="width: 20px; height: 20px; stroke-width: 2.5" />
			</a>
		</li>
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

<style>
	.main-nav {
		margin-bottom: 1rem;
		width: 100%;
		flex: 0 0 auto;
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

	.main-nav li,
	.nav-item {
		flex: none;
		list-style: none;
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

	.language-item .home-link,
	.github-item .home-link {
		border: var(--border-brutalist-thick);
		box-shadow: var(--shadow-brutalist-medium);
	}

	@media (max-width: 600px) {
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

		.nav-left {
			gap: 0.5rem;
		}

		.center-items {
			gap: 0.5rem;
		}

		.language-item .home-link,
		.github-item .home-link {
			border: var(--border-brutalist-thin);
			box-shadow: var(--shadow-brutalist-small);
		}
	}

	@media (max-width: 400px) {
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

		.language-item .home-link,
		.github-item .home-link {
			border: var(--border-brutalist-thin);
			box-shadow: var(--shadow-brutalist-small);
		}
	}
</style>
