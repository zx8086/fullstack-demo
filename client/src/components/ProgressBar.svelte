<!-- ProgressBar.svelte -->
<script>
    export let percentage = 0; // Expects a value between 0 and 100
    export let completed = 0;
    export let total = 0;
  </script>
  
  <div class="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
    <div class="bg-green-600 h-4 rounded-full" style="width: {percentage}%"></div>
  </div>
  <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
    {percentage}% COMPLETE - {completed} OF {total}
  </p>
  