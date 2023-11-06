<script lang="ts">
  
  import "../app.css";

  import { onMount } from 'svelte';
  import { Sidebar } from 'svelte-sidebar-menu';

  type MenuItem = {
    href: string;
    name: string;
  };

  let brand = 'TH';
  let menuList: MenuItem[] = [];

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
  });

      if (brand === 'TH') {
        menuList = [
          { href: "01", name: "TH Menswear" },
          { href: "02", name: "Tommy Jeans" },
          { href: "03", name: "TH Licensing" },
          { href: "04", name: "TH Kids" },
          { href: "05", name: "TH Womenswear" },
          { href: "07", name: "Close to Body" },
          { href: "08", name: "Tommy Sport"},
          { href: "09", name: "TH Footwear" },
          { href: "10", name: "TH Accessories" },
          { href: "11", name: "TH Tailored" },
          { href: "18", name: "TH Collections" },
        ];
      } else if (brand === 'CK') {
        menuList = [
          { href: "61", name: "CK Menswear" },
          { href: "62", name: "CK Jeans" },
          { href: "64", name: "CKJ KIDS" },
          { href: "65", name: "CK Womenswear" },
          { href: "67", name: "CK Underwear" },
          { href: "68", name: "CK Sport" },
          { href: "69", name: "CK Footwear" },
          { href: "70", name: "CK Accessories" },
          { href: "77", name: "CK Swimwear" },
        ];
      } else if (brand === 'NIKE') {
        menuList = [
          { href: "97", name: "Nike Underwear" },
        ];
      } else {
        menuList = [];
      }

  let siteName = '';

  let lists = menuList;

  </script>

<Sidebar {lists} {siteName} />
<main class="container mx-auto p-24">
  <h1 class="text-3xl">
    {siteName}
  </h1>
</main>
<slot></slot>