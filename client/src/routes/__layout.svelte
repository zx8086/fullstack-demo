<!-- <script>
    import { onMount } from 'svelte';
  
    onMount(() => {
      // This code will run on the client after the component has been mounted
      if (typeof window !== 'undefined') {
        // Create a new script element
        const script = document.createElement('script');
        script.src = "https://e6621070.cloudfront.localhost.localstack.cloud:4566/elastic-apm-rum.umd.js";
        script.onload = () => {
          console.log('Elastic APM RUM script loaded.');
          // Check if the APM object is available on the window
          if (window.elasticApm) {
            // Initialize the APM agent
            window.elasticApm.init({
              serviceName: 'Svelte-Frontend',
              serverUrl: 'https://apm.siobytes.com',
              environment: 'development',
              logLevel: 'debug',
            });
            console.log('Elastic APM RUM initialized.');
            
            // Additional check to see if the agent has started
            if (window.elasticApm.isStarted()) {
              console.log('Elastic APM RUM agent is started.');
            } else {
              console.error('Elastic APM RUM agent failed to start.');
            }
          } else {
            console.error('Elastic APM RUM script loaded but window.elasticApm is undefined.');
          }
        };
        script.onerror = (error) => {
          console.error('Elastic APM RUM script failed to load.', error);
        };
        // Append the script element to the head of the document
        document.head.appendChild(script);
      }
    });
  </script> -->
  
  <slot />
  <!-- The slot element is where nested routes will be rendered -->
  
  <style>
    /* Global styles */
  </style>
  