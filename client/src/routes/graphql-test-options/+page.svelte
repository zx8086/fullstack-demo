<!-- +page.svelte -->
<script>
  // Import the necessary modules from +page.server.js
  import { data, fetching, error } from './+page.server';

  // Check if data is loading
  {#if fetching}
    <p>Loading...</p>
  {:else if error}
    <p>Error: {error.message}</p>
  {:else}
    {#if data.optionsByDivisionAndChannel}
      {#each data.optionsByDivisionAndChannel as option (option.internal_id)}
        <div class="card-th mb-4 text-sm">
          <h2>Option: {option.internal_id}</h2>
          <!-- Display other option details here -->
        </div>
      {/each}
    {:else}
      <p>No options found.</p>
    {/if}
  {/if}
</script>

<!-- Add your HTML layout for displaying data -->
<div class="container mx-auto p-4">
  <!-- You can customize how you want to display the data here -->
</div>



<!-- {#if $result.fetching}
<p>Loading...</p>
{:else if $result.error}
<p>Oh no... {$result.error.message}</p>
{:else}
  {#each $result.data.optionsByDivisionCodeAndSalesChannel as option}
  <div class="card-th mb-4 text-sm">
    <ul class="p-4">
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
{/if} -->
