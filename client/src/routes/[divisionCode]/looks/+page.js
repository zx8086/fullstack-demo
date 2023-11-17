/** @type {import('./$types').PageLoad} */

import { fetchGraphQLData } from '../../../utils/api/fetchGraphQLData'

export async function load({ params }) {
  const divisionCode = params.divisionCode;
//   const salesChannels = ['SELLIN'];

  const query = `
    query looksByDivisionCode {
        looksByDivisionCode(divisionCode: "${divisionCode}") {
            assetUrl
            brand
            deliveryName
            description
            divisionCode
            isDeleted
            lookId
            nuxeoId
            relatedStyles
            styleSeasonCodeAfs
            tag
            title
            trend
      }
    }
  `;

  try {
    const res = await fetchGraphQLData(query);

    const data = res.data.looksByDivisionCode;
    console.log(`Looks by Division:- ${divisionCode}`,data);
    return { data };
    } catch (error) {
    console.error('Error loading GraphQL data:', error);
    throw error;
  }
}
