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

export const GET_OPTIONS_BY_DIVISION_CODE_AND_SALES_CHANNEL = gql`
query optionsByDivisionCodeAndSalesChannel ($divisionCode: String!, $salesChannels: [String!]) {
  optionsByDivisionCodeAndSalesChannel (divisionCode: $divisionCode, salesChannels: $salesChannels ) {
    activeOption
    brand
    brandCode
    certificationStyles
    collection
    collectionStructure
    color
    colorDescription1
    colorDescription2
    copiedFromOption
    countryOfOrigin
    ctpMonth
    description
    dimensions {
      heelHeight
      height
      length
      shaftHeight
      width
    }
    divisionCode
    fabric
    fashionability
    fashionabilityCode
    fmsCollectionCode
    fmsMainSeasonCode
    hasSustainableMaterials
    hexCode
    images
    innovation
    internalStyleName
    internal_id
    isAvailable
    isCancelled
    isClosed
    isInvalid
    isLicensed
    isNew
    isSoldOut
    isUpdated
    keyLook
    label
    llo
    mainSeason
    merchandisingHierarchy {
      business
      category
      code
      gender
      lifestyle
      productgroup
      productsubgroup
      world
    }
    openForEcom
    optionCode
    optionType
    originatingProductLine
    originatingProductLineCode
    packingType
    pimDeliveryDates {
      additionalDeliveryDate
      adjustedDeliveryDate
      dropDate
      modifiedOn
    }
    pimOptionKeyNo
    pimProductKeyNo
    priceBySize
    productStory
    program
    referenceOptionNumber
    referenceStyleNumber
    salesChannels
    salesOrganizationCode
    seasonYear
    shape
    sizeCode
    sizeRange
    sizeRangeOption
    sleeveLength
    styleDescription
    styleDescriptions
    styleNumber
    styleSeasonCode
    sustainableAttribute
    sustainableFiber
    sustainableFibers
    swatchBookNumber
    theme {
      name
    }
    wash
    inseams {
      sizes {
        name
        index
        pimVariantKeyNo
        EAN
        sapVariant
        status {
          isAvailable
          isCancelled
          code
          isClosed
          isSoldOut
          description
          isInvalid
        }
      }
    }
  }
}
`;

export const GET_TOTALS_BY_DIVISION_CODE_AND_SALES_CHANNEL = gql`
query optionCounts ($divisionCode: String!, $salesChannels: [String!]) {
  optionCounts (divisionCode: $divisionCode, salesChannels: $salesChannels ) {
    isAvailableCount
    isCancelledCount
    isNewCount
    isSoldOutCount
    isUpdatedCount
    totalCount
  }
}
`;