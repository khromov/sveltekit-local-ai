<div class="selection-page">
	<h1>Choose a Chat Model</h1>
	<div class="options">
		<a href="/chat/wllama" class="option-card">
			<h2>Wllama</h2>
			<p>Run chat models using GGUF format with Wllama.</p>
		</a>
		<a href="/chat/transformers" class="option-card">
			<h2>Transformers.js</h2>
			<p>Run chat models from Hugging Face with Transformers.js.</p>
		</a>
	</div>
</div>

<style>
	.selection-page {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		margin: 2rem 0;
		animation: fadeIn 0.4s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.options {
		display: flex;
		gap: 2rem;
	}

	.option-card {
		border: 2px solid #000;
		border-radius: 8px;
		padding: 2rem;
		text-align: center;
		transition: all 0.2s;
		text-decoration: none;
		color: inherit;
	}

	.option-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
	}
</style>
