<script>
  import { Client, setContextClient, cacheExchange, fetchExchange, queryStore, gql, getContextClient } from '@urql/svelte';
  import { GET_TOTALS_BY_DIVISION_CODE_AND_SALES_CHANNEL } from '../../components/graphqlQueries'
  const client = new Client({
    url: 'http://localhost:8080/graphql',
    exchanges: [cacheExchange, fetchExchange],
  });

  setContextClient(client);

  let divisionCode = '01';
  let salesChannels = ["SELLIN"];

$: result = queryStore({
  client: getContextClient(),
  query: GET_TOTALS_BY_DIVISION_CODE_AND_SALES_CHANNEL,
  variables: { divisionCode, salesChannels }
  });

</script>

{#if $result.fetching}
<p>Loading...</p>
{:else if $result.error}
<p>Oh no... {$result.error.message}</p>
{:else}
<ul>
  <li>isAvailableCount: {$result.data.optionCounts.isAvailableCount}</li>
  <li>isCancelledCount: {$result.data.optionCounts.isCancelledCount}</li>
  <li>isNewCount: {$result.data.optionCounts.isNewCount}</li>
  <li>isSoldOutCount: {$result.data.optionCounts.isSoldOutCount}</li>
  <li>isUpdatedCount: {$result.data.optionCounts.isUpdatedCount}</li>
  <li>totalCount: {$result.data.optionCounts.totalCount}</li>
</ul>
{/if}

