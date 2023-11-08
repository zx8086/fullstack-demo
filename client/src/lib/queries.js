import { gql } from 'graphql-tag';

export const GET_DIVISIONAL_DATA = gql`
  query GetDivisionalData($id: ID!) {
    division(id: $id) {
      id
      name
    }
  }
`;
