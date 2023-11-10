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

export const GET_OPTIONS = gql`
query GetOptions($first: Int!, $skip: Int!) {
  options(first: $first, skip: $skip) {
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

export const GET_OPTIONS_LIMIT = gql`
query GetOptionsPage($from: Int!, $limit: Int!) {
  optionsPage(from: $from, limit: $limit) {
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

export const GET_TOTAL_COUNT = gql`
query GetTotalCount {
  _allOptionsMeta {
    count
  }
}
`;