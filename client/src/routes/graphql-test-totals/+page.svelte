<script>
  /** @type {import('./$types').PageData} */
  export let data;

  let totals = data;

  console.log("Totals", totals);
</script>

<div class="card-th mb-4 text-sm">
  <ul>
    <li>isAvailableCount: {totals.data.isAvailableCount}</li>
    <li>isCancelledCount: {totals.data.isCancelledCount}</li>
    <li>isNewCount: {totals.data.isNewCount}</li>
    <li>isSoldOutCount: {totals.data.isSoldOutCount}</li>
    <li>isUpdatedCount: {totals.data.isUpdatedCount}</li>
    <li>totalCount: {totals.data.totalCount}</li>
  </ul>
</div>
