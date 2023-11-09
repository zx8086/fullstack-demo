<script>
    import { Client, setContextClient, cacheExchange, fetchExchange, queryStore, gql, getContextClient } from '@urql/svelte';
  
    const client = new Client({
      url: 'http://localhost:8080/graphql',
      exchanges: [cacheExchange, fetchExchange],
    });
  
    setContextClient(client);

    let limit = 10;
  let from = 0;

  $: todos = queryStore({
    client: getContextClient(),
    query: gql`
      query ($from: Int!, $limit: Int!) {
        todos(from: $from, limit: $limit) {
          id
          title
        }
      }
    `,
    variables: { from, limit }
    });

  function nextPage() {
    from = from + 10
  };
</script>

<button on:click={nextPage}>Next page<button></button></button>

