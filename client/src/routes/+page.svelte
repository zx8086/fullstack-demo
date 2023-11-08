<script lang="ts">
  import { onMount } from 'svelte';
  import { menuListStore, setMenuList } from './../stores/menuList';
  import { themeStore } from './../stores/themeStore';
  import { browser } from '$app/environment';

  let brands = [
    { label: 'Tommy Hilfiger', value: 'TH', imageUrl: '/img/divisions/msw.jpg' },
    { label: 'Calvin Klein', value: 'CK', imageUrl: '/img/divisions/ckwsw.jpg' },
    { label: 'Nike', value: 'NIKE', imageUrl: '/img/divisions/nike.jpg' }
  ];

  let selectedBrand = brands[0]; // Initialize with a default brand

  // Function to update brand and theme
  function nextBrand() {
    const currentIndex = brands.findIndex(brand => brand.value === selectedBrand.value);
    const nextIndex = (currentIndex + 1) % brands.length;
    selectedBrand = brands[nextIndex];
    setMenuList(selectedBrand.value);
    themeStore.set(selectedBrand.value); // This updates the theme
    if (browser) {
      localStorage.setItem('selectedBrand', selectedBrand.value); // Update localStorage on the client-side
    }
  }

  // Initialize the menu and theme on component mount, including localStorage handling
  onMount(() => {
    let initialBrandValue = brands[0].value;

    if (browser) {
      // Client-side logic
      initialBrandValue = localStorage.getItem('selectedBrand') || brands[0].value;
    }

    selectedBrand = brands.find(brand => brand.value === initialBrandValue) || brands[0];
    setMenuList(selectedBrand.value);
    themeStore.set(selectedBrand.value);
  });

  // Reactively update the menu and theme when selectedBrand changes
  $: if (selectedBrand && browser) {
    setMenuList(selectedBrand.value);
    themeStore.set(selectedBrand.value);
    localStorage.setItem('selectedBrand', selectedBrand.value);
  }

  // Reactive statement to log the current theme
  $: if ($themeStore) {
    console.log('Current theme:', $themeStore);
  }
</script>
    
<div class="md:container box-border p-4">
  <p>Another season, another reason to sell !</p>
  <p>It's time to get rid of all the bugs you don't need anymore.</p>
</div>

<div class="image-carousel">
  <img src={selectedBrand.imageUrl} alt={selectedBrand.label} />
  <button class="bg-sky-500 hover:bg-sky-700 rounded-xl shadow-lg items-left space-x-4 animate-pulse p-4 my-8" on:click={nextBrand}>Brand</button>
  <p>Selected Brand: {selectedBrand.label}</p>
  <p>Selected Theme: {$themeStore}</p>
</div>
