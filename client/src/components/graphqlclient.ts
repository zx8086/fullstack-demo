import { Client } from '@urql/svelte';
import { getContext, setContext } from 'svelte';

const client = new Client({
  url: 'http://localhost:8080/graphql',
  // Your other client configuration options
});

// Make the client available to your components using SvelteKit's getContext and setContext
setContext('urql', client);

export { client }; // Optionally, you can export the client for easier import in other files
