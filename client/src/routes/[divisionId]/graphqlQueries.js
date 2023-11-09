import { gql } from "@apollo/client/core";

// Existing query
export const GET_OPTIONS = gql`
  query GetOptions {
    options {
      id
      description
      images
      isAvailable
      isNew
      isUpdated
      isSoldOut
    }
  }
`;

// // New query
// export const GET_OPTIONS_BY_DIVISION_CODE = gql`
//   query GetOptionsByDivisionCode($divisionCode: String!) {
//     options(filter: { divisionCode: $divisionCode }) {
//       id
//       description
//       images
//       isAvailable
//       isNew
//       isUpdated
//       isSoldOut
//     }
//   }
// `;
