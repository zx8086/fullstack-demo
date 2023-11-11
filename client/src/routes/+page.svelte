<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { menuListStore, setMenuList } from './../stores/menuList';
  import { themeStore } from './../stores/themeStore';
  import { browser } from '$app/environment';

  let brands = [
    { label: 'Tommy Hilfiger', value: 'TH', imageUrl: '/img/divisions/msw.jpg' },
    { label: 'Calvin Klein', value: 'CK', imageUrl: '/img/divisions/ckwsw.jpg' },
    { label: 'Nike', value: 'NIKE', imageUrl: '/img/divisions/nike.jpg' }
  ];

  let selectedBrandIndex = 0; // Use an index to track the selected brand
  let selectedBrand = brands[selectedBrandIndex];

  // Movie data for each brand (you can fetch this data from an API)
  let movieData = {
    'TH': [
      { title: 'Movie 1', videoUrl: '/FESTIVE MSW1080x1080.mp4' },
      { title: 'Movie 2', videoUrl: 'https://www.example.com/th-video2.mp4' },
      // Add more movies for TH brand
    ],
    'CK': [
      { title: 'Movie A', videoUrl: '/Suiting_Desktop.mp4' },
      { title: 'Movie B', videoUrl: '/Suiting_Desktop.mp4' },
      // Add more movies for CK brand
    ],
    'NIKE': [
      { title: 'Movie X', videoUrl: '/Underwear_Desktop.mp4' },
      { title: 'Movie Y', videoUrl: 'https://www.example.com/nike-videoY.mp4' },
      // Add more movies for NIKE brand
    ],
  };

  // Initialize selectedBrand from localStorage or default to the first brand
  onMount(() => {
    if (browser) {
      const storedBrandValue = localStorage.getItem('selectedBrand');
      selectedBrandIndex = brands.findIndex(brand => brand.value === storedBrandValue);
      if (selectedBrandIndex === -1) {
        selectedBrandIndex = 0; // Fallback to the first brand if not found
      }
    }

    selectedBrand = brands[selectedBrandIndex];
    updateBrand(selectedBrand);
  });

  // Function to handle brand update logic
  function updateBrand(brand) {
    setMenuList(brand.value);
    themeStore.set(brand.value);
    if (browser) {
      localStorage.setItem('selectedBrand', brand.value);
    }
  }

  // Function to navigate to the next brand
  function nextBrand() {
    selectedBrandIndex = (selectedBrandIndex + 1) % brands.length;
    selectedBrand = brands[selectedBrandIndex];
    updateBrand(selectedBrand);
  }

  // Function to navigate to the previous brand
  function previousBrand() {
    selectedBrandIndex = (selectedBrandIndex - 1 + brands.length) % brands.length;
    selectedBrand = brands[selectedBrandIndex];
    updateBrand(selectedBrand);
  }
</script>

<div class="header-container">
  <!-- <img src="/img/PVH_Logo.svg" alt="PVH Logo" class="pvh-logo"> -->
  <h1 class="report-title">DIGITAL SELLING DATA REPORT</h1>
</div>

<div class="carousel-container">
  <button on:click={previousBrand} class="carousel-button previous">&lt;</button>
  <div class="video-container">
    <video src={movieData[selectedBrand.value][0].videoUrl} autoplay loop muted class="carousel-video"></video>
  </div>
  <button on:click={nextBrand} class="carousel-button next">&gt;</button>
</div>

<style>

.header-container {
  text-align: center; /* Center the contents */
  padding: 20px; /* Add some padding around the contents */
  background: #FFF; /* Assuming a white background; adjust as needed */
}

.pvh-logo {
  width: 100px; /* Adjust width as needed */
  height: auto; /* Maintain aspect ratio */
  margin-bottom: 10px; /* Space between logo and title */
}

.report-title {
  font-size: 24px; /* Adjust font size as needed */
  margin: 0; /* Remove default margin */
  /* Additional styling for the title */
}
  .carousel-container {
  position: relative;
  height: 80vh;
  margin: auto;
}

  .video-container {
    width: 100%; /* Full width of the container */
    height: 70vh; /* Fixed height, adjust as needed */
    overflow: hidden; /* Hide overflow to maintain the size */
    position: relative; /* For absolute positioning of the video */
  }

  .carousel-video {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Cover the container completely */
    position: absolute;
    top: 0;
    left: 0;
  }

.carousel-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  z-index: 2;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.carousel-button.previous {
  left: 10px;
}

.carousel-button.next {
  right: 10px;
}

</style>