<script lang="ts">
	import {
		Button,
		Card,
		Input,
		Select,
		Toggle,
		Badge,
		Alert,
		Modal,
		Spinner
	} from '$lib/components/common';

	// Icons for demo
	import HeartIcon from 'virtual:icons/lucide/heart';
	import StarIcon from 'virtual:icons/lucide/star';
	import UserIcon from 'virtual:icons/lucide/user';
	import MailIcon from 'virtual:icons/lucide/mail';
	import SettingsIcon from 'virtual:icons/lucide/settings';
	import SaveIcon from 'virtual:icons/lucide/save';
	import TrashIcon from 'virtual:icons/lucide/trash';
	import SearchIcon from 'virtual:icons/lucide/search';

	// Demo state
	let inputValue = $state('');
	let textareaValue = $state('');
	let emailValue = $state('');
	let passwordValue = $state('');
	let selectValue = $state('');
	let toggleValue = $state(false);
	let modalVisible = $state(false);
	let alertVisible = $state(true);
	let loading = $state(false);

	// Demo data
	const selectOptions = [
		{ value: 'option1', label: 'First Option' },
		{ value: 'option2', label: 'Second Option' },
		{ value: 'option3', label: 'Third Option' },
		{ value: 'disabled', label: 'Disabled Option', disabled: true }
	];

	const badges = $state(['React', 'Vue', 'Svelte', 'Angular']);

	function handleLoadingDemo() {
		loading = true;
		setTimeout(() => {
			loading = false;
		}, 3000);
	}

	function removeBadge(index: number) {
		badges.splice(index, 1);
	}
</script>

<svelte:head>
	<title>Brutalist UI Library Demo</title>
	<meta name="description" content="A showcase of the brutalist design system UI components" />
</svelte:head>

