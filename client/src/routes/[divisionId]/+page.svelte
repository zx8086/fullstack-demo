<script lang="ts">

import { page } from '$app/stores';
import { menuListStore } from '../../stores/menuList';

let menuList = [];
menuListStore.subscribe(value => {
  menuList = value;
});

$: divisionId = $page.params.divisionId;
$: currentDivision = menuList.find(division => division.Div === divisionId) || null;

</script>
{#if currentDivision}
    <p>Division ID: {currentDivision.Div}</p>
    <p>Name: {currentDivision.name}</p>
{#if currentDivision.img}
    <img src={currentDivision.img} alt={`Image for ${currentDivision.name}`} />
{/if}
{:else}
    <p>No division found for ID: {divisionId}</p>
{/if}