<script>
  import { Client, setContextClient, cacheExchange, fetchExchange, queryStore, gql, getContextClient } from '@urql/svelte';
  import { GET_OPTIONS_BY_DIVISION_CODE_AND_SALES_CHANNEL } from '../../components/graphqlQueries'
  const client = new Client({
    url: 'http://localhost:8080/graphql',
    exchanges: [cacheExchange, fetchExchange],
  });

  setContextClient(client);

  let divisionCode = '01';
  let salesChannels = ["B2B"];

$: result = queryStore({
  client: getContextClient(),
  query: GET_OPTIONS_BY_DIVISION_CODE_AND_SALES_CHANNEL,
  variables: { divisionCode, salesChannels}
  });
</script>

{#if $result.fetching}
<p>Loading...</p>
{:else if $result.error}
<p>Oh no... {$result.error.message}</p>
{:else}
  {#each $result.data.optionsByDivisionCodeAndSalesChannel as option}
  <div class="card-th mb-4 text-sm">
    <ul>
        <li>Style Number: {option.styleNumber}</li>
        <li>Description: {option.description}</li>
        <li>Fashionability: {option.fashionability}</li>
        <li>Sales Organization Code: {option.salesOrganizationCode}</li>
        <li>Sales Channels: {option.salesChannels}</li>
        <li>Fabric: {option.fabric}</li>
        <li>Is Available: {option.isAvailable}</li>
        <li>Is Cancelled: {option.isCancelled}</li>
        <li>Is Closed: {option.isClosed}</li>
        <li>Is Invalid: {option.isInvalid}</li>
        <li>Is Licensed: {option.isLicensed}</li>
        <li>Is New: {option.isNew}</li>
        <li>Is Sold Out: {option.isSoldOut}</li>
        <li>Is Updated: {option.isUpdated}</li>
        <li>Key Look: {option.keyLook}</li>
        <li>Main Season: {option.mainSeason}</li>
        <li>Merchandising Hierarchy: {option.merchandisingHierarchy}</li>
    </ul>
  </div>
  {/each}
{/if}
