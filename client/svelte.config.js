import adapter from "@sveltejs/adapter-auto";
// import adapter from "svelte-adapter-bun";
import { vitePreprocess } from "@sveltejs/kit/vite";
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
  },
  preprocess: vitePreprocess(),
};

export default config;
