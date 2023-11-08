<script lang="ts">
  import { menuListStore, setMenuList } from './../stores/menuList';
  
  let brands = [
    { label: 'Tommy Hilfiger', value: 'TH', imageUrl: '/img/divisions/msw.jpg' },
    { label: 'Calvin Klein', value: 'CK', imageUrl: '/img/divisions/ckwsw.jpg' },
    { label: 'Nike', value: 'NIKE', imageUrl: '/img/divisions/nike.jpg' }
  ];
  
  let selectedBrand = brands[0]; // default to the first brand

  function nextBrand() {
    const currentIndex = brands.findIndex(brand => brand.value === selectedBrand.value);
    const nextIndex = (currentIndex + 1) % brands.length;
    selectedBrand = brands[nextIndex];
    setMenuList(selectedBrand.value); 
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
</div>
