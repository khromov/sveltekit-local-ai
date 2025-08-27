<script lang="ts">
	import { toast } from 'svelte-sonner';
	import {
		CardInterface,
		ContentArea,
		Toolbar,
		ActionButton,
		Toggle,
		TextInput,
		Dropdown,
		LanguageSelector,
		SectionCard,
		InfoBox,
		PrimaryButton,
		InputArea
	} from '$lib/components/common';
	import SettingsIcon from 'virtual:icons/lucide/settings';
	import SaveIcon from 'virtual:icons/lucide/save';
	import UserIcon from 'virtual:icons/lucide/user';
	import LockIcon from 'virtual:icons/lucide/lock';
	import BrainIcon from 'virtual:icons/lucide/brain';

	// Settings state
	let username = $state('');
	let enableNotifications = $state(true);
	let darkMode = $state(false);
	let autoSave = $state(true);
	let selectedTheme = $state<string | number>('');
	let selectedLanguage = $state('en');

	const themeOptions = [
		{ value: 'neo-brutalist', label: 'Neo-Brutalist (Current)' },
		{ value: 'minimal', label: 'Minimal' },
		{ value: 'classic', label: 'Classic' }
	];

	const languages = [
		{ code: 'en', name: 'English', nativeName: 'English' },
		{ code: 'es', name: 'Spanish', nativeName: 'Español' },
		{ code: 'sv', name: 'Swedish', nativeName: 'Svenska' }
	];

	function handleSaveSettings() {
		toast.success('Settings saved successfully!');
	}

	function handleLanguageChange(code: string) {
		selectedLanguage = code;
		toast.info(`Language changed to ${code}`);
	}
</script>

<svelte:head>
	<title>Settings - Local AI tools</title>
	<meta name="description" content="Configure your Local AI tools settings" />
</svelte:head>

<CardInterface>
	<Toolbar modelInfo="Application Settings" ModelIcon={SettingsIcon}>
		<ActionButton onClick={handleSaveSettings} Icon={SaveIcon}>Save All</ActionButton>
	</Toolbar>

	<ContentArea>
		<SectionCard>
			<div class="settings-group">
				<h3>Profile Settings</h3>
				<TextInput
					label="Display Name"
					bind:value={username}
					placeholder="Enter your display name"
					icon={UserIcon}
				/>

				<h3>General Options</h3>
				<div class="toggle-group">
					<Toggle
						bind:checked={enableNotifications}
						label="Enable Notifications"
						variant="switch"
					/>
					<Toggle
						bind:checked={darkMode}
						label="Dark Mode (Coming Soon)"
						variant="switch"
						disabled={true}
					/>
					<Toggle bind:checked={autoSave} label="Auto-save Settings" variant="switch" />
				</div>

				<h3>Theme & Language</h3>
				<Dropdown
					label="Theme"
					options={themeOptions}
					bind:value={selectedTheme}
					placeholder="Choose a theme..."
				/>
				<LanguageSelector {languages} {selectedLanguage} onLanguageChange={handleLanguageChange} />

				<h3>Model Configuration</h3>
				<InfoBox
					message="AI models run locally in your browser. No data is sent to external servers."
					Icon={LockIcon}
					variant="blue"
				/>
				<InfoBox
					message="Model settings will be available in future updates."
					Icon={BrainIcon}
					variant="warning"
				/>
			</div>
		</SectionCard>
	</ContentArea>

	<InputArea>
		<PrimaryButton onClick={handleSaveSettings} fullWidth={true}>Save All Settings</PrimaryButton>
	</InputArea>
</CardInterface>

<style>
	.settings-group {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.settings-group h3 {
		margin: 0 0 0.5rem 0;
		color: var(--color-text-primary);
		font-size: 1.25rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.toggle-group {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
</style>
