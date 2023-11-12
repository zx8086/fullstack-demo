<script>
import { getContext } from 'svelte';
import { onMount } from 'svelte';
import { GET_OPTIONS_BY_DIVISION_CODE_AND_SALES_CHANNEL } from '../../components/graphqlQueries'


// Get the client from context
const client = getContext('urql');

// Now you can use the client in your component
onMount(() => {
  client.query(GET_OPTIONS_BY_DIVISION_CODE_AND_SALES_CHANNEL).toPromise().then((result) => {
    // Handle the query result
    console.log(result);
  });
});
</script>