<script lang="ts">
    import { menuListStore, setMenuList } from './../stores/menuList';
  
    // This function is called whenever the dropdown changes.
    function handleBrandChange(event) {
      setMenuList(event.target.value);
    }

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
    setMenuList(selectedBrand.value); // You would define setMenuList to update the menu list
  }

  </script>

<div class="md:container box-border p-4">
    <p>Another season, another reason to sell !</p>
    <p>It's time to get rid of all the bugs you don't need anymore.</p>
</div>

<!-- <div class="md:container box-border p-3">
    <select on:change={handleBrandChange}>
      <option value="" disabled selected>Select a brand</option>
      <option value="TH">Tommy Hilfiger</option>
      <option value="CK">Calvin Klein</option>
      <option value="NIKE">Nike</option>
    </select>
</div> -->


<div class="image-carousel">
  <img src={selectedBrand.imageUrl} alt={selectedBrand.label} />
  <button class="bg-sky-500 hover:bg-sky-70 rounded-xl shadow-lg items-left space-x-4" on:click={nextBrand}>Brand</button>
  <p>Selected Brand: {selectedBrand.label}</p>
</div>
