# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development

- `npm run dev` - Start development server on port 5173
- `npm run build` - Build for production (sets PUBLIC_DISABLE_OPFS=false)
- `npm run preview` - Preview production build

### Code Quality

- `npm run lint` - Check code formatting and linting
- `npm run lint:fix` - Fix linting and formatting issues
- `npm run format` - Format code with Prettier
- `npm run checks` - Run all checks (format, lint, type check)
- **IMPORTANT**: Always run `npm run checks` after any code changes to catch type errors and linting issues

### Testing

- `npm run test` - Run all tests
- `npm run test:unit` - Run unit tests with Vitest

### Utilities

- `npm run ai-digest` - Generate codebase digest for AI tools

## Architecture Overview

This is a **SvelteKit application using Svelte 5** that provides browser-based AI tools (chat, transcription, TTS, background removal). The app runs entirely client-side using WebAssembly for AI inference.

### Key Technologies

- **Svelte 5** with modern runes (`$state`, `$derived`, `$props`) and snippets
- **SvelteKit** with Node adapter for production
- **Wuchale** for internationalization (English and Swedish)
- **WebAssembly** for AI model execution (llama.cpp, Whisper, etc.)
- **OPFS** for client-side model caching
- **Neo-Brutalist design system** with comprehensive CSS variables

### Project Structure

```
src/
├── lib/
│   ├── components/common/     # Reusable UI component library
│   ├── design-system.css      # CSS variables and design tokens
│   ├── i18n-utils.ts         # Internationalization utilities
│   ├── stores.ts             # Svelte stores
│   └── utils.ts              # General utilities
├── locales/                  # Translation files (.po format)
├── routes/
│   ├── [[lang]]/            # Localized routes (optional lang prefix)
│   └── +layout.svelte       # Main layout with Neo-Brutalist styling
└── service-worker.ts        # PWA and caching logic
```

### Svelte 5 Patterns

- **Props**: Use `let { prop }: Props = $props()` instead of `export let prop`
- **Reactive state**: Use `$state()` for component state
- **Derived state**: Use `$derived()` for computed values
- **Two-way binding**: Use `$bindable()` for parent-child data flow
- **Snippets**: Use `{@render children?.()}` for slot-like functionality

### Internationalization

- **Wuchale** handles i18n with `.po` files in `src/locales/`
- **English** uses clean URLs (`/settings`)
- **Other languages** use prefixed URLs (`/sv/settings`)
- Use `getCurrentLanguage()` and `createLocalizedLink()` from `i18n-utils.ts`

## Component Library (`$lib/components/common/`)

### Action & Navigation

- **ActionButton.svelte** - Styled action button with icon support
- **IconButton.svelte** - Circular icon-only button
- **PrimaryButton.svelte** - Main CTA button with variants (primary, success, warning) and sizes
- **OptionButton.svelte** - Toggle-style option selection button
- **Navigation.svelte** - Main app navigation with language-aware links

### Layout & Structure

- **Card.svelte** - Basic card container with optional title and animation
- **CardInterface.svelte** - Full-featured card with toolbar and content areas
- **ContentArea.svelte** - Standardized content wrapper with padding
- **InputArea.svelte** - Form input container with consistent styling
- **SectionCard.svelte** - Sectioned content card
- **Toolbar.svelte** - Header toolbar for card interfaces

### Content Display

- **Badge.svelte** - Small status or category indicator
- **EmptyState.svelte** - Placeholder for empty content areas
- **ErrorDisplay.svelte** - Error message component
- **InfoBox.svelte** - Informational callout box
- **IntroCard.svelte** - Introductory content card
- **StatCard.svelte** - Metric/statistic display card

### Form Controls

- **Dropdown.svelte** - Select dropdown with custom styling
- **FileUpload.svelte** - Drag-and-drop file upload component
- **Slider.svelte** - Range slider input
- **TextInput.svelte** - Styled text input field
- **TextInputCard.svelte** - Text input within card container
- **Toggle.svelte** - Switch or checkbox toggle (with variants)

### Interactive Elements

- **AdvancedSection.svelte** - Collapsible advanced options section
- **ExpandableSection.svelte** - Generic expandable content section
- **LanguageSelector.svelte** - Language switching component
- **ModeSelector.svelte** - Mode/view selection interface
- **Tabs.svelte** - Tab navigation component

### Loading & Progress

- **LoadingProgress.svelte** - Progress bar with percentage display
- **LoadModelButton.svelte** - AI model loading button with states
- **ProgressBar.svelte** - Basic progress indicator
- **SquareSpinner.svelte** - Loading spinner animation

### AI-Specific Components

- **ModelCard.svelte** - AI model information display
- **ModelSwitcher.svelte** - Model selection interface
- **TokenizerCard.svelte** - Text tokenization display

### Utilities

- **OrDivider.svelte** - Visual separator with "or" text
- **StepHeader.svelte** - Step-by-step process header
- **Tracking.svelte** - Analytics/tracking component

### Import Pattern

All components are re-exported from `src/lib/components/common/index.ts`:

```ts
import { PrimaryButton, Card, Toggle } from '$lib/components/common';
```

## Design System

### CSS Variables

The design system uses comprehensive CSS custom properties defined in `design-system.css`:

- **Colors**: Primary (`--color-primary`), state colors, gradients
- **Typography**: Space Grotesk (primary), Bebas Neue (display)
- **Shadows**: Brutalist-style shadows (`--shadow-brutalist-*`)
- **Borders**: Thick borders (`--border-brutalist-*`)
- **Spacing**: Consistent spacing scale

### Styling Conventions

- **Neo-Brutalist aesthetic**: Bold borders, drop shadows, bright colors
- **Responsive design**: Mobile-first with breakpoints at 600px and 400px
- **Animation**: Subtle animations with `transform` and `box-shadow` changes
- **Accessibility**: High contrast, keyboard navigation support

## Environment Configuration

### Environment Variables

- `PUBLIC_DISABLE_OPFS` - Set to `true` to disable OPFS caching for testing

### Development Setup

1. Use Node.js version specified in `.nvmrc`
2. Copy `.env.example` to `.env` for local configuration
3. Vite dev server includes CORS headers for WebAssembly execution

## Technical Notes

### WebAssembly Integration

- Special CORS headers required for AI model execution
- Models cached using Origin Private File System (OPFS)
- Supports fallback when OPFS is unavailable

### Service Worker

- Handles PWA functionality and offline caching
- Model files cached for offline use

### Build Configuration

- Uses `adapter-node` for server-side deployment
- Single bundle strategy for optimal loading
- WebGPU types included for AI acceleration

### Testing

- Vitest configured for unit testing
- Separate server and client test environments
- Assertion requirements enforced
