// aggregatedTotalsStore.js
import { writable } from 'svelte/store';

// Initialize the store with initial values
const aggregatedTotals = writable({
  soldOutStyleOptionsCount: 0, // isSoldOutCount
  partiallyCompletedStyleOptionsCount: 0,
  cancelledStyleOptionsCount: 0, // isCancelledCount
  completedStyleOptionsCount: 0, // isAvailableCount
  updatedStyleOptionsCount: 0, // isUpdatedCount
  newStyleOptionsCount: 0, // isNewCount
  // Add more aggregated totals as needed
});

export default aggregatedTotals;
