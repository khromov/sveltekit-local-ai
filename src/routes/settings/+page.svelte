<script lang="ts">
	import { CardInterface, ContentArea, Toolbar } from '$lib/components/common';
</script>

<svelte:head>
	<title>Settings - Local AI tools</title>
	<meta name="description" content="Configure your Local AI tools settings" />
</svelte:head>

<CardInterface>
	<Toolbar>
		<div class="model-info">Settings</div>
	</Toolbar>

	<ContentArea>
		<h2>Application Settings</h2>

		<div class="settings-section">
			<h3>General</h3>
			<p>Configure general application preferences.</p>
			<!-- Settings options will be added here -->
		</div>

		<div class="settings-section">
			<h3>Models</h3>
			<p>Manage your AI models and configurations.</p>
			<!-- Model settings will be added here -->
		</div>

		<div class="settings-section">
			<h3>Language</h3>
			<p>Select your preferred language for the interface.</p>
			<!-- Language settings will be added here -->
		</div>
	</ContentArea>
</CardInterface>

<style>
	h2 {
		margin: 0 0 1.5rem 0;
		color: var(--color-text-primary);
		font-size: 1.5rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.settings-section {
		margin-bottom: 2rem;
		padding: 1.5rem;
		border: var(--border-brutalist-thick);
		border-radius: 8px;
		background: var(--color-background-secondary);
		box-shadow: var(--shadow-brutalist-small);
	}

	.settings-section h3 {
		margin: 0 0 0.5rem 0;
		color: var(--color-text-primary);
		font-size: 1.25rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.settings-section p {
		margin: 0;
		color: var(--color-text-secondary);
		font-size: 0.875rem;
		line-height: 1.5;
	}
</style>
