<script lang="ts">
    import { menuListStore, setMenuList } from './../stores/menuList';
  
    // This function is called whenever the dropdown changes.
    function handleBrandChange(event) {
      setMenuList(event.target.value);
    }
  </script>

<div class="md:container">
    <p>Another season, another reason to sell !</p>
    <p>It's time to get rid of all the bugs you don't need anymore.</p>
</div>

<div class="md:container">
    <select on:change={handleBrandChange}>
      <option value="" disabled selected>Select a brand</option>
      <option value="TH">Tommy Hilfiger</option>
      <option value="CK">Calvin Klein</option>
      <option value="NIKE">Nike</option>
    </select>
</div>

