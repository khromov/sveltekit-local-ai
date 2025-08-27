<script lang="ts">
	import { IntroCard } from '$lib/components/common';
	import SparklesIcon from 'virtual:icons/lucide/sparkles';
</script>

<svelte:head>
	<title>Local AI tools</title>
	<meta name="description" content="Run AI models locally in your browser" />
</svelte:head>

<div class="home-page">
	<IntroCard
		icon={SparklesIcon}
		title="Hello World"
		description="Welcome to Local AI tools. Explore our components in the Demo section."
		animateIcon={true}
		rotation={0.5}
	/>
</div>

<style>
	.home-page {
		padding: 2rem;
		max-width: 600px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 60vh;
	}

	@media (max-width: 768px) {
		.home-page {
			padding: 1rem;
		}
	}
</style>
