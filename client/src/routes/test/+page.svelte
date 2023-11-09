<script>
    import { Client, setContextClient, cacheExchange, fetchExchange, queryStore, gql, getContextClient } from '@urql/svelte';
    import { devtoolsExchange } from '@urql/devtools';
    import { onMount } from 'svelte';
    import { GET_OPTIONS, GET_OPTIONS_LIMIT, GET_TOTAL_COUNT, GET_TODOS } from './graphqlQueries';
  
    const client = new Client({
      url: 'http://localhost:8080/graphql',
      exchanges: [devtoolsExchange, cacheExchange, fetchExchange],
    });
  
    setContextClient(client);
  
    let limit = 10; // Adjust to your pagination size
    let from = 0; // Represents the current page
  
    $: results = queryStore({
      client: client,
      query: GET_TODOS,
      variables: { from, limit }
    });
  
    console.log("from: " + from);
    console.log("limit: " + limit);

    // Implement your pagination logic here
    function nextPage() {
      from = from + 10;
    }
  
  </script>
  
  {#if $results.fetching}
    <p>Loading...</p>
  {:else if $results.error}
    <p>Error: {$results.error.message}</p>
  {:else if $results.data && Array.isArray($results.data.optionsPage)}
    {#each $results.data.optionsPage as option, i}
      {#if option}
        <p>{option.i}</p>
      {:else}
        <p>No data available</p>
      {/if}
      <p>{option.id}</p>
    {/each}
  {:else}
    <p>No data available</p>
  {/if}
  
  <button on:click={nextPage}>Next Page</button>
  
