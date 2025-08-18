<script lang="ts">
	interface Props {
		size?: string;
		class?: string;
	}

	let { size = '1.5rem', class: className = '' }: Props = $props();
</script>

<div
	class="spinner {className}"
	style="width: {size}; height: {size}"
	role="status"
	aria-label="Loading"
>
	<svg
		width="100%"
		height="100%"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<g stroke="currentColor" stroke-width="2" stroke-linecap="round">
			<line x1="12" y1="2" x2="12" y2="6" opacity="1" />
			<line x1="12" y1="18" x2="12" y2="22" opacity="0.3" />
			<line x1="4.93" y1="4.93" x2="7.76" y2="7.76" opacity="0.9" />
			<line x1="16.24" y1="16.24" x2="19.07" y2="19.07" opacity="0.2" />
			<line x1="2" y1="12" x2="6" y2="12" opacity="0.8" />
			<line x1="18" y1="12" x2="22" y2="12" opacity="0.1" />
			<line x1="4.93" y1="19.07" x2="7.76" y2="16.24" opacity="0.7" />
			<line x1="16.24" y1="7.76" x2="19.07" y2="4.93" opacity="0.4" />
		</g>
	</svg>
</div>

<style>
	.spinner {
		display: inline-block;
		animation: spin 1s linear infinite;
	}

	.spinner svg {
		display: block;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
