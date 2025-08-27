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
	import ModelCard from '$lib/components/common/ModelCard.svelte';
	import LoadModelButton from '$lib/components/common/LoadModelButton.svelte';
	import InfoBox from '$lib/components/common/InfoBox.svelte';
	import OptionButton from '$lib/components/common/OptionButton.svelte';
	import OrDivider from '$lib/components/common/OrDivider.svelte';

	// Import newly extracted components
	import ModelSwitcher from '$lib/components/common/ModelSwitcher.svelte';
	import TextInputCard from '$lib/components/common/TextInputCard.svelte';
	import IntroCard from '$lib/components/common/IntroCard.svelte';
	import ModeSelector from '$lib/components/common/ModeSelector.svelte';
	import TokenizerCard from '$lib/components/common/TokenizerCard.svelte';
	import ExpandableSection from '$lib/components/common/ExpandableSection.svelte';

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
	import BrainIcon from 'virtual:icons/lucide/brain';
	import SmartphoneIcon from 'virtual:icons/lucide/smartphone';
	import FolderIcon from 'virtual:icons/lucide/folder';
	import MicIcon from 'virtual:icons/lucide/mic';
	import LockIcon from 'virtual:icons/lucide/lock';
	import HourglassIcon from 'virtual:icons/lucide/hourglass';
	import CatIcon from 'virtual:icons/lucide/cat';
	import FlowerIcon from 'virtual:icons/lucide/flower';
	import TheaterIcon from 'virtual:icons/lucide/theater';
	import ImageIcon from 'virtual:icons/lucide/image';
	import MessageSquareIcon from 'virtual:icons/lucide/message-square';
	import DicesIcon from 'virtual:icons/lucide/dices';
	import CopyIcon from 'virtual:icons/lucide/copy';

	// Demo state
	let textInputValue = $state('');
	let sliderValue = $state(50);
	let toggleValue = $state(false);
	let checkboxValue = $state(false);
	let dropdownValue = $state<string | number>('');
	let activeTab = $state('tab1');
	let progressValue = $state(65);
	let selectedModel = $state('model1');
	let selectedOption = $state('option1');

	// State for new components
	let selectedTTSModel = $state('piper');
	let selectedBGModel = $state('rmbg-small');
	let selectedMode = $state('single');
	let demoText = $state('Hello! This is a demo of the reusable components.');
	let copied = $state(false);
	let expandedSection1 = $state(false);
	let expandedSection2 = $state(false);

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

	const demoModels = [
		{ id: 'model1', name: 'Gemma 2B Instruct', size: '1.6 GB', prosText: 'Smarter AI responses' },
		{
			id: 'model2',
			name: 'SmolLM2-1.7B',
			size: '1.2 GB',
			prosText: 'Runs on most computers and phones'
		}
	];

	function handleClick(name: string) {
		toast.success(`${name} clicked!`);
	}

	function handleFileSelect(files: File[]) {
		toast.success(`Selected ${files.length} file(s)`);
	}

	// Demo data for new components
	const ttsModels = [
		{
			id: 'kitten',
			icon: CatIcon,
			title: 'Kitten TTS Nano',
			description: '24MB • Best for edge devices'
		},
		{
			id: 'piper',
			icon: TheaterIcon,
			title: 'Piper Voices',
			description: '75MB • Better Quality • Fast',
			recommended: true
		},
		{
			id: 'kokoro',
			icon: FlowerIcon,
			title: 'Kokoro',
			description: '80MB • Highest Quality • Slow'
		}
	];

	const backgroundRemovalModels = [
		{
			id: 'rmbg-small',
			icon: ImageIcon,
			title: 'RMBG Lite',
			description: '44MB • Fast processing'
		},
		{
			id: 'rmbg-large',
			icon: ImageIcon,
			title: 'RMBG Pro',
			description: '235MB • Higher quality',
			badge: 'Best Quality'
		}
	];

	const processingModes = [
		{
			id: 'single',
			icon: ImageIcon,
			label: 'Single Image'
		},
		{
			id: 'batch',
			icon: FolderIcon,
			label: 'Multiple Images'
		}
	];

	let actionButtons = $derived([
		{
			icon: DicesIcon,
			title: 'Get random quote',
			onClick: () => {
				demoText = 'The quick brown fox jumps over the lazy dog.';
			},
			variant: 'dice' as const
		},
		{
			icon: CopyIcon,
			title: copied ? 'Copied!' : 'Copy text',
			onClick: async () => {
				await navigator.clipboard.writeText(demoText);
				copied = true;
				setTimeout(() => (copied = false), 2000);
			},
			disabled: !demoText,
			variant: 'copy' as const
		},
		{
			icon: TrashIcon,
			title: 'Clear text',
			onClick: () => {
				demoText = '';
			},
			variant: 'clear' as const
		}
	]);

	function handleTTSModelChange(modelId: string) {
		selectedTTSModel = modelId;
		toast.success(`Selected ${modelId} model`);
	}

	function handleModeChange(modeId: string) {
		selectedMode = modeId;
		toast.success(`Selected ${modeId} mode`);
	}

	function handleBGModelChange(modelId: string) {
		selectedBGModel = modelId;
		toast.success(`Selected ${modelId} background removal model`);
	}
