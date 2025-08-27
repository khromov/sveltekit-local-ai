<script lang="ts">
	import { toast } from 'svelte-sonner';

	// Import all reusable components from $lib/components/common/
	import ActionButton from '$lib/components/common/ActionButton.svelte';
	import AdvancedSection from '$lib/components/common/AdvancedSection.svelte';
	import Badge from '$lib/components/common/Badge.svelte';
	import Card from '$lib/components/common/Card.svelte';
	import CardInterface from '$lib/components/common/CardInterface.svelte';
	import ContentArea from '$lib/components/common/ContentArea.svelte';
	import Dropdown from '$lib/components/common/Dropdown.svelte';
	import EmptyState from '$lib/components/common/EmptyState.svelte';
	import ErrorDisplay from '$lib/components/common/ErrorDisplay.svelte';
	import FileUpload from '$lib/components/common/FileUpload.svelte';
	import IconButton from '$lib/components/common/IconButton.svelte';
	import InputArea from '$lib/components/common/InputArea.svelte';
	import LanguageSelector from '$lib/components/common/LanguageSelector.svelte';
	import LoadingProgress from '$lib/components/common/LoadingProgress.svelte';
	import PrimaryButton from '$lib/components/common/PrimaryButton.svelte';
	import ProgressBar from '$lib/components/common/ProgressBar.svelte';
	import SectionCard from '$lib/components/common/SectionCard.svelte';
	import Slider from '$lib/components/common/Slider.svelte';
	import SquareSpinner from '$lib/components/common/SquareSpinner.svelte';
	import StatCard from '$lib/components/common/StatCard.svelte';
	import StepHeader from '$lib/components/common/StepHeader.svelte';
	import Tabs from '$lib/components/common/Tabs.svelte';
	import TextInput from '$lib/components/common/TextInput.svelte';
	import Toggle from '$lib/components/common/Toggle.svelte';
	import Toolbar from '$lib/components/common/Toolbar.svelte';

	// Import icons for demo
	import SparklesIcon from 'virtual:icons/lucide/sparkles';
	import SaveIcon from 'virtual:icons/lucide/save';
	import TrashIcon from 'virtual:icons/lucide/trash-2';
	import HeartIcon from 'virtual:icons/lucide/heart';
	import StarIcon from 'virtual:icons/lucide/star';
	import BoltIcon from 'virtual:icons/lucide/zap';
	import HomeIcon from 'virtual:icons/lucide/home';
	import SettingsIcon from 'virtual:icons/lucide/settings';
	import UserIcon from 'virtual:icons/lucide/user';

	// Demo state
	let textInputValue = $state('');
	let sliderValue = $state(50);
	let toggleValue = $state(false);
	let checkboxValue = $state(false);
	let dropdownValue = $state<string | number>('');
	let activeTab = $state('tab1');
	let progressValue = $state(65);

	const dropdownOptions = [
		{ value: 'option1', label: 'Option One', icon: HomeIcon },
		{ value: 'option2', label: 'Option Two', icon: SettingsIcon },
		{ value: 'option3', label: 'Option Three', icon: UserIcon },
		{ value: 'option4', label: 'Option Four (Disabled)', disabled: true }
	];

	const tabs = [
		{ id: 'tab1', label: 'First Tab', icon: HomeIcon },
		{ id: 'tab2', label: 'Second Tab', icon: SettingsIcon },
		{ id: 'tab3', label: 'Third Tab', icon: UserIcon }
	];

	const languages = [
		{ code: 'en', name: 'English', nativeName: 'English' },
		{ code: 'es', name: 'Spanish', nativeName: 'Español' },
		{ code: 'ja', name: 'Japanese', nativeName: '日本語' }
	];

	function handleClick(name: string) {
		toast.success(`${name} clicked!`);
	}

	function handleFileSelect(files: File[]) {
		toast.success(`Selected ${files.length} file(s)`);
	}
</script>

