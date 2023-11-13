// utils/api.js

import { Client, setContextClient, cacheExchange, fetchExchange, queryStore, getContextClient } from '@urql/svelte';
import { GET_TOTALS_BY_DIVISION_CODE_AND_SALES_CHANNEL } from '../components/graphqlQueries';

const client = new Client({
  url: 'http://localhost:8080/graphql',
  exchanges: [cacheExchange, fetchExchange],
});

export async function fetchGraphQLData(divisionCode, salesChannels) {
  try {
    const { data, error } = await queryStore({
      client: getContextClient(),
      query: GET_TOTALS_BY_DIVISION_CODE_AND_SALES_CHANNEL,
      variables: { divisionCode, salesChannels },
    });

    if (error) {
      console.error('Error fetching data:', error);
      return { error: 'Failed to fetch data' };
    }

    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return { error: 'Failed to fetch data' };
  }
}
