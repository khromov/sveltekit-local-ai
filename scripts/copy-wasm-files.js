#!/usr/bin/env node

/**
 * Script to copy ONNX Runtime WASM files from npm packages to static directory
 * This ensures the WASM files stay in sync with the npm package versions
 */

import { copyFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const staticDir = join(projectRoot, 'static');
const onnxRuntimeDir = join(staticDir, 'onnx-runtime');
const transformersDir = join(staticDir, 'transformers');

// Create directories if they don't exist
mkdirSync(onnxRuntimeDir, { recursive: true });
mkdirSync(transformersDir, { recursive: true });

// Copy ONNX Runtime Web files
const onnxRuntimeSource = join(projectRoot, 'node_modules/onnxruntime-web/dist');
const transformersSource = join(projectRoot, 'node_modules/@huggingface/transformers/dist');

const onnxRuntimeFiles = [
	'ort-wasm-simd-threaded.jsep.wasm',
	'ort-wasm-simd-threaded.jsep.mjs',
	'ort.bundle.min.mjs'
];

const transformersFiles = [
	'ort-wasm-simd-threaded.jsep.wasm',
	'ort-wasm-simd-threaded.jsep.mjs'
];

console.log('Copying ONNX Runtime WASM files from npm packages...');

// Copy from onnxruntime-web to onnx-runtime directory
onnxRuntimeFiles.forEach((file) => {
	try {
		copyFileSync(join(onnxRuntimeSource, file), join(onnxRuntimeDir, file));
		console.log(`✓ Copied ${file} to static/onnx-runtime/`);
	} catch (error) {
		console.error(`✗ Failed to copy ${file} from onnxruntime-web:`, error.message);
	}
});

// Copy from @huggingface/transformers to transformers directory
transformersFiles.forEach((file) => {
	try {
		copyFileSync(join(transformersSource, file), join(transformersDir, file));
		console.log(`✓ Copied ${file} to static/transformers/`);
	} catch (error) {
		console.error(`✗ Failed to copy ${file} from @huggingface/transformers:`, error.message);
	}
});

console.log('WASM files copy completed!');
