<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { menuListStore, setMenuList } from './../stores/menuList';
  import { themeStore } from './../stores/themeStore';
  import { browser } from '$app/environment';

  let brands = [
    { label: 'Tommy Hilfiger', value: 'TH', imageUrl: '/img/divisions/msw.jpg' },
    { label: 'Calvin Klein', value: 'CK', imageUrl: '/img/divisions/ckwsw.jpg' },
    { label: 'Nike', value: 'NIKE', imageUrl: '/img/divisions/nike.jpg' }
  ];

  let selectedBrandIndex = 0; // Use an index to track the selected brand
  let selectedBrand = brands[selectedBrandIndex];

  // Initialize selectedBrand from localStorage or default to the first brand
  onMount(() => {
    if (browser) {
      const storedBrandValue = localStorage.getItem('selectedBrand');
      selectedBrandIndex = brands.findIndex(brand => brand.value === storedBrandValue);
      if (selectedBrandIndex === -1) {
        selectedBrandIndex = 0; // Fallback to the first brand if not found
      }
    }

    selectedBrand = brands[selectedBrandIndex];
    updateBrand(selectedBrand);
  });

  // Function to handle brand update logic
  function updateBrand(brand) {
    setMenuList(brand.value);
    themeStore.set(brand.value);
    if (browser) {
      localStorage.setItem('selectedBrand', brand.value);
    }
  }

  // Function to navigate to the next brand
  function nextBrand() {
    selectedBrandIndex = (selectedBrandIndex + 1) % brands.length;
    selectedBrand = brands[selectedBrandIndex];
    updateBrand(selectedBrand);
  }

  // Function to navigate to the previous brand
  function previousBrand() {
    selectedBrandIndex = (selectedBrandIndex - 1 + brands.length) % brands.length;
    selectedBrand = brands[selectedBrandIndex];
    updateBrand(selectedBrand);
  }
</script>

<div class="carousel-container">
  <button on:click={previousBrand} class="carousel-button">Previous</button>
  <img src={selectedBrand.imageUrl} alt={selectedBrand.label} class="carousel-image height-800 width-533"/>
  <button on:click={nextBrand} class="carousel-button">Next</button>

  <!-- <div class="brand-info">
    <p>Selected Brand: {selectedBrand.label}</p>
    <p>Selected Value: {selectedBrand.value}</p>
    <p>Selected Theme: {$themeStore}</p>
  </div> -->
</div>

<style>
  .carousel-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .carousel-button {
    padding: 0.5rem 1rem;
    margin: 0 1rem;
    cursor: pointer;
  }
  .carousel-image {
    max-width: 100%;
    height: auto;
  }
  .brand-info {
    text-align: center;
  }
</style>