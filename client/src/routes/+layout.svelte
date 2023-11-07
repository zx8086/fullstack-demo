<script lang="ts">
  import "../app.css";
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { Sidebar } from 'svelte-sidebar-menu';

  type MenuItem = {
    href: string;
    Div: string;
    name: string;
    img?: string;
  };

  let brand = 'TH';
  let menuList: MenuItem[] = []; 
  let lorem ="Lorem ipsum dolor sit amet consectetur adipisicing elit.";
  let siteName = "Home";
  let headerClass = "bg-pink-700 py-3 px-10 items-center text-white border-b-2";
  let asideClass = "absolute w-auto h-full bg-red-50 pt-8 border-r-2 shadow-lg";
  let navClass = "p-7 text-base";
  let selectedDivision: MenuItem | null = null;
  const currentContent = writable("This is the initial content for the 'Home' area");

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

    if (brand === 'TH') {
        menuList = [
          { href: "/01", Div: "01", name: "TH Menswear", img: "../static/img/divisions/msw.jpg" },
          { href: "/02", Div: "02", name: "Tommy Jeans", img: "../static/img/divisions/dnm.jpg" },
          { href: "/03", Div: "03", name: "TH Licensing", img: "../static/img/divisions/licensing.jpg"},
          { href: "/04", Div: "04", name: "TH Kids",img: "../static/img/divisions/kids.jpg" },
          { href: "/05", Div: "05", name: "TH Womenswear", img: "../static/img/divisions/wsw.jpg" },
          { href: "/07", Div: "07", name: "TH Bodywear", img: "../static/img/divisions/bdw.jpg" },
          { href: "/08", Div: "08", name: "Tommy Sport", img: "../static/img/divisions/sports.jpg"},
          { href: "/09", Div: "09", name: "TH Footwear", img: "../static/img/divisions/ftw.jpg" },
          { href: "/10", Div: "10", name: "TH Accessories", img: "../static/img/divisions/acc.jpg" },
          { href: "/11", Div: "11", name: "TH Tailored", img: "../static/img/divisions/tail.jpg" },
          { href: "/18", Div: "18", name: "TH Collections", img: "../static/img/divisions/col.jpg" },
        ];
      } else if (brand === 'CK') {
        menuList = [
          { href: "/61", Div: "61", name: "CK Menswear", img: "../static/img/divisions/msw.jpg" },
          { href: "/62", Div: "62", name: "CK Jeans", img: "../static/img/divisions/dnm.jpg" },
          { href: "/64", Div: "64", name: "CKJ KIDS", img: "../static/img/divisions/kids.jpg" },
          { href: "/65", Div: "65", name: "CK Womenswear", img: "../static/img/divisions/ckwsw.jpg" },
          { href: "/67", Div: "67", name: "CK Underwear", img: "../static/img/divisions/bdw.jpg" },
          { href: "/68", Div: "68", name: "CK Tailored", img: "../static/img/divisions/tail.jpg" },
          { href: "/69", Div: "69", name: "CK Footwear", img: "../static/img/divisions/ckftw.jpg" },
          { href: "/70", Div: "70", name: "CK Accessories", img: "../static/img/divisions/acc.jpg" },
          { href: "/77", Div: "77", name: "CK Swimwear", img: "../static/img/divisions/swm.jpg" },
        ];
      } else if (brand === 'NIKE') {
        menuList = [
          { href: "/97", Div: "97", name: "Nike Underwear", img: "../static/img/divisions/nike.jpg" },
        ];
      } else {
        menuList = [];
      }
  });

</script>

<Sidebar
  lists={menuList}
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
