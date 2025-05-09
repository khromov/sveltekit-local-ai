# SvelteKit Local AI Chat

A browser-based chat application with AI models that run entirely on your device without sending data to external servers. This project uses Svelte 5, SvelteKit, WebAssembly, and the Wllama library.

## Live Demo

You can try the application at:
[https://svelte-local-ai.khromov.se/](https://svelte-local-ai.khromov.se/)

## Running Locally

1. Clone the repository

2. Install dependencies

   ```bash
   nvm use
   npm install
   ```

3. Start the development server

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

```bash
npm run build
```

## Using Docker

```bash
# Build the Docker image
docker build -t sveltekit-local-ai .

# Run the container
docker run -p 3000:3000 sveltekit-local-ai
```

## How It Works

The application downloads compact language models directly to your browser and runs inference using WebAssembly. This approach ensures your conversations stay private and can work offline after the initial model download.
