/** @type {import('./$types').PageLoad} */

import { fetchGraphQLData } from './../../utils/api/fetchGraphQLData';

export async function load({ params }) {
  const divisionCode = '11';
  const salesChannels = ['SELLIN'];

  const query = `
    query getOptionCounts {
      optionCounts(divisionCode: "${divisionCode}", salesChannels: ${JSON.stringify(
        salesChannels
      )}) {
        isAvailableCount
        isCancelledCount
        isNewCount
        isSoldOutCount
        isUpdatedCount
        totalCount
      }
    }
  `;

  try {
    const res = await fetchGraphQLData(query);
    const data = res.data.optionCounts;

    return { 
        data 
    };
  } catch (error) {
    console.error('Error loading GraphQL data:', error);
    throw error;
  }
}
