<script lang="ts">
	import CardInterface from '$lib/components/common/CardInterface.svelte';
	import ContentArea from '$lib/components/common/ContentArea.svelte';
	import PrimaryButton from '$lib/components/common/PrimaryButton.svelte';
	import LanguageSelector from '$lib/components/common/LanguageSelector.svelte';
	import Toolbar from '$lib/components/common/Toolbar.svelte';

	interface Language {
		code: string;
		name: string;
		nativeName: string;
	}

	const availableLanguages: Language[] = [
		{ code: 'en', name: 'English', nativeName: 'English' },
		{ code: 'es', name: 'Spanish', nativeName: 'Español' },
		{ code: 'ja', name: 'Japanese', nativeName: '日本語' }
	];

	let selectedLanguage = $state('en');

	function handleLanguageChange(languageCode: string) {
		selectedLanguage = languageCode;
	}

	function handleSaveLanguage() {
		// TODO: Implement actual language saving/switching functionality
		console.log(`Language changed to: ${selectedLanguage}`);
		// For now, just show a placeholder action
	}

	function getSelectedLanguageInfo() {
		return availableLanguages.find((lang) => lang.code === selectedLanguage);
	}
</script>

<svelte:head>
	<title>Language Settings - Local AI Tools</title>
	<meta
		name="description"
		content="Change the language settings for the Local AI Tools application"
	/>
</svelte:head>

<CardInterface>
	<Toolbar modelInfo="Language Settings"></Toolbar>

	<ContentArea>
		<div class="language-settings">
			<div class="settings-section">
				<h2>Select Language</h2>
				<p class="description">
					Choose your preferred language for the interface. This setting will apply to all parts of
					the application.
				</p>

				<div class="language-selection">
					<LanguageSelector
						languages={availableLanguages}
						{selectedLanguage}
						onLanguageChange={handleLanguageChange}
					/>
				</div>

				<div class="current-selection">
					<h3>Current Selection:</h3>
					<div class="selection-info">
						<div class="language-display">
							<span class="language-code">{selectedLanguage.toUpperCase()}</span>
							<span class="language-name">{getSelectedLanguageInfo()?.name}</span>
							<span class="language-native">({getSelectedLanguageInfo()?.nativeName})</span>
						</div>
					</div>
				</div>

				<div class="save-section">
					<PrimaryButton onClick={handleSaveLanguage}>Save Language Settings</PrimaryButton>
				</div>
			</div>
		</div>
	</ContentArea>
</CardInterface>

<style>
	.language-settings {
		max-width: 600px;
		margin: 0 auto;
	}

	.settings-section {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	h2 {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-text-primary);
		margin: 0;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	h3 {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--color-text-primary);
		margin: 0;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.description {
		color: var(--color-text-secondary);
		font-size: 0.875rem;
		line-height: 1.5;
		margin: 0;
	}

	.language-selection {
		margin: 1rem 0;
	}

	.current-selection {
		padding: 1rem;
		background: var(--color-background-secondary);
		border: var(--border-brutalist-thick);
		border-radius: 8px;
		box-shadow: var(--shadow-brutalist-small);
	}

	.selection-info {
		margin-top: 0.75rem;
	}

	.language-display {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.language-code {
		padding: 0.375rem 0.75rem;
		background: var(--color-primary);
		color: var(--color-text-primary);
		border: var(--border-brutalist-thick);
		border-radius: 4px;
		font-weight: 700;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		box-shadow: var(--shadow-brutalist-small);
	}

	.language-name {
		font-weight: 600;
		color: var(--color-text-primary);
		font-size: 1rem;
		text-transform: uppercase;
		letter-spacing: 0.25px;
	}

	.language-native {
		font-weight: 500;
		color: var(--color-text-secondary);
		font-size: 0.875rem;
		font-style: italic;
	}

	.save-section {
		display: flex;
		justify-content: center;
		margin: 2rem 0;
	}

	@media (max-width: 600px) {
		.language-settings {
			max-width: none;
		}

		.language-display {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}

		h2 {
			font-size: 1.25rem;
		}

		h3 {
			font-size: 1rem;
		}
	}
</style>
