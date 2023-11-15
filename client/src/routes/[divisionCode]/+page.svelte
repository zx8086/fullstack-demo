<script lang="ts">
  import { page } from '$app/stores';
  import { menuListStore } from '../../stores/menuList';
  import ProgressBar from '../../components/ProgressBar.svelte';
  // import { queryStore } from '../../components/graphqlHelper';
  // import DataLoading from '../../components/dataLoading.svelte';
  // import DataFetcher from '../../components/DataFetcher.svelte'; // Update the path to the DataFetcher component

  export let data;

  console.log("Passed data through prop", data);

  $: isSoldOutCount = data.data.isSoldOutCount;
  $: isAvailableCount = data.data.isAvailableCount;
  $: isCancelledCount = data.data.isCancelledCount;
  $: isNewCount = data.data.isNewCount;
  $: isUpdatedCount = data. data.isUpdatedCount;
  $: totalCount = data.data.totalCount;


  let menuList = [];
  menuListStore.subscribe(value => {
    menuList = value;
  });

  $: divisionId = $page.params.divisionCode;
  $: currentDivision = menuList.find(division => division.Div === divisionId) || null;

  // Assuming each division object in your menuList has a property 'img' that contains the path to the image
  $: headerImage = currentDivision ? currentDivision.img : '';
  $: themeClass = currentDivision ? currentDivision.theme : 'theme-default';
  $: divisionName = currentDivision ? currentDivision.name.toUpperCase() : '';


  // Call the function to fetch GraphQL data when the component mounts
  import { onMount } from 'svelte';
  onMount(() => {

  });
</script>

{#if currentDivision}
  <div class="container mx-auto p-4 {themeClass}">
    <header style="width: 100%; height: 200px; background-image: url({headerImage}); background-size: cover; background-position: center;">
      <!-- No img tag needed -->
    </header>
    <div class="flex flex-row justify-center space-x-4">
      <div class="w-1/2">
        <!-- Column 1 -->
        <div class="card-th mb-4">
          <!-- Content for the first column -->
          <h2 class="heading-th p-4">{divisionName} STYLE OPTIONS</h2>
          <div class="p-4">
            <p class="font-bold">STYLE OPTIONS</p>
            <p>{currentDivision.styleOptionsCompleted} OF {currentDivision.styleOptionsTotal} COMPLETE</p>
            <!-- <DataFetcher {divisionCode} {salesChannels} /> -->
            <p><ProgressBar percentage={90} completed={1256} total={1398} /></p>
            <p><ProgressBar percentage={90} completed={1256} total={1398} /></p>
            <p><ProgressBar percentage={90} completed={1256} total={1398} /></p>
            <p><ProgressBar percentage={90} completed={1256} total={1398} /></p>
            <div class="flex justify-center mt-4">
              <button class="btn-th-detailed-report">
                VIEW DETAILED REPORT
              </button>
            </div>
          </div>
          <div class="p-4">
          </div>
        </div>
        <div class="card-th mb-4">
          <div class="p-4">
            <p class="font-bold">AVAILABLE STYLE OPTIONS: {isAvailableCount} </p>
          </div>
        </div>
        <div class="card-th mb-4">
          <div class="p-4">
            <p class="font-bold">SOLD OUT STYLE OPTIONS: {isSoldOutCount}</p>
          </div>
        </div>
        <div class="card-th mb-4">
          <div class="p-4">
            <p class="font-bold">CANCELED STYLE OPTIONS: {isCancelledCount}</p>
          </div>
        </div>
        <div class="card-th mb-4">
          <div class="p-4">
            <p class="font-bold">PARTIALLY COMPLETED STYLE OPTIONS: </p>
          </div>
        </div>
        <div class="card-th mb-4">
          <div class="p-4">
            <p class="font-bold">NEW STYLE OPTIONS: {isNewCount}</p>
          </div>
        </div>
      </div>
      <div class="w-1/2">
        <!-- Column 2 -->
        <div class="card-th mb-4">
          <!-- Content for the second column -->
          <h2 class="heading-th p-4">{divisionName} LOOKS</h2>
          <div class="p-4">
            <p class="font-bold">LOOKS</p>
            <p>{currentDivision.looksCompleted} OF {currentDivision.looksTotal} COMPLETE</p>
            <p><ProgressBar percentage={90} completed={1256} total={1398} /></p>
            <p><ProgressBar percentage={90} completed={1256} total={1398} /></p>
            <div class="flex justify-center mt-4">
              <button class="btn-th-detailed-report">
                VIEW DETAILED REPORT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{:else}
  <p>No division found for ID: {divisionId}</p>
{/if}