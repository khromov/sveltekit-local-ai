# SvelteKit Local AI Chat - Copilot Instructions

## Project Overview

This is a browser-based chat application with AI models that run entirely on the client's device without sending data to external servers. The application uses Svelte 5, SvelteKit, WebAssembly, the Wllama library for chat, and @transcribe/transcriber for audio transcription.

## Svelte 5 features

Always download and reference https://svelte.dev/llms-small.txt to get the latest instructions for Svelte 5 syntax before making any changes to Svelte components. This ensures you're using the most up-to-date syntax and features.

## Technology Stack

- Svelte 5 with SvelteKit 2.x
- TypeScript
- WebAssembly for running AI models locally
- Docker for containerization
- Wllama library for chat completions
- @transcribe/transcriber for audio transcription

## Code Style & Conventions

- Use TypeScript for all new code
- Use Svelte's state syntax (`$state()`) for reactive variables
- Always use proper typing for variables, functions, and components
- Follow the existing project structure pattern when adding new features
- Follow existing naming conventions (camelCase for variables, PascalCase for components)
- Use CSS variables for theming when possible
- Reference the latest Svelte 5 syntax from https://svelte.dev/llms-small.txt before making component changes

## Application Structure

- `/src/routes/` - SvelteKit routes and page components
- `/src/lib/` - Shared components, utilities, and stores
- `/src/lib/stores.ts` - Contains persisted stores for application state
- `/src/lib/wllama-config.ts` - Configuration for the Wllama library

## UI/UX Guidelines

- Maintain a clean, minimalist aesthetic consistent with the existing design
- All UI components should be responsive and mobile-friendly
- Follow the existing color scheme (blue accent colors, white/light gray backgrounds)
- Use existing message bubble styles for chat interactions
- Include appropriate loading states and error handling for all network operations

## Important Implementation Details

- The app loads models directly into the browser and runs inference locally
- All chat messages should be stored in the persisted store to maintain state
- Models are loaded asynchronously with progress indicators
- The app should work offline after the initial model download
- Maintain appropriate WASM error handling throughout the application

## Testing & Performance

- New features should maintain current performance levels
- Browser compatibility should be preserved for modern browsers

## Docker Environment

- The application uses a multi-stage Docker build process
- Node 22 Alpine is used as the base image
- Port 3000 is exposed for the application
