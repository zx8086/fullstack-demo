<script>
    import { onMount } from 'svelte';
  
    onMount(() => {
      if (typeof window !== 'undefined') {
        const script = document.createElement('script');
        script.src = "/elastic-apm-rum.umd.js";
        script.onload = () => {
          console.log('Elastic APM RUM script loaded.');
          if (window.elasticApm) {
            try {
              window.elasticApm.init({
                serviceName: 'Svelte-Frontend',
                serverUrl: 'https://apm.siobytes.com',
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
          console.error('Elastic APM RUM script failed to load.', event.message, event.filename, event.lineno, event.colno, event.error);
        };
        document.head.appendChild(script);
      }
    });
  </script>
  
  <slot />
  <!-- The slot element is where nested routes will be rendered -->
  
  <style>
    /* Global styles */
  </style>
  
