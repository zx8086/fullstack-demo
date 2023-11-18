/** @type {import('./$types').PageLoad} */

import { fetchGraphQLData } from './../../utils/api/fetchGraphQLData'

export async function load({ params }) {
  const divisionCode = params.divisionCode;
  const salesChannels = ['SELLIN'];

  const optionCountsQuery = `
    query getOptionCounts {
      optionCounts(divisionCode: "${divisionCode}", salesChannels: ${JSON.stringify(salesChannels)}) {
        isAvailableCount
        isUpdatedCount
        isCancelledCount
        isNewCount
        isSoldOutCount
        totalCount
      }
    }
  `;

  const lookCountsQuery = `
    query getLookCounts {
      lookCounts(divisionCode: "${divisionCode}") {
        totalCount
        incompleteCount
      }
    }
  `;

  try {
    // Execute both queries in parallel
    const [optionCountsRes, lookCountsRes] = await Promise.all([
      fetchGraphQLData(optionCountsQuery),
      fetchGraphQLData(lookCountsQuery),
    ]);

    const optionCountsData = optionCountsRes.data.optionCounts;
    const lookCountsData = lookCountsRes.data.lookCounts;

    console.log(`Division Options Count:- ${divisionCode}`, optionCountsData);
    console.log(`Division Looks Count :- ${divisionCode}`, lookCountsData);

    return {
      data: {
        optionCountsData,
        lookCountsData,
      },
    };
  } catch (error) {
    console.error('Error loading GraphQL data:', error);
    throw error;
  }
}
