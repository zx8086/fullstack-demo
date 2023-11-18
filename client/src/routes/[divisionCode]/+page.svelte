<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { menuListStore } from '../../stores/menuList';
  import ProgressBar from '../../components/ProgressBar.svelte';
  // import { queryStore } from '../../components/graphqlHelper';
  // import DataLoading from '../../components/dataLoading.svelte';
  // import DataFetcher from '../../components/DataFetcher.svelte'; // Update the path to the DataFetcher component

  export let data;

  console.log("Passed data through prop", data);

  $: optionCountsData = data?.data?.optionCountsData;
  $: lookCountsData = data?.data?.lookCountsData;

  $: isSoldOutCount = optionCountsData?.isSoldOutCount;
  $: isAvailableCount = optionCountsData?.isAvailableCount;
  $: isCancelledCount = optionCountsData?.isCancelledCount;
  $: isNewCount = optionCountsData?.isNewCount;
  $: isUpdatedCount = optionCountsData?.isUpdatedCount;
  $: totalCount = optionCountsData?.totalCount;

  $: lookTotalCount = lookCountsData?.totalCount;
  $: incompleteLookCount = lookCountsData?.incompleteCount;

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
  <div class="container ml-20 mx-auto p-0 {themeClass}">
      <div>
        <img src={headerImage} class="h-60 w-full rounded-lg mb-5 shadow-x object-cover object-topl" alt="Division Header"/>
      </div>
    <div class="flex flex-row justify-center space-x-4">
      <div class="w-1/2">
        <!-- Column 1 -->
        <div class="card-th mb-4">
          <!-- Content for the first column -->
          <h2 class="heading-th p-4">{divisionName} STYLE OPTIONS</h2>
          <div class="p-4">
            <p class="font-bold">STYLE OPTIONS</p>
            <p>{isUpdatedCount} OF {totalCount} COMPLETE</p>
            <!-- <DataFetcher {divisionCode} {salesChannels} /> -->
            <p><ProgressBar percentage={isUpdatedCount / totalCount * 100} completed={isUpdatedCount} total={totalCount} /></p>
            <p><ProgressBar percentage={isUpdatedCount / totalCount * 100} completed={isUpdatedCount} total={totalCount} /></p>
            <p><ProgressBar percentage={isUpdatedCount / totalCount * 100} completed={isUpdatedCount} total={totalCount} /></p>
            <p><ProgressBar percentage={isUpdatedCount / totalCount * 100} completed={isUpdatedCount} total={totalCount} /></p>
            <div class="flex justify-center mt-4">
              <a href={`/${divisionId}/styles`} class="btn-th-detailed-report">
                VIEW DETAILED REPORT
              </a>
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
            <p>{isUpdatedCount} OF {lookTotalCount} COMPLETE</p>
            <!-- <DataFetcher {divisionCode} {salesChannels} /> -->
            <p><ProgressBar percentage={incompleteLookCount / lookTotalCount * 100} completed={lookTotalCount - incompleteLookCount} total={lookTotalCount} /></p>
            <p><ProgressBar percentage={lookTotalCount / incompleteLookCount * 100} completed={lookTotalCount - incompleteLookCount} total={lookTotalCount} /></p>
            <div class="flex justify-center mt-4">
              <a href={`/${divisionId}/looks`} class="btn-th-detailed-report">
                VIEW DETAILED REPORT
              </a>
            </div>
          </div>
        </div>
        <div class="card-th mb-4">
          <div class="p-4">
            <p class="font-bold">AVAILABLE LOOKS: {lookTotalCount} </p>
          </div>
        </div>
        <div class="card-th mb-4">
          <div class="p-4">
            <p class="font-bold">PARTIALLY COMPLETED LOOKS: {incompleteLookCount} </p>
          </div>
        </div>
      </div>
    </div>
  </div>
{:else}
  <p>No division found for ID: {divisionId}</p>
{/if}