<div class="demo-page">
	<div class="demo-header">
		<h1>Brutalist UI Library</h1>
		<p class="demo-subtitle">
			A comprehensive collection of bold, accessible components with a distinctive brutalist design
			aesthetic.
		</p>
	</div>

	<!-- Buttons Section -->
	<Card padding="large" decorative animated>
		<h2>Buttons</h2>
		<div class="component-grid">
			<div class="demo-group">
				<h3>Variants</h3>
				<div class="button-grid">
					<Button variant="primary">Primary</Button>
					<Button variant="success">Success</Button>
					<Button variant="warning">Warning</Button>
					<Button variant="danger">Danger</Button>
				</div>
			</div>

			<div class="demo-group">
				<h3>Sizes & States</h3>
				<div class="button-grid">
					<Button size="small">Small</Button>
					<Button size="medium">Medium</Button>
					<Button size="large">Large</Button>
					<Button disabled>Disabled</Button>
					<Button {loading} onClick={handleLoadingDemo}>
						{loading ? 'Loading...' : 'Toggle Loading'}
					</Button>
				</div>
			</div>

			<div class="demo-group">
				<h3>With Icons</h3>
				<div class="button-grid">
					<Button Icon={HeartIcon}>Like</Button>
					<Button Icon={SaveIcon} variant="success">Save</Button>
					<Button Icon={TrashIcon} variant="danger">Delete</Button>
					<Button Icon={SettingsIcon} fullWidth>Full Width</Button>
				</div>
			</div>
		</div>
	</Card>

	<!-- Inputs Section -->
	<Card padding="large" variant="primary" decorative animated>
		<h2>Form Inputs</h2>
		<div class="component-grid">
			<div class="demo-group">
				<h3>Text Inputs</h3>
				<div class="input-grid">
					<Input
						bind:value={inputValue}
						label="Basic Input"
						placeholder="Enter some text..."
						fullWidth
					/>
					<Input
						bind:value={emailValue}
						type="email"
						label="Email"
						placeholder="your@email.com"
						Icon={MailIcon}
						fullWidth
					/>
					<Input bind:value={passwordValue} type="password" label="Password" required fullWidth />
					<Input
						bind:value={textareaValue}
						label="Textarea"
						placeholder="Enter multiple lines..."
						rows={4}
						fullWidth
					/>
					<Input value="Disabled input" label="Disabled" disabled fullWidth />
					<Input value="Error state" label="With Error" error="This field has an error" fullWidth />
				</div>
			</div>

			<div class="demo-group">
				<h3>Select Dropdown</h3>
				<div class="input-grid">
					<Select
						bind:value={selectValue}
						options={selectOptions}
						label="Choose Option"
						placeholder="Select something..."
						fullWidth
					/>
					<Select
						bind:value={selectValue}
						options={selectOptions}
						label="With Icon"
						Icon={UserIcon}
						fullWidth
					/>
					<Select options={selectOptions} label="Disabled Select" disabled fullWidth />
				</div>
			</div>
		</div>
	</Card>

	<!-- Toggles Section -->
	<Card padding="large" variant="success" decorative animated>
		<h2>Toggles & Switches</h2>
		<div class="component-grid">
			<div class="demo-group">
				<h3>Basic Toggles</h3>
				<div class="toggle-grid">
					<Toggle
						bind:checked={toggleValue}
						label="Enable Notifications"
						description="Get notified about important updates"
					/>
					<Toggle checked={true} label="Dark Mode" description="Use dark theme" variant="success" />
					<Toggle
						checked={false}
						label="Marketing Emails"
						description="Receive promotional content"
						variant="warning"
					/>
					<Toggle
						checked={false}
						label="Delete Account"
						description="This action cannot be undone"
						variant="danger"
					/>
				</div>
			</div>

			<div class="demo-group">
				<h3>Sizes & States</h3>
				<div class="toggle-grid">
					<Toggle checked={true} label="Small" size="small" />
					<Toggle checked={true} label="Medium" size="medium" />
					<Toggle checked={true} label="Large" size="large" />
					<Toggle checked={false} label="Disabled" disabled />
				</div>
			</div>
		</div>
	</Card>

	<!-- Badges Section -->
	<Card padding="large" variant="warning" decorative animated>
		<h2>Badges & Tags</h2>
		<div class="component-grid">
			<div class="demo-group">
				<h3>Variants</h3>
				<div class="badge-grid">
					<Badge>Default</Badge>
					<Badge variant="primary">Primary</Badge>
					<Badge variant="success">Success</Badge>
					<Badge variant="warning">Warning</Badge>
					<Badge variant="danger">Danger</Badge>
				</div>
			</div>

			<div class="demo-group">
				<h3>Sizes & Styles</h3>
				<div class="badge-grid">
					<Badge size="small">Small</Badge>
					<Badge size="medium">Medium</Badge>
					<Badge size="large">Large</Badge>
					<Badge outlined>Outlined</Badge>
					<Badge Icon={StarIcon}>With Icon</Badge>
				</div>
			</div>

			<div class="demo-group">
				<h3>Removable Tags</h3>
				<div class="badge-grid">
					{#each badges as badge, index (badge)}
						<Badge variant="primary" removable onRemove={() => removeBadge(index)}>
							{badge}
						</Badge>
					{/each}
				</div>
			</div>
		</div>
	</Card>

	<!-- Alerts Section -->
	<Card padding="large" decorative animated>
		<h2>Alerts & Notifications</h2>
		<div class="component-grid">
			<div class="demo-group">
				<h3>Alert Types</h3>
				<div class="alert-stack">
					<Alert variant="info" title="Information">
						This is an informational alert with some helpful context.
					</Alert>
					<Alert variant="success" title="Success!" dismissible bind:visible={alertVisible}>
						Your action was completed successfully.
					</Alert>
					<Alert variant="warning" title="Warning">
						Please review the following information carefully.
					</Alert>
					<Alert variant="danger" title="Error" dismissible>
						Something went wrong. Please try again later.
					</Alert>
				</div>
			</div>
		</div>
	</Card>

	<!-- Spinners Section -->
	<Card padding="large" variant="primary" decorative animated>
		<h2>Loading States</h2>
		<div class="component-grid">
			<div class="demo-group">
				<h3>Spinner Variants</h3>
				<div class="spinner-grid">
					<Spinner size="small" text="Small" />
					<Spinner size="medium" text="Medium" />
					<Spinner size="large" text="Large" />
					<Spinner size="xlarge" text="Extra Large" />
				</div>
			</div>

			<div class="demo-group">
				<h3>Colored Spinners</h3>
				<div class="spinner-grid">
					<Spinner variant="primary" text="Primary" />
					<Spinner variant="success" text="Success" />
					<Spinner variant="warning" text="Warning" />
					<Spinner variant="danger" text="Danger" />
				</div>
			</div>
		</div>
	</Card>

	<!-- Modal Section -->
	<Card padding="large" variant="success" decorative animated>
		<h2>Modal Dialog</h2>
		<div class="component-grid">
			<div class="demo-group">
				<h3>Interactive Modal</h3>
				<div class="button-grid">
					<Button onClick={() => (modalVisible = true)}>Open Modal</Button>
				</div>
				<p class="demo-hint">
					Click the button above to see the modal in action. It supports different sizes, backdrop
					styles, and can be closed via ESC key or backdrop click.
				</p>
			</div>
		</div>
	</Card>

	<!-- API Reference -->
	<Card padding="large" decorative animated>
		<h2>Component API</h2>
		<div class="api-grid">
			<div class="api-section">
				<h3>Button</h3>
				<ul>
					<li><code>variant</code>: 'primary' | 'success' | 'warning' | 'danger'</li>
					<li><code>size</code>: 'small' | 'medium' | 'large'</li>
					<li><code>fullWidth</code>: boolean</li>
					<li><code>loading</code>: boolean</li>
					<li><code>disabled</code>: boolean</li>
					<li><code>Icon</code>: Svelte component</li>
				</ul>
			</div>

			<div class="api-section">
				<h3>Input</h3>
				<ul>
					<li><code>type</code>: 'text' | 'email' | 'password' | 'number'</li>
					<li><code>label</code>: string</li>
					<li><code>placeholder</code>: string</li>
					<li><code>error</code>: string</li>
					<li><code>required</code>: boolean</li>
					<li><code>rows</code>: number (for textarea)</li>
				</ul>
			</div>

			<div class="api-section">
				<h3>Select</h3>
				<ul>
					<li>
						<code>options</code>: Array&lt;Option&gt; - Option has value, label, disabled properties
					</li>
					<li><code>placeholder</code>: string</li>
					<li><code>Icon</code>: Svelte component</li>
				</ul>
			</div>

			<div class="api-section">
				<h3>Toggle</h3>
				<ul>
					<li><code>checked</code>: boolean</li>
					<li><code>label</code>: string</li>
					<li><code>description</code>: string</li>
					<li><code>size</code>: 'small' | 'medium' | 'large'</li>
				</ul>
			</div>
		</div>
	</Card>
</div>

<!-- Modal -->
<Modal bind:visible={modalVisible} title="Example Modal" size="medium" backdrop="blur">
	<div class="modal-content">
		<p>This is a sample modal dialog with the brutalist design system styling.</p>

		<Input
			bind:value={inputValue}
			label="Input in Modal"
			placeholder="Type something..."
			Icon={SearchIcon}
			fullWidth
		/>

		<div class="modal-actions">
			<Button onClick={() => (modalVisible = false)}>Cancel</Button>
			<Button variant="success" onClick={() => (modalVisible = false)}>Save Changes</Button>
		</div>
	</div>
</Modal>

<style>
	.demo-page {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.demo-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.demo-header h1 {
		font-family: var(--font-family-display);
		font-size: 3rem;
		color: var(--color-text-primary);
		margin: 0;
		text-transform: uppercase;
		letter-spacing: 3px;
		background: var(--color-primary);
		padding: 1rem 2rem;
		border: var(--border-brutalist-extra-thick);
		box-shadow: var(--shadow-brutalist-xlarge);
		transform: rotate(-1deg);
		display: inline-block;
	}

	.demo-subtitle {
		font-size: 1.25rem;
		color: var(--color-text-secondary);
		margin-top: 1rem;
		font-weight: 500;
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
		line-height: 1.6;
	}

	h2 {
		font-family: var(--font-family-display);
		font-size: 2rem;
		color: var(--color-text-primary);
		margin: 0 0 1.5rem 0;
		text-transform: uppercase;
		letter-spacing: 2px;
		background: var(--color-background-main);
		padding: 0.5rem 1rem;
		border: var(--border-brutalist-thick);
		box-shadow: var(--shadow-brutalist-medium);
		transform: rotate(-0.5deg);
		width: fit-content;
	}

	h3 {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-text-primary);
		margin: 0 0 1rem 0;
		text-transform: uppercase;
		letter-spacing: 1px;
		background: var(--color-background-tertiary);
		padding: 0.5rem 1rem;
		border: var(--border-brutalist-thin);
		border-radius: 6px;
		width: fit-content;
	}

	.component-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		align-items: start;
	}

	.demo-group {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.button-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		align-items: center;
	}

	.input-grid {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.toggle-grid {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.badge-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		align-items: center;
	}

	.spinner-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		gap: 1.5rem;
		justify-items: center;
		text-align: center;
	}

	.alert-stack {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.demo-hint {
		color: var(--color-text-secondary);
		font-size: 0.9375rem;
		font-style: italic;
		margin-top: 1rem;
		background: var(--color-background-pattern);
		padding: 1rem;
		border: var(--border-brutalist-thin);
		border-radius: 6px;
	}

	.api-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 2rem;
	}

	.api-section h3 {
		background: var(--color-primary);
	}

	.api-section ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.api-section li {
		padding: 0.5rem 0;
		border-bottom: 1px solid var(--color-gray-200);
		font-size: 0.875rem;
	}

	.api-section li:last-child {
		border-bottom: none;
	}

	.api-section code {
		background: var(--color-background-tertiary);
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-family: monospace;
		font-weight: 600;
		color: var(--color-text-primary);
		border: 1px solid var(--color-gray-300);
	}

	.modal-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
		padding-top: 1rem;
		border-top: var(--border-brutalist-thin);
	}

	@media (max-width: 768px) {
		.demo-page {
			padding: 1rem;
		}

		.demo-header h1 {
			font-size: 2.5rem;
			padding: 0.75rem 1.5rem;
		}

		.component-grid {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		.api-grid {
			grid-template-columns: 1fr;
		}

		.button-grid {
			justify-content: center;
		}

		.modal-actions {
			flex-direction: column;
		}
	}

	@media (max-width: 600px) {
		.demo-header h1 {
			font-size: 2rem;
			padding: 0.5rem 1rem;
		}

		.demo-subtitle {
			font-size: 1.125rem;
		}

		h2 {
			font-size: 1.75rem;
		}
	}
</style>
