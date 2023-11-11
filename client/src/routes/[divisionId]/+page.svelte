<script lang="ts">
    import { page } from '$app/stores';
    import { menuListStore } from '../../stores/menuList';
    import ProgressBar from '../../components/ProgressBar.svelte';

  
    let menuList = [];
    menuListStore.subscribe(value => {
      menuList = value;
    });
    
    $: divisionId = $page.params.divisionId;
    $: currentDivision = menuList.find(division => division.Div === divisionId) || null;
    
    // Assuming each division object in your menuList has a property 'img' that contains the path to the image
    $: backgroundImage = currentDivision ? currentDivision.img : '';
    $: themeClass = currentDivision ? currentDivision.theme : 'theme-default';
    $: divisionName = currentDivision ? currentDivision.name.toUpperCase() : '';
  </script>
  
  {#if currentDivision}
    <div class="container mx-auto p-4 {themeClass}" style="background-image: url({backgroundImage}); background-size: cover; background-position: center;">
      <div class="flex flex-row justify-center space-x-4">
        <div class="w-1/2">
          <!-- Column 1 -->
          <div class="card-th mb-4">
            <!-- Content for the first column -->
            <h2 class="heading-th p-4">{divisionName} STYLE OPTIONS</h2>
            <div class="p-4">
              <p class="font-bold">STYLE OPTIONS</p>
              <p>{currentDivision.styleOptionsCompleted} OF {currentDivision.styleOptionsTotal} COMPLETE</p>
              <p><ProgressBar percentage={90} completed={1256} total={1398} /></p>
              <p><ProgressBar percentage={90} completed={1256} total={1398} /></p>
              <p><ProgressBar percentage={90} completed={1256} total={1398} /></p>
              <p><ProgressBar percentage={90} completed={1256} total={1398} /></p>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  {:else}
    <p>No division found for ID: {divisionId}</p>
  {/if}
  