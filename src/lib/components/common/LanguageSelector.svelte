<script lang="ts">
	import ChevronDownIcon from 'virtual:icons/lucide/chevron-down';

	interface Language {
		code: string;
		name: string;
		nativeName: string;
	}

	interface Props {
		languages: Language[];
		selectedLanguage: string;
		onLanguageChange: (languageCode: string) => void;
	}

	let { languages, selectedLanguage, onLanguageChange }: Props = $props();

	let isExpanded = $state(false);

	function handleLanguageChange(languageCode: string) {
		onLanguageChange(languageCode);
		isExpanded = false;
	}

	function getSelectedLanguage() {
		return languages.find((language) => language.code === selectedLanguage);
	}

	/*
	onMount(() => {
		if (window.document) {
			window.document.addEventListener('click', handleClickOutside);
		}
	});

	onDestroy(() => {
		if (window.document) {
			window.document.removeEventListener('click', handleClickOutside);
		}
	});
	*/
</script>

<div class="language-selector-container">
	<button
		class="language-selector-button"
		class:expanded={isExpanded}
		onclick={() => (isExpanded = !isExpanded)}
	>
		<span class="selected-language">
			{getSelectedLanguage()?.name || 'Select Language'}
		</span>
		<span class="arrow-icon" class:rotated={isExpanded}>
			<ChevronDownIcon />
		</span>
	</button>

	{#if isExpanded}
		<div class="language-dropdown">
			{#each languages as language (language.code)}
				<div class="language-option" class:selected={language.code === selectedLanguage}>
					<button class="language-btn" onclick={() => handleLanguageChange(language.code)}>
						<div class="language-info">
							<span class="language-name">{language.name}</span>
							<span class="language-native">{language.nativeName}</span>
						</div>
					</button>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.language-selector-container {
		position: relative;
		width: 100%;
		min-width: 200px;
	}

	.language-selector-button {
		width: 100%;
		padding: 0.625rem 0.875rem;
		background: var(--color-background-main);
		border: var(--border-brutalist-thick);
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 600;
		transition: all 0.2s;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: var(--shadow-brutalist-small);
		font-family: var(--font-family-primary);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		border-radius: 8px;
	}

	.language-selector-button:hover {
		transform: translate(-1px, -1px);
		box-shadow: var(--shadow-brutalist-medium);
	}

	.language-selector-button.expanded {
		background: var(--color-primary);
		transform: translate(-1px, -1px);
		box-shadow: var(--shadow-brutalist-medium);
	}

	.selected-language {
		color: var(--color-text-primary);
		text-align: left;
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.arrow-icon {
		display: flex;
		align-items: center;
		color: var(--color-text-primary);
		transition: transform 0.2s;
		flex-shrink: 0;
	}

	.arrow-icon :global(svg) {
		width: 1rem;
		height: 1rem;
	}

	.arrow-icon.rotated {
		transform: rotate(180deg);
	}

	.language-dropdown {
		position: absolute;
		top: calc(100% + 4px);
		left: 0;
		right: 0;
		background: var(--color-background-main);
		border: var(--border-brutalist-thick);
		border-radius: 8px;
		box-shadow: var(--shadow-brutalist-large);
		max-height: 300px;
		overflow-y: auto;
		z-index: 100;
		animation: dropdownOpen 0.2s ease-out;
	}

	@keyframes dropdownOpen {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.language-option {
		border-bottom: var(--border-brutalist-thin);
		transition: background 0.15s;
	}

	.language-option:last-child {
		border-bottom: none;
	}

	.language-option:hover {
		background: var(--color-background-tertiary);
	}

	.language-option.selected {
		background: var(--color-success);
	}

	.language-btn {
		width: 100%;
		padding: 0.75rem 0.875rem;
		background: none;
		border: none;
		text-align: left;
		cursor: pointer;
		font-family: var(--font-family-primary);
	}

	.language-info {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.language-name {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text-primary);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.language-native {
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--color-text-secondary);
		text-transform: none;
		letter-spacing: normal;
	}

	.language-dropdown::-webkit-scrollbar {
		width: 8px;
	}

	.language-dropdown::-webkit-scrollbar-track {
		background: var(--color-background-tertiary);
	}

	.language-dropdown::-webkit-scrollbar-thumb {
		background: var(--color-text-primary);
		border-radius: 4px;
	}

	@media (max-width: 600px) {
		.language-selector-container {
			min-width: auto;
		}
	}
</style>
