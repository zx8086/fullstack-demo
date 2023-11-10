<script>
    import { Client, setContextClient, cacheExchange, fetchExchange, queryStore, gql, getContextClient } from '@urql/svelte';
    import { devtoolsExchange } from '@urql/devtools';
    import { onMount } from 'svelte';
    import { GET_OPTIONS_BY_DIVISION_CODE, GET_OPTIONS, GET_OPTIONS_LIMIT, GET_TOTAL_COUNT, GET_TODOS } from './graphqlQueries';
	import DataLoading from '../../components/dataLoading.svelte';
  
	let isPageLoaded = false;
	const pageLoaded = () => {
	isPageLoaded = true
	};

    const client = new Client({
      url: 'http://localhost:8080/graphql',
      exchanges: [devtoolsExchange, cacheExchange, fetchExchange],
    });
  
    setContextClient(client);

	let selectedDivision = "03";

    $: results = queryStore({
      client: client,
      query: GET_OPTIONS_BY_DIVISION_CODE,
      variables: { divisionCode: selectedDivision } 
    });

  </script>
  
  {#if $results.fetching}
    <DataLoading />
    {:else if $results.error}
      <p>Error: {$results.error.message}</p>
    {:else if $results.data && Array.isArray($results.data.optionsByDivisionCode) && $results.data.optionsByDivisionCode.length > 0}
      {#each $results.data.optionsByDivisionCode as option}
        <div class="option">
          {#each Object.entries(option) as [key, value]}
            <p>
              <strong>{key}:</strong> {value}
            </p>
          {/each}
        </div>
      {/each}
    {:else}
  <p>No data available</p>
{/if}
