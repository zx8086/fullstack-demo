<script lang="ts">
    // Define a variable to determine the theme (TH or CK)
    let theme = 'TH'; // You can change this dynamically based on your logic
  
    // Function to determine the appropriate loader class based on the theme
    function getLoaderClass() {
      if (theme === 'TH') {
        return 'loader-th'; // Use loader-th class for TH theme
      } else if (theme === 'CK') {
        return 'loader-ck'; // Use loader-ck class for CK theme
      }
    }
  </script>
  
  <div class={getLoaderClass()}>
    <img src="/Spinner-1.1s-211px.svg" alt="Spinner">
  </div>

<style>
    .loader-th {
      /* Styles for TH theme loader */
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: grid;
      place-items: center;
      background-color: white;
      z-index: 1000;
      /* Add other TH-specific styles here */
    }
  
    .loader-ck {
      /* Styles for CK theme loader */
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: grid;
      place-items: center;
      background-color: blue; /* CK-specific background color */
      color: white; /* CK-specific text color */
      z-index: 1000;
      /* Add other CK-specific styles here */
    }
  </style>