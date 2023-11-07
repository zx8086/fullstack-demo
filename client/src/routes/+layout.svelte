<script lang="ts">
  import "../app.css";
  import { onMount } from 'svelte';
  import { menuListStore, setMenuList } from '../stores/menuList';
  import { writable } from 'svelte/store';
  import { Sidebar } from 'svelte-sidebar-menu';

  let siteName = "Home";
  let headerClass = "bg-pink-700 py-3 px-10 items-center text-white border-b-2";
  let asideClass = "absolute w-auto h-full bg-red-50 pt-8 border-r-2 shadow-lg";
  let navClass = "p-7 text-base";

  onMount(() => {

    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = "/elastic-apm-rum.umd.js";
      // script.src = "https://e6621070.cloudfront.localhost.localstack.cloud:4566/elastic-apm-rum.umd.js";
      script.onload = () => {
        console.log('Elastic APM RUM script loaded.');
        if (window.elasticApm) {
          try {
            window.elasticApm.init({
              serviceName: 'Svelte-Frontend',
              serverUrl: 'https://apm.siobytes.com',
              serviceVersion: '1.0.0',
              environment: process.env.NODE_ENV || 'development',
              logLevel: 'trace',
              breakdownMetrics: true,
            });
            console.log('Elastic APM initialized.');
          } catch (e) {
            console.error('Error initializing Elastic APM RUM:', e);
          }
        } else {
          console.error('Elastic APM RUM script loaded but window.elasticApm is undefined.');
        }
      };
      script.onerror = (event) => {
        console.error('Elastic APM RUM script failed to load.', event);
      };
      document.head.appendChild(script);
    }

  // This will set the menu for a specific brand, e.g., 'TH' for default.
  setMenuList('TH');

  });

</script>

<Sidebar
  lists={$menuListStore}
  {siteName}
  {headerClass}
  {asideClass}
  {navClass}
/>
<main class="container mx-auto p-24">
  <h1 class="text-3xl">
    <slot></slot>
  </h1>
</main>
