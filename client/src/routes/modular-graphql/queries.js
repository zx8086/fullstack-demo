// queries.js

import { query } from '@urql/svelte';
import { getClient } from './client'; // You can put your GraphQL client configuration here

const GET_OPTIONS_BY_DIVISION_CODE_AND_SALES_CHANNEL = `
  query optionCounts($divisionCode: String!, $salesChannels: [String!]) {
    optionCounts(divisionCode: $divisionCode, salesChannels: $salesChannels) {
      isAvailableCount
      isCancelledCount
      isNewCount
      isSoldOutCount
      isUpdatedCount
      totalCount
    }
  }
`;

export async function fetchOptionCounts(divisionCode, salesChannels) {
  const client = getClient(); // Get your GraphQL client instance
  const response = await client.query(
    query(GET_OPTIONS_BY_DIVISION_CODE_AND_SALES_CHANNEL, {
      divisionCode,
      salesChannels,
    })
  );

  if (response.error) {
    throw response.error;
  }

  return response.data.optionCounts;
}
