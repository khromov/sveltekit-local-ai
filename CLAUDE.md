# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a browser-based AI chat and transcription application that runs entirely client-side without sending data to external servers. The application uses Svelte 5, SvelteKit, WebAssembly, the Wllama library for chat completions, and @transcribe/transcriber for audio transcription.

## Development Commands

### Core Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production (with OPFS enabled by default)
- `npm run preview` - Preview production build
- `npm run check` - Type check with svelte-check
- `npm run check:watch` - Type check in watch mode
- `npm run lint` - Run ESLint and Prettier checks
- `npm run format` - Format code with Prettier

### Docker Commands
- `docker build -t sveltekit-local-ai .` - Build Docker image
- `docker run -p 3000:3000 sveltekit-local-ai` - Run container

## Architecture & Key Concepts

### Application Structure
- **Routes**: Main pages in `src/routes/` with route groups for apps `(apps)/`
- **Components**: Reusable UI components in `src/lib/components/`
- **State Management**: Persisted stores using `svelte-persisted-store` in `src/lib/stores.ts`
- **AI Integration**: Wllama configuration and models in `src/lib/wllama-config.ts`

### WebAssembly Integration
- Uses Wllama library for local LLM inference
- Models are downloaded and cached in browser (OPFS when supported)
- Cross-Origin headers required for WebAssembly: `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp`

### Svelte 5 Features
- Always reference latest Svelte 5 syntax from https://svelte.dev/llms-small.txt before making changes
- Uses `$state()` for reactive variables instead of legacy syntax
- Component props use the `$props()` rune
- Snippets used for component children patterns

### Model Management
- Available models configured in `AVAILABLE_MODELS` array in `src/lib/wllama-config.ts`
- Models are downloaded with progress tracking and cached locally
- Support for both single-threaded and multi-threaded WebAssembly builds

### State Persistence
Key persisted stores:
- `messages`: Chat message history
- `inferenceParams`: AI model parameters (temperature, context length, etc.)
- `whisperModel`: Selected Whisper model for transcription

### Component Organization
- **Chat components**: `src/lib/components/chat/` (ModelSelector, ChatMessages, MessageInput, Message)
- **Whisper components**: `src/lib/components/whisper/` (file upload, model selection, transcription)
- **Common components**: LoadingProgress, ErrorDisplay, ProgressBar

## Key Technical Details

### AI Model Configuration
- Default chat template uses ChatML format (`<|im_start|>` tokens)
- Inference parameters: 4096 context, temperature 0.2, auto-threading
- Models served from external CDN (https://files.khromov.se/models/)

### Browser Compatibility
- Requires modern browsers with WebAssembly and SharedArrayBuffer support
- OPFS (Origin Private File System) used for model caching when available
- Fallback storage mechanisms for browsers without OPFS

### Development Notes
- TypeScript used throughout the codebase
- ESLint configuration includes Svelte-specific rules
- Prettier for code formatting
- Uses SvelteKit's adapter-node for production builds
- Express server with health check endpoint at `/_health`

## Environment Variables
- `PUBLIC_DISABLE_OPFS=true` - Disable OPFS caching for testing fallback behavior

## Code Style Guidelines
- Use TypeScript for all new code
- Follow existing naming conventions (camelCase for variables, PascalCase for components)
- Use Svelte 5 `$state()` syntax for reactive variables
- Maintain responsive design patterns with mobile-first approach
- Include loading states and error handling for async operations
- Follow existing component structure and prop patterns