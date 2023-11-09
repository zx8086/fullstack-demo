<script>
    import { gql } from 'graphql-request';
    import { GraphQLClient } from 'graphql-request';
    import { onMount } from 'svelte';
    import {GET_OPTIONS, GET_TOTAL_COUNT} from './graphqlQueries';
  
    const endpoint = 'http://localhost:8080/graphql/';
  
    const client = new GraphQLClient(endpoint);
    let options = [];
    let isLoading = true;
  
    // Pagination variables
    let currentPage = 1;
    let itemsPerPage = 10; // Change this to your desired number
    let totalItems = 0;
  
    // Calculate the skip value based on currentPage and itemsPerPage
    let skip = (currentPage - 1) * itemsPerPage;
  
    async function fetchData() {
      try {
        const { options: fetchedOptions } = await client.request(GET_OPTIONS, {
          first: itemsPerPage,
          skip: skip,
        });
        options = fetchedOptions;
        isLoading = false;
  
        // Fetch the total count of items
        const { _allOptionsMeta } = await client.request(GET_TOTAL_COUNT);
        totalItems = _allOptionsMeta.count;
      } catch (error) {
        console.error('Error fetching data:', error);
        isLoading = false;
      }
    }
  
    onMount(fetchData);
  
    // Pagination functions
    function nextPage() {
      if (skip + itemsPerPage < totalItems) {
        currentPage++;
        skip = (currentPage - 1) * itemsPerPage;
        fetchData();
      }
    }
  
    function prevPage() {
      if (currentPage > 1) {
        currentPage--;
        skip = (currentPage - 1) * itemsPerPage;
        fetchData();
      }
    }
  </script>
  
  <div>
    {#if isLoading}
      <p>Loading options...</p>
    {:else if options.length > 0}
      <h2>Option Details</h2>
      {#each options as option (option.id)}
        <div>
          <p>{option.description}</p>
          <!-- Add more details from the current option as needed -->
        </div>
      {/each}
      <!-- Pagination controls -->
      <div class="pagination">
        <button on:click={prevPage} disabled={currentPage === 1}>Previous</button>
        <button on:click={nextPage} disabled={skip + itemsPerPage >= totalItems}>Next</button>
      </div>
    {:else}
      <p>No data available</p>
    {/if}
  </div>
  