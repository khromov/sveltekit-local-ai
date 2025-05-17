<script lang="ts">
	export let mood: 'happy' | 'thinking' | 'confused' | 'neutral' = 'happy';
	export let confidenceLevel: number = 75;

	// Adjust confidence description based on level
	$: confidenceDescription = getConfidenceDescription(confidenceLevel);

	function getConfidenceDescription(level: number): string {
		if (level < 50) return "Eh, I'll try my best...";
		if (level < 70) return 'Probably close enough!';
		if (level < 85) return "I'm pretty sure this is right!";
		return 'Totally nailed it! (I think)';
	}
</script>

<div class="character-container">
	<div class="character-speech">
		<p class="speech-text">
			{#if mood === 'thinking'}
				Hmm, let me think about this one...
			{:else if mood === 'confused'}
				Oops! That was tricky, but I tried!
			{:else if mood === 'neutral'}
				Type something and I'll translate it... maybe?
			{:else}
				{confidenceDescription}
			{/if}
		</p>
	</div>

	<div class="character-image {mood}">
		<div class="face">
			<div class="eyes">
				<div class="eye left"></div>
				<div class="eye right"></div>
			</div>
			<div class="mouth"></div>
			{#if mood === 'confused'}
				<div class="sweat-drop"></div>
			{/if}
		</div>
	</div>

	{#if mood === 'happy' || mood === 'confused'}
		<div class="confidence-meter">
			<div class="meter-label">Confidence-ish meter:</div>
			<div class="meter-container">
				<div class="meter-fill" style="width: {confidenceLevel}%"></div>
			</div>
			<div class="meter-value">{confidenceLevel}%</div>
		</div>
	{/if}
</div>

<style>
	.character-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 1rem;
	}

	.character-speech {
		background-color: white;
		border: 2px solid #ef6f6c;
		border-radius: 20px;
		padding: 0.8rem 1.2rem;
		margin-bottom: 0.8rem;
		position: relative;
		filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.1));
	}

	.character-speech::after {
		content: '';
		position: absolute;
		bottom: -12px;
		left: 50%;
		transform: translateX(-50%);
		width: 0;
		height: 0;
		border-left: 12px solid transparent;
		border-right: 12px solid transparent;
		border-top: 12px solid #ef6f6c;
	}

	.speech-text {
		margin: 0;
		font-size: 1rem;
		color: #444;
		text-align: center;
		font-weight: 500;
	}

	/* Character face */
	.character-image {
		width: 100px;
		height: 100px;
		background-color: #ffde9e;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		border: 3px solid #ef6f6c;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
		margin-bottom: 1rem;
		position: relative;
		transition: all 0.3s ease;
	}

	.face {
		position: relative;
		width: 70%;
		height: 70%;
	}

	.eyes {
		display: flex;
		justify-content: space-between;
		width: 100%;
		position: absolute;
		top: 30%;
	}

	.eye {
		width: 12px;
		height: 16px;
		background-color: #333;
		border-radius: 50%;
		position: relative;
	}

	.happy .eye {
		height: 12px;
		background-color: #333;
		border-radius: 10px 10px 0 0;
		transform: translateY(2px);
	}

	.confused .eye.left {
		height: 14px;
		border-radius: 50%;
	}

	.confused .eye.right {
		height: 14px;
		border-radius: 50%;
		transform: translateY(-4px);
	}

	.mouth {
		width: 32px;
		height: 16px;
		background-color: #333;
		border-radius: 0 0 16px 16px;
		position: absolute;
		bottom: 20%;
		left: 50%;
		transform: translateX(-50%);
	}

	.happy .mouth {
		width: 40px;
		height: 20px;
	}

	.thinking .mouth {
		width: 20px;
		height: 6px;
		border-radius: 3px;
		bottom: 30%;
	}

	.confused .mouth {
		width: 24px;
		height: 12px;
		border-radius: 12px 12px 0 0;
		bottom: 25%;
		transform: translateX(-50%) rotate(180deg);
	}

	.neutral .mouth {
		width: 24px;
		height: 6px;
		border-radius: 3px;
		bottom: 30%;
	}

	.sweat-drop {
		position: absolute;
		top: 20%;
		right: -10px;
		width: 10px;
		height: 16px;
		background-color: #a3e8ff;
		border-radius: 50%;
		transform: rotate(30deg);
	}

	/* Mood-specific styles */
	.thinking {
		animation: thinking 2s infinite alternate;
	}

	.confused {
		background-color: #ffcece;
	}

	/* Confidence meter */
	.confidence-meter {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 80%;
		max-width: 300px;
		margin-top: 0.5rem;
	}

	.meter-label {
		font-size: 0.9rem;
		color: #666;
		margin-bottom: 0.3rem;
		font-style: italic;
	}

	.meter-container {
		width: 100%;
		height: 10px;
		background-color: #f0f0f0;
		border-radius: 5px;
		overflow: hidden;
		border: 1px solid #ddd;
	}

	.meter-fill {
		height: 100%;
		background-color: #ef6f6c;
		background-image: linear-gradient(
			45deg,
			rgba(255, 255, 255, 0.2) 25%,
			transparent 25%,
			transparent 50%,
			rgba(255, 255, 255, 0.2) 50%,
			rgba(255, 255, 255, 0.2) 75%,
			transparent 75%,
			transparent
		);
		background-size: 16px 16px;
		transition: width 0.5s ease-out;
	}

	.meter-value {
		font-size: 0.85rem;
		color: #666;
		margin-top: 0.2rem;
	}

	@keyframes thinking {
		0% {
			transform: rotate(-5deg);
		}
		100% {
			transform: rotate(5deg);
		}
	}

	@media (max-width: 768px) {
		.character-image {
			width: 80px;
			height: 80px;
		}

		.confidence-meter {
			width: 90%;
		}
	}
</style>
