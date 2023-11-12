import { Client, gql } from '@urql/svelte';

const client = new Client({
  url: 'http://localhost:8080/graphql',
  // Add other client configurations as needed
});

const GET_OPTIONS_BY_DIVISION_CODE = gql`
  query GetOptionsByDivisionCode($divisionCode: String!) {
    optionsByDivisionCode(divisionCode: $divisionCode) {
      id
      // Add other fields you need
    }
  }
`;

export async function queryStore(selectedDivision) {
  try {
    const response = await client.query(GET_OPTIONS_BY_DIVISION_CODE, {
      divisionCode: selectedDivision,
    });

    return response;
  } catch (error) {
    console.error('GraphQL query error:', error);
    return { error };
  }
}
