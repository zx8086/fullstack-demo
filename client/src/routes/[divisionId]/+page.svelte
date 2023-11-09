<script lang="ts">
    import { ApolloClient, InMemoryCache } from "@apollo/client/core";
    import { setClient, query } from "svelte-apollo";
    import { GET_OPTIONS } from "./graphqlQueries"; // Import the new query
  
    // GraphQL setup
    const client = new ApolloClient({
      uri: "http://localhost:8080/graphql", // Update with your GraphQL endpoint
      cache: new InMemoryCache(),
    });
    setClient(client);
  
    // Define a reactive variable for options data
    let optionsData;
  
    // Use $fetch to initiate the query when the component is created
    async function fetchOptionsData() {
      try {
        // Use the GET_OPTIONS query without variables
        const { loading, error, data } = query(GET_OPTIONS);
  
        if (!loading && !error) {
          optionsData = data; // Assuming your query returns an object with the 'options' property
        }
      } catch (error) {
        console.error("Error loading options:", error.message);
      }
    }
  
    // Call the fetchOptionsData function when the component is created
    $: {
      fetchOptionsData();
    }
  </script>
  
  <!-- Define the optionsData variable here -->
  {#if optionsData}
    {#if optionsData.loading}
      <p>Loading options...</p>
    {:else if optionsData.error}
      <p>Error loading options: {optionsData.error.message}</p>
    {:else if optionsData.data}
      {#each optionsData.data.options as option (option.id)}
        <div>
          <h2>Option Details</h2>
          <p>{option.description}</p>
          <!-- Add more details from the current option as needed -->
        </div>
      {/each}
    {:else}
      <p>No data available</p>
    {/if}
  {/if}
  </html>
  