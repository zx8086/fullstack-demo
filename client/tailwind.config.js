// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'tommy': {
          'white': '#ffffff', // Text color
          'gray': '#969696', // Text color
          'red': '#cc0c2f', // Text color
          'orange': '#cb1017', // Text color, darker variation of red
          'blue': '#0000ee', // Text color
          'purple': '#551a8b', // Text color
          'dark-blue': '#00174f', // Text color, darker variation of blue
          'darker-blue': '#000c2d', // Text color, darkest blue variation
          'light-gray': '#5a5c66', // Text color, lighter gray
          'black': '#000000', // Text color
          
          'background-lightest': '#ffffff', // Background color, lightest
          'background-lighter': '#f4f4f4', // Background color, lighter
          'background-light-gray': '#e5e5e5', // Background color, light gray
          'background-cream': '#e8e4dc', // Background color, cream

          'background-medium-gray': '#cccccc', // Background color, medium gray
          'background-medium-gray-two': '#cbcbcb', // Background color, similar to above, slight variation
          'background-slate-gray': '#c8c8c8', // Background color, slate gray
          'background-cool-gray': '#c0c0c0', // Background color, cool gray

          'background-dark-gray': '#b5b5b5', // Background color, darker gray
          'background-darker-gray': '#b3b3b3', // Background color, darker than the above gray
          'background-navy': '#00174fcc', // Background color, navy with some transparency
          'background-deep-blue': '#000c2d', // Background color, deep blue

          'fill-lightest': '#ffffff', // Fill color, lightest
          'fill-off-white': '#fffffe', // Fill color, off-white
          'fill-red': '#cc0d2e', // Fill color, red
          'fill-dark-blue': '#00174f', // Fill color, dark blue
          'fill-darker-blue': '#000c2d', // Fill color, darkest blue
          'fill-black': '#000000', // Fill color, black

          'border-white': '#ffffff', // Border color, white
          'border-red': '#cb1017', // Border color, red
          'border-dark-blue': '#000c2d', // Border color, dark blue
        }
      }
    }
  },
  plugins: []
};