</script>

<div class="demo-page">
	<div class="demo-header">
		<h1>🎨 Neo-Brutalist UI Component Library</h1>
		<p>A collection of reusable Svelte components with bold, playful brutalist design</p>
	</div>

	<!-- Newly Extracted Components Section -->
	<Card title="🆕 Newly Extracted Components" rotation={0.5}>
		<div class="component-section">
			<h3>Intro Card</h3>
			<IntroCard
				icon={SparklesIcon}
				title="Welcome to the Demo"
				description="This intro card component was extracted from the TTS page and made reusable."
				animateIcon={true}
				rotation={-0.3}
			/>

			<h3>Model Switcher</h3>
			<p>TTS Models (3 columns with recommended badge):</p>
			<ModelSwitcher
				title="Text-to-Speech Model"
				stepNumber={1}
				models={ttsModels}
				selectedModel={selectedTTSModel}
				onModelChange={handleTTSModelChange}
				rotation={-0.2}
			/>

			<p>Background Removal Models (2 columns with custom badge):</p>
			<ModelSwitcher
				title="Background Removal Model"
				models={backgroundRemovalModels}
				selectedModel={selectedBGModel}
				onModelChange={handleBGModelChange}
				rotation={0.3}
			/>

			<h3>Text Input Card</h3>
			<TextInputCard
				title="Enter Your Text"
				bind:text={demoText}
				{actionButtons}
				showStats={true}
				rotation={0.2}
			/>

			<h3>Mode Selector</h3>
			<ModeSelector
				modes={processingModes}
				{selectedMode}
				onModeChange={handleModeChange}
				rotation={-0.3}
			/>

			<h3>Tokenizer Cards</h3>
			<div class="tokenizer-cards-demo">
				<TokenizerCard
					href="/demo"
					icon={BrainIcon}
					title="Anthropic Claude"
					description="Count tokens for Claude models including Claude 3 Opus, Sonnet, and Haiku"
					decorationColor="var(--color-accent-pink)"
					decorationPosition="right"
					hoverColor="var(--color-accent-pink)"
					rotation={0.5}
				/>

				<TokenizerCard
					href="/demo"
					icon={MessageSquareIcon}
					title="OpenAI ChatGPT"
					description="Count tokens for GPT-4, GPT-4o, GPT-3.5 Turbo, and other OpenAI models"
					decorationColor="var(--color-success)"
					decorationPosition="left"
					hoverColor="var(--color-success)"
					rotation={-0.5}
				/>
			</div>

			<h3>Expandable Sections</h3>
			<ExpandableSection title="Raw Tokens" count={42} bind:expanded={expandedSection1}>
				<div class="demo-tokens">
					<div class="token-grid">
						<div class="token-item">
							<span class="token-id">15339</span>
							<span class="token-text">Hello</span>
						</div>
						<div class="token-item">
							<span class="token-id">0</span>
							<span class="token-text">!</span>
						</div>
						<div class="token-item">
							<span class="token-id">1012</span>
							<span class="token-text"> This</span>
						</div>
						<div class="token-item">
							<span class="token-id">318</span>
							<span class="token-text"> is</span>
						</div>
						<div class="token-item">
							<span class="token-id">257</span>
							<span class="token-text"> a</span>
						</div>
						<div class="token-item">
							<span class="token-id">9206</span>
							<span class="token-text"> demo</span>
						</div>
					</div>
				</div>
			</ExpandableSection>

			<ExpandableSection title="Configuration Options" bind:expanded={expandedSection2}>
				<div class="demo-config">
					<p><strong>Temperature:</strong> 0.7</p>
					<p><strong>Max Tokens:</strong> 150</p>
					<p><strong>Top P:</strong> 0.9</p>
					<p><strong>Frequency Penalty:</strong> 0.1</p>
				</div>
			</ExpandableSection>
		</div>
	</Card>

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

	<!-- Model Components Section -->
	<Card title="Model Components" rotation={0.1}>
		<div class="component-section">
			<h3>Model Cards</h3>
			<div class="model-cards-demo">
				{#each demoModels as model (model.id)}
					<ModelCard
						name={model.name}
						size={model.size}
						ProsIcon={model.id === 'model1' ? BrainIcon : SmartphoneIcon}
						prosText={model.prosText}
						active={selectedModel === model.id}
						rotation={model.id === 'model1' ? 0.5 : -0.3}
						onClick={() => {
							selectedModel = model.id;
							toast.success(`Selected ${model.name}`);
						}}
					/>
				{/each}
			</div>

			<h3>Load Model Button</h3>
			<LoadModelButton
				onClick={() => handleClick('Load Model')}
				Icon={BoltIcon}
				LoadingIcon={HourglassIcon}
				loading={false}
			>
				Load Selected Model
			</LoadModelButton>

			<h3>Info Boxes</h3>
			<div class="info-boxes-demo">
				<InfoBox
					message="Models run locally in your browser. No data is sent to external servers."
					Icon={LockIcon}
					variant="blue"
					rotation={0.5}
				/>
				<InfoBox
					message="This is a success message with green styling."
					Icon={StarIcon}
					variant="success"
					rotation={-0.3}
				/>
				<InfoBox
					message="Warning: This action cannot be undone."
					variant="warning"
					rotation={0.2}
				/>
			</div>
		</div>
	</Card>

	<!-- Option Components Section -->
	<Card title="Option Components" rotation={-0.2}>
		<div class="component-section">
			<h3>Option Buttons</h3>
			<div class="option-buttons-demo">
				<OptionButton
					title="Local File"
					description="Select an audio file from your device (.mp3, .wav, .m4a)"
					Icon={FolderIcon}
					selected={selectedOption === 'upload'}
					name="demo-option"
					value="upload"
					onClick={() => {
						selectedOption = 'upload';
						toast.success('Selected Local File');
					}}
					rotation={-0.5}
				/>

				<OptionButton
					title="Record Audio"
					description="Record audio directly from your microphone"
					Icon={MicIcon}
					selected={selectedOption === 'record'}
					name="demo-option"
					value="record"
					onClick={() => {
						selectedOption = 'record';
						toast.success('Selected Record Audio');
					}}
					rotation={0.5}
				/>

				<OrDivider />

				<OptionButton
					title="Demo File"
					description="Demo audio file available"
					selected={selectedOption === 'demo'}
					name="demo-option"
					value="demo"
					size="compact"
					onClick={() => {
						selectedOption = 'demo';
						toast.success('Selected Demo File');
					}}
					rotation={0.2}
				/>
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

	.model-cards-demo {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
		max-width: 600px;
		margin: 0 auto;
	}

	.info-boxes-demo {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.option-buttons-demo {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 600px;
		margin: 0 auto;
	}

	/* Styles for newly extracted components */
	.tokenizer-cards-demo {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		gap: 2rem;
		margin-bottom: 2rem;
	}

	.demo-tokens {
		max-height: 300px;
		overflow-y: auto;
	}

	.token-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
		gap: 0.5rem;
	}

	.token-item {
		display: flex;
		flex-direction: column;
		padding: 0.5rem;
		background: var(--color-background-secondary);
		border: var(--border-brutalist-thin);
		border-radius: 4px;
		font-family: var(--font-family-mono);
		font-size: 0.75rem;
		transition: all 0.2s;
	}

	.token-item:hover {
		background: var(--color-background-tertiary);
		transform: translate(-1px, -1px);
		box-shadow: var(--shadow-brutalist-small);
	}

	.token-id {
		font-weight: 700;
		color: var(--color-text-secondary);
		font-size: 0.7rem;
		margin-bottom: 0.25rem;
	}

	.token-text {
		color: var(--color-text-primary);
		word-break: break-all;
		white-space: pre-wrap;
		line-height: 1.2;
	}

	.demo-config p {
		margin: 0.5rem 0;
		font-family: var(--font-family-mono);
		font-size: 0.9rem;
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

		.model-cards-demo {
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
