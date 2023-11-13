<!-- +page.svelte -->

<script context="module">
  // Import necessary modules here
  import { gql } from '@urql/svelte';
  import { GET_TOTALS_BY_DIVISION_CODE_AND_SALES_CHANNEL } from '../../components/graphqlQueries';
  import { fetchGraphQLData } from './../../utils/api'; // Use the utility function for data fetching
</script>

<script>
  // Import your SvelteKit stores and other necessary modules here
  import { page } from '$app/stores';
  import { menuListStore } from '../../stores/menuList';
  import ProgressBar from '../../components/ProgressBar.svelte';
  import { onMount } from 'svelte';
  import { Client, setContextClient, cacheExchange, fetchExchange } from '@urql/svelte'; // Import urql modules

  // Create a client instance
  const client = new Client({
    url: 'http://localhost:8080/graphql',
    exchanges: [cacheExchange, fetchExchange],
  });

  // Set the client in the context during component initialization
  onMount(() => {
    setContextClient(client);
  });

  let menuList = [];
  menuListStore.subscribe(value => {
    menuList = value;
  });

  // Extract divisionId from the URL
  let divisionId = null;
  $: {
    const params = $page.params;
    if (params && 'divisionId' in params) {
      divisionId = params.divisionId;
    }
  }

  // Find the current division from the menuList based on divisionId
  let currentDivision = null;
  $: {
    if (menuList && divisionId) {
      currentDivision = menuList.find(division => division.Div === divisionId) || null;
    }
  }

  // Assuming each division object in your menuList has a property 'img' that contains the path to the image
  $: headerImage = currentDivision ? currentDivision.img : '';
  $: themeClass = currentDivision ? currentDivision.theme : 'theme-default';
  $: divisionName = currentDivision ? currentDivision.name.toUpperCase() : '';

  // Access the data fetched on the server side
  let { data } = $page;

  // Convert the data object to a JSON string for display
  $: jsonData = JSON.stringify(data, null, 2);

  // Rest of your component code here
</script>

<div>
  <!-- Navigation and other content here -->
</div>

{#if currentDivision}
  <div class="container mx-auto p-4 {themeClass}">
    <header style="width: 100%; height: 200px; background-image: url({headerImage}); background-size: cover; background-position: center;">
      <!-- No img tag needed -->
    </header>
    <div class="flex flex-row justify-center space-x-4">
      <!-- Rest of your code for displaying division-specific content here -->
    </div>
  </div>
{:else}
  <p>No division found for ID: {divisionId}</p>
{/if}
