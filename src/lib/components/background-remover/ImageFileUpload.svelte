<script lang="ts">
	import { FileUpload } from '$lib/components/common';

	interface Props {
		mode: 'single' | 'batch';
		selectedFile?: File | null;
		selectedFiles?: File[];
		onFileSelect?: (file: File) => void;
		onFilesSelect?: (files: File[]) => void;
		onExampleUse?: () => void;
		disabled?: boolean;
	}

	let {
		mode = 'single',
		selectedFile = $bindable(null),
		selectedFiles = $bindable([]),
		onFileSelect,
		onFilesSelect,
		onExampleUse,
		disabled = false
	}: Props = $props();
</script>

<FileUpload
	{mode}
	fileType="image"
	bind:selectedFile
	bind:selectedFiles
	{onFileSelect}
	{onFilesSelect}
	{onExampleUse}
	{disabled}
	showExample={true}
	showPreview={true}
	showFileInfo={true}
	variant="default"
/>