<div class="demo-page">
	<div class="demo-header">
		<h1>🎨 Neo-Brutalist UI Component Library</h1>
		<p>A collection of reusable Svelte components with bold, playful brutalist design</p>
	</div>

	<!-- Buttons Section -->
	<Card title="Buttons" rotation={-0.3}>
		<div class="component-section">
			<h3>Primary Buttons</h3>
			<div class="demo-row">
				<PrimaryButton onClick={() => handleClick('Primary')} size="small">Small</PrimaryButton>
				<PrimaryButton onClick={() => handleClick('Primary')} size="medium">Medium</PrimaryButton>
				<PrimaryButton onClick={() => handleClick('Primary')} size="large">Large</PrimaryButton>
				<PrimaryButton disabled={true}>Disabled</PrimaryButton>
				<PrimaryButton loading={true}>Loading</PrimaryButton>
			</div>

			<h3>Action Buttons</h3>
			<div class="demo-row">
				<ActionButton onClick={() => handleClick('Action')} variant="default" Icon={SparklesIcon}>
					Default
				</ActionButton>
				<ActionButton onClick={() => handleClick('Success')} variant="success" Icon={SaveIcon}>
					Success
				</ActionButton>
				<ActionButton onClick={() => handleClick('Warning')} variant="warning" Icon={StarIcon}>
					Warning
				</ActionButton>
				<ActionButton onClick={() => handleClick('Danger')} variant="danger" Icon={TrashIcon}>
					Danger
				</ActionButton>
			</div>

			<h3>Icon Buttons</h3>
			<div class="demo-row">
				<IconButton
					icon={HeartIcon}
					onClick={() => handleClick('Icon')}
					size="small"
					variant="default"
				/>
				<IconButton
					icon={StarIcon}
					onClick={() => handleClick('Icon')}
					size="medium"
					variant="primary"
				/>
				<IconButton
					icon={BoltIcon}
					onClick={() => handleClick('Icon')}
					size="large"
					variant="success"
				/>
				<IconButton icon={SaveIcon} onClick={() => handleClick('Icon')} variant="warning" />
				<IconButton icon={TrashIcon} onClick={() => handleClick('Icon')} variant="danger" />
			</div>
		</div>
	</Card>

	<!-- Form Controls Section -->
	<Card title="Form Controls" rotation={0.2}>
		<div class="component-section">
			<h3>Text Input</h3>
			<div class="demo-column">
				<TextInput
					label="Username"
					bind:value={textInputValue}
					placeholder="Enter your username"
					icon={UserIcon}
					required={true}
				/>
				<TextInput label="Email" type="email" placeholder="email@example.com" />
				<TextInput label="Disabled Input" placeholder="This is disabled" disabled={true} />
			</div>

			<h3>Toggles & Checkboxes</h3>
			<div class="demo-row">
				<Toggle bind:checked={toggleValue} label="Switch Toggle" variant="switch" />
				<Toggle bind:checked={checkboxValue} label="Checkbox" variant="checkbox" />
				<Toggle label="Disabled Switch" variant="switch" disabled={true} />
			</div>

			<h3>Slider</h3>
			<div class="demo-column">
				<Slider label="Volume" bind:value={sliderValue} min={0} max={100} unit="%" />
				<Slider value={30} min={0} max={100} showValue={false} />
			</div>

			<h3>Dropdown</h3>
			<div class="demo-column">
				<Dropdown
					label="Select an Option"
					options={dropdownOptions}
					bind:value={dropdownValue}
					placeholder="Choose something..."
				/>
			</div>

			<h3>File Upload</h3>
			<FileUpload
				label="Upload Files"
				accept="image/*"
				multiple={true}
				onFileSelect={handleFileSelect}
				maxSize={5}
			/>

			<h3>Language Selector</h3>
			<LanguageSelector
				{languages}
				selectedLanguage="en"
				onLanguageChange={(code) => toast.info(`Language changed to ${code}`)}
			/>
		</div>
	</Card>

	<!-- Data Display Section -->
	<Card title="Data Display" rotation={-0.2}>
		<div class="component-section">
			<h3>Badges</h3>
			<div class="demo-row">
				<Badge size="small">Small</Badge>
				<Badge size="medium">Medium</Badge>
				<Badge size="large">Large</Badge>
				<Badge variant="success">Success</Badge>
				<Badge variant="warning">Warning</Badge>
				<Badge variant="danger">Danger</Badge>
				<Badge variant="info">Info</Badge>
			</div>

			<h3>Stat Cards</h3>
			<div class="stats-grid">
				<StatCard label="Total Users" value="1,234" icon={UserIcon} color="primary" />
				<StatCard label="Revenue" value="$45.6K" icon={BoltIcon} color="success" />
				<StatCard label="Conversion" value="87%" icon={StarIcon} color="warning" />
			</div>

			<h3>Progress Bar</h3>
			<div class="demo-column">
				<ProgressBar progress={progressValue} animated={true} />
				<div class="demo-row" style="margin-top: 1rem;">
					<button onclick={() => (progressValue = Math.max(0, progressValue - 10))}>-10%</button>
					<button onclick={() => (progressValue = Math.min(100, progressValue + 10))}>+10%</button>
				</div>
			</div>

			<h3>Empty State</h3>
			<EmptyState
				icon={SparklesIcon}
				message="No data to display yet"
				action={{ label: 'Add New Item', onClick: () => toast.info('Add item clicked') }}
			/>
		</div>
	</Card>

	<!-- Layout Components Section -->
	<Card title="Layout Components" rotation={0.3}>
		<div class="component-section">
			<h3>Tabs</h3>
			<Tabs {tabs} bind:activeTab onTabChange={(id) => toast.info(`Tab changed to ${id}`)}>
				{#if activeTab === 'tab1'}
					<p>Content for the first tab. This is where you would place your tab content.</p>
				{:else if activeTab === 'tab2'}
					<p>Content for the second tab. Each tab can have completely different content.</p>
				{:else if activeTab === 'tab3'}
					<p>Content for the third tab. The tab component handles all the switching logic.</p>
				{/if}
			</Tabs>

			<h3>Section Card</h3>
			<SectionCard rotation={-0.5} animationDelay={0}>
				This is a section card with custom rotation and animation delay.
			</SectionCard>

			<h3>Step Header</h3>
			<StepHeader stepNumber={1} title="Choose Your Options" backgroundColor="#ff69b4" />
			<StepHeader stepNumber={2} title="Configure Settings" />
			<StepHeader stepNumber={3} title="Review & Submit" backgroundColor="#98fb98" />

			<h3>Advanced Section</h3>
			<AdvancedSection Icon={SettingsIcon}>
				<p>This content is inside an expandable advanced section.</p>
				<p>It can contain any content you want to hide by default.</p>
			</AdvancedSection>
		</div>
	</Card>

	<!-- Feedback Components Section -->
	<Card title="Feedback Components" rotation={-0.1}>
		<div class="component-section">
			<h3>Loading Progress</h3>
			<LoadingProgress
				title="Loading Model"
				progress={75}
				message="Please wait while we load the AI model..."
				showPercentage={true}
			/>

			<h3>Error Display</h3>
			<ErrorDisplay
				message="Something went wrong. Please try again."
				buttonText="Retry"
				onRetry={() => toast.error('Retrying...')}
			/>

			<h3>Square Spinner</h3>
			<div class="demo-row">
				<SquareSpinner size="1rem" />
				<SquareSpinner size="1.5rem" />
				<SquareSpinner size="2rem" />
				<SquareSpinner size="3rem" />
			</div>
		</div>
	</Card>

	<!-- Full Interface Example -->
	<Card title="Full Interface Example" rotation={0.15}>
		<CardInterface>
			<Toolbar modelInfo="Example Interface" ModelIcon={SparklesIcon}>
				<ActionButton onClick={() => handleClick('Toolbar Action')} Icon={SaveIcon}>
					Save
				</ActionButton>
			</Toolbar>

			<ContentArea>
				<p>
					This demonstrates how the CardInterface, Toolbar, ContentArea, and InputArea components
					work together to create a complete interface.
				</p>
				<EmptyState message="Your content goes here" />
			</ContentArea>

			<InputArea>
				<PrimaryButton onClick={() => handleClick('Submit')} fullWidth={true}>
					Submit Form
				</PrimaryButton>
			</InputArea>
		</CardInterface>
	</Card>
</div>

<style>
	.demo-page {
		padding: 2rem;
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.demo-header {
		text-align: center;
		padding: 3rem 2rem;
		background: var(--color-background-main);
		border: var(--border-brutalist-extra-thick);
		box-shadow: var(--shadow-brutalist-xlarge);
		transform: rotate(-0.5deg);
		margin-bottom: 2rem;
	}

	.demo-header h1 {
		margin: 0 0 1rem 0;
		font-family: var(--font-family-display);
		font-size: 3rem;
		color: var(--color-text-primary);
		text-transform: uppercase;
		letter-spacing: 3px;
		background: var(--color-primary);
		padding: 1rem 2rem;
		border: var(--border-brutalist-thick);
		box-shadow: var(--shadow-brutalist-large);
		display: inline-block;
		transform: rotate(1deg);
	}

	.demo-header p {
		margin: 0;
		font-size: 1.25rem;
		color: var(--color-text-secondary);
		font-weight: 500;
	}

	.component-section {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.component-section h3 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-text-primary);
		text-transform: uppercase;
		letter-spacing: 1px;
		padding-bottom: 0.5rem;
		border-bottom: var(--border-brutalist-thin);
	}

	.demo-row {
		display: flex;
		gap: 1rem;
		align-items: center;
		flex-wrap: wrap;
	}

	.demo-column {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}

	button:not([class]) {
		padding: 0.5rem 1rem;
		background: var(--color-background-tertiary);
		border: var(--border-brutalist-thin);
		border-radius: 4px;
		cursor: pointer;
		font-weight: 600;
		transition: all 0.2s;
	}

	button:not([class]):hover {
		background: var(--color-primary);
		transform: translate(-1px, -1px);
		box-shadow: var(--shadow-brutalist-small);
	}

	@media (max-width: 768px) {
		.demo-page {
			padding: 1rem;
		}

		.demo-header h1 {
			font-size: 2rem;
		}

		.stats-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 600px) {
		.demo-header {
			padding: 2rem 1rem;
		}

		.demo-header h1 {
			font-size: 1.5rem;
			padding: 0.75rem 1rem;
		}

		.demo-header p {
			font-size: 1rem;
		}
	}
</style>
