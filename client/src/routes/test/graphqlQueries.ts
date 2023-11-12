import { gql } from "@apollo/client/core";

export const GET_TODOS = gql`
query {
    todos{
      id
      title
    }
  }
`;

export const GET_OPTIONS_BY_DIVISION_CODE = gql`
  query optionsByDivisionCode($divisionCode: String!) {
    optionsByDivisionCode(divisionCode: $divisionCode) {
      description
      images
      isAvailable
      isNew
      isUpdated
      isSoldOut
    }
  }
  `;

export const GET_OPTIONS = gql`
query GetOptions {
  options {
    description
    images
    isAvailable
    isNew
    isUpdated
    isSoldOut
  }
}
`;

export const GET_OPTIONS_LIMIT = gql`
query GetOptionsPage($from: Int!, $limit: Int!) {
  optionsPage(from: $from, limit: $limit) {
    description
    images
    isAvailable
    isNew
    isUpdated
    isSoldOut
  }
}
`;
