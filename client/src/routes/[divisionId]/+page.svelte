<script lang="ts">
import { page } from '$app/stores';

$: divisionId = $page.params.divisionId;

</script>

<p>Division ID: {divisionId}</p>