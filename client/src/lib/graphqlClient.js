import { createClient } from '@urql/svelte';

const client = createClient({
  url: 'http://localhost:8080/graphql',
});

export default client;
