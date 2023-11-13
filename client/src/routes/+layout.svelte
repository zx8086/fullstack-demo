<script lang="ts">
  import "../app.css";
  import { onMount } from 'svelte';
  import { themeStore } from '../stores/themeStore';
  import { menuListStore, setMenuList } from '../stores/menuList';
  import { writable } from 'svelte/store';
  import { Sidebar } from 'svelte-sidebar-menu';

  let siteName = "Home";
  let headerClass = "${themeClass} animate-pulse py-3 pl-3";
  let asideClass = "${themeClass} bg-transparent absolute w-auto z-50";
  let navClass = "${themeClass} uppercase pl-5 pr-10 leading-10 z-50";

  onMount(() => {
    // This will run only in the browser, after the component has mounted
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      themeStore.set(storedTheme);
    }

    // Set initial theme class on body
    updateBodyClass($themeStore);

    // This will set the menu for a specific brand, e.g., 'TH' for default.
    setMenuList('TH');

    return () => {
      // Cleanup: remove the script if needed, and clean up any classes added to body
      document.body.classList.remove(themeClass);
    };
  });

  // Update body class whenever themeStore changes
  $: themeClass = $themeStore && `theme-${$themeStore.toLowerCase()}`;
  $: updateBodyClass($themeStore);

  function updateBodyClass(theme: any) {
    if (typeof window !== 'undefined') {
      document.body.className = theme ? `theme-${theme.toLowerCase()}` : '';
    }
  }
</script>

<Sidebar lists={$menuListStore} {siteName} {headerClass} {asideClass} {navClass}/>
<main class="container mx-auto p-24 ${themeClass}">
<h1 class="text-3xl">
  <slot></slot>
</h1>
</main>
