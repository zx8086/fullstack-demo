<script>
    import { onMount } from 'svelte';
    import { Client, setContextClient, queryStore, getContextClient } from '@urql/svelte';
  
    export let divisionCode = '01';
    export let salesChannels = ["SELLIN"];
  
    const client = new Client({
      url: 'http://localhost:8080/graphql',
      // Your other client configuration options
    });
  
    setContextClient(client);
  
    let result = null;
  
    onMount(async () => {
      try {
        const { data, error } = await queryStore({
          client: getContextClient(),
          // Define your GraphQL query here
          query: YOUR_GRAPHQL_QUERY,
          variables: { divisionCode, salesChannels }
        });
  
        if (error) {
          console.error('GraphQL query error:', error);
        } else {
          result = data.optionCounts; // Replace with the appropriate data structure from your query
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  </script>
  
  <!-- Display the data -->
  {#if result === null}
    <p>Loading...</p>
  {:else if result}
    <ul>
      <li>isAvailableCount: {result.isAvailableCount}</li>
      <li>isCancelledCount: {result.isCancelledCount}</li>
      <li>isNewCount: {result.isNewCount}</li>
      <li>isSoldOutCount: {result.isSoldOutCount}</li>
      <li>isUpdatedCount: {result.isUpdatedCount}</li>
      <li>totalCount: {result.totalCount}</li>
    </ul>
  {:else}
    <p>No data available</p>
  {/if}
  