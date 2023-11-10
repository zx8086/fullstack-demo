<script>
    import { Client, setContextClient, cacheExchange, fetchExchange, queryStore, gql, getContextClient } from '@urql/svelte';
    import { devtoolsExchange } from '@urql/devtools';
    import { onMount } from 'svelte';
    import { GET_OPTIONS_BY_DIVISION_CODE, GET_OPTIONS, GET_OPTIONS_LIMIT, GET_TOTAL_COUNT, GET_TODOS } from './graphqlQueries';
  
    const client = new Client({
      url: 'http://localhost:8080/graphql',
      exchanges: [devtoolsExchange, cacheExchange, fetchExchange],
    });
  
    setContextClient(client);

  
    $: results = queryStore({
      client: client,
      query: GET_OPTIONS_BY_DIVISION_CODE,
      variables: { divisionCode: "01" } 
    });

    // Implement your pagination logic here
    // function nextPage() {
    //   from = from + 10;
    // }
  
  </script>
  
  {#if $results.fetching}
  <p>Loading...</p>
{:else if $results.error}
  <p>Error: {$results.error.message}</p>
{:else if $results.data && Array.isArray($results.data.optionsByDivisionCode) && $results.data.optionsByDivisionCode.length > 0}
  {#each $results.data.optionsByDivisionCode as option}
    <p>{option.id}</p>
    <!-- Render other option data here -->
  {/each}
{:else}
  <p>No data available</p>
{/if}

  
  <!-- <button on:click={nextPage}>Next Page</button> -->
  
