/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query optionsByDivisionCode($divisionCode: String!) {\n    optionsByDivisionCode(divisionCode: $divisionCode) {\n      description\n      images\n      isAvailable\n      isNew\n      isUpdated\n      isSoldOut\n    }\n  }\n  ": types.OptionsByDivisionCodeDocument,
    "\nquery GetOptions {\n  options {\n    description\n    images\n    isAvailable\n    isNew\n    isUpdated\n    isSoldOut\n  }\n}\n": types.GetOptionsDocument,
    "\nquery GetOptionsPage($from: Int!, $limit: Int!) {\n  optionsPage(from: $from, limit: $limit) {\n    description\n    images\n    isAvailable\n    isNew\n    isUpdated\n    isSoldOut\n  }\n}\n": types.GetOptionsPageDocument,
    "\nquery optionsByDivisionCodeAndSalesChannel ($divisionCode: String!, $salesChannels: [String!]) {\n  optionsByDivisionCodeAndSalesChannel (divisionCode: $divisionCode, salesChannels: $salesChannels ) {\n    activeOption\n    brand\n    brandCode\n    certificationStyles\n    collection\n    collectionStructure\n    color\n    colorDescription1\n    colorDescription2\n    copiedFromOption\n    countryOfOrigin\n    ctpMonth\n    description\n    dimensions {\n      heelHeight\n      height\n      length\n      shaftHeight\n      width\n    }\n    divisionCode\n    fabric\n    fashionability\n    fashionabilityCode\n    fmsCollectionCode\n    fmsMainSeasonCode\n    hasSustainableMaterials\n    hexCode\n    images\n    innovation\n    internalStyleName\n    internal_id\n    isAvailable\n    isCancelled\n    isClosed\n    isInvalid\n    isLicensed\n    isNew\n    isSoldOut\n    isUpdated\n    keyLook\n    label\n    llo\n    mainSeason\n    merchandisingHierarchy {\n      business\n      category\n      code\n      gender\n      lifestyle\n      productgroup\n      productsubgroup\n      world\n    }\n    openForEcom\n    optionCode\n    optionType\n    originatingProductLine\n    originatingProductLineCode\n    packingType\n    pimDeliveryDates {\n      additionalDeliveryDate\n      adjustedDeliveryDate\n      dropDate\n      modifiedOn\n    }\n    pimOptionKeyNo\n    pimProductKeyNo\n    priceBySize\n    productStory\n    program\n    referenceOptionNumber\n    referenceStyleNumber\n    salesChannels\n    salesOrganizationCode\n    seasonYear\n    shape\n    sizeCode\n    sizeRange\n    sizeRangeOption\n    sleeveLength\n    styleDescription\n    styleDescriptions\n    styleNumber\n    styleSeasonCode\n    sustainableAttribute\n    sustainableFiber\n    sustainableFibers\n    swatchBookNumber\n    theme {\n      name\n    }\n    wash\n    inseams {\n      sizes {\n        name\n        index\n        pimVariantKeyNo\n        EAN\n        sapVariant\n        status {\n          isAvailable\n          isCancelled\n          code\n          isClosed\n          isSoldOut\n          description\n          isInvalid\n        }\n      }\n    }\n  }\n}\n": types.OptionsByDivisionCodeAndSalesChannelDocument,
    "\nquery optionCounts ($divisionCode: String!, $salesChannels: [String!]) {\n  optionCounts (divisionCode: $divisionCode, salesChannels: $salesChannels ) {\n    isAvailableCount\n    isCancelledCount\n    isNewCount\n    isSoldOutCount\n    isUpdatedCount\n    totalCount\n  }\n}\n": types.OptionCountsDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query optionsByDivisionCode($divisionCode: String!) {\n    optionsByDivisionCode(divisionCode: $divisionCode) {\n      description\n      images\n      isAvailable\n      isNew\n      isUpdated\n      isSoldOut\n    }\n  }\n  "): (typeof documents)["\n  query optionsByDivisionCode($divisionCode: String!) {\n    optionsByDivisionCode(divisionCode: $divisionCode) {\n      description\n      images\n      isAvailable\n      isNew\n      isUpdated\n      isSoldOut\n    }\n  }\n  "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery GetOptions {\n  options {\n    description\n    images\n    isAvailable\n    isNew\n    isUpdated\n    isSoldOut\n  }\n}\n"): (typeof documents)["\nquery GetOptions {\n  options {\n    description\n    images\n    isAvailable\n    isNew\n    isUpdated\n    isSoldOut\n  }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery GetOptionsPage($from: Int!, $limit: Int!) {\n  optionsPage(from: $from, limit: $limit) {\n    description\n    images\n    isAvailable\n    isNew\n    isUpdated\n    isSoldOut\n  }\n}\n"): (typeof documents)["\nquery GetOptionsPage($from: Int!, $limit: Int!) {\n  optionsPage(from: $from, limit: $limit) {\n    description\n    images\n    isAvailable\n    isNew\n    isUpdated\n    isSoldOut\n  }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery optionsByDivisionCodeAndSalesChannel ($divisionCode: String!, $salesChannels: [String!]) {\n  optionsByDivisionCodeAndSalesChannel (divisionCode: $divisionCode, salesChannels: $salesChannels ) {\n    activeOption\n    brand\n    brandCode\n    certificationStyles\n    collection\n    collectionStructure\n    color\n    colorDescription1\n    colorDescription2\n    copiedFromOption\n    countryOfOrigin\n    ctpMonth\n    description\n    dimensions {\n      heelHeight\n      height\n      length\n      shaftHeight\n      width\n    }\n    divisionCode\n    fabric\n    fashionability\n    fashionabilityCode\n    fmsCollectionCode\n    fmsMainSeasonCode\n    hasSustainableMaterials\n    hexCode\n    images\n    innovation\n    internalStyleName\n    internal_id\n    isAvailable\n    isCancelled\n    isClosed\n    isInvalid\n    isLicensed\n    isNew\n    isSoldOut\n    isUpdated\n    keyLook\n    label\n    llo\n    mainSeason\n    merchandisingHierarchy {\n      business\n      category\n      code\n      gender\n      lifestyle\n      productgroup\n      productsubgroup\n      world\n    }\n    openForEcom\n    optionCode\n    optionType\n    originatingProductLine\n    originatingProductLineCode\n    packingType\n    pimDeliveryDates {\n      additionalDeliveryDate\n      adjustedDeliveryDate\n      dropDate\n      modifiedOn\n    }\n    pimOptionKeyNo\n    pimProductKeyNo\n    priceBySize\n    productStory\n    program\n    referenceOptionNumber\n    referenceStyleNumber\n    salesChannels\n    salesOrganizationCode\n    seasonYear\n    shape\n    sizeCode\n    sizeRange\n    sizeRangeOption\n    sleeveLength\n    styleDescription\n    styleDescriptions\n    styleNumber\n    styleSeasonCode\n    sustainableAttribute\n    sustainableFiber\n    sustainableFibers\n    swatchBookNumber\n    theme {\n      name\n    }\n    wash\n    inseams {\n      sizes {\n        name\n        index\n        pimVariantKeyNo\n        EAN\n        sapVariant\n        status {\n          isAvailable\n          isCancelled\n          code\n          isClosed\n          isSoldOut\n          description\n          isInvalid\n        }\n      }\n    }\n  }\n}\n"): (typeof documents)["\nquery optionsByDivisionCodeAndSalesChannel ($divisionCode: String!, $salesChannels: [String!]) {\n  optionsByDivisionCodeAndSalesChannel (divisionCode: $divisionCode, salesChannels: $salesChannels ) {\n    activeOption\n    brand\n    brandCode\n    certificationStyles\n    collection\n    collectionStructure\n    color\n    colorDescription1\n    colorDescription2\n    copiedFromOption\n    countryOfOrigin\n    ctpMonth\n    description\n    dimensions {\n      heelHeight\n      height\n      length\n      shaftHeight\n      width\n    }\n    divisionCode\n    fabric\n    fashionability\n    fashionabilityCode\n    fmsCollectionCode\n    fmsMainSeasonCode\n    hasSustainableMaterials\n    hexCode\n    images\n    innovation\n    internalStyleName\n    internal_id\n    isAvailable\n    isCancelled\n    isClosed\n    isInvalid\n    isLicensed\n    isNew\n    isSoldOut\n    isUpdated\n    keyLook\n    label\n    llo\n    mainSeason\n    merchandisingHierarchy {\n      business\n      category\n      code\n      gender\n      lifestyle\n      productgroup\n      productsubgroup\n      world\n    }\n    openForEcom\n    optionCode\n    optionType\n    originatingProductLine\n    originatingProductLineCode\n    packingType\n    pimDeliveryDates {\n      additionalDeliveryDate\n      adjustedDeliveryDate\n      dropDate\n      modifiedOn\n    }\n    pimOptionKeyNo\n    pimProductKeyNo\n    priceBySize\n    productStory\n    program\n    referenceOptionNumber\n    referenceStyleNumber\n    salesChannels\n    salesOrganizationCode\n    seasonYear\n    shape\n    sizeCode\n    sizeRange\n    sizeRangeOption\n    sleeveLength\n    styleDescription\n    styleDescriptions\n    styleNumber\n    styleSeasonCode\n    sustainableAttribute\n    sustainableFiber\n    sustainableFibers\n    swatchBookNumber\n    theme {\n      name\n    }\n    wash\n    inseams {\n      sizes {\n        name\n        index\n        pimVariantKeyNo\n        EAN\n        sapVariant\n        status {\n          isAvailable\n          isCancelled\n          code\n          isClosed\n          isSoldOut\n          description\n          isInvalid\n        }\n      }\n    }\n  }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery optionCounts ($divisionCode: String!, $salesChannels: [String!]) {\n  optionCounts (divisionCode: $divisionCode, salesChannels: $salesChannels ) {\n    isAvailableCount\n    isCancelledCount\n    isNewCount\n    isSoldOutCount\n    isUpdatedCount\n    totalCount\n  }\n}\n"): (typeof documents)["\nquery optionCounts ($divisionCode: String!, $salesChannels: [String!]) {\n  optionCounts (divisionCode: $divisionCode, salesChannels: $salesChannels ) {\n    isAvailableCount\n    isCancelledCount\n    isNewCount\n    isSoldOutCount\n    isUpdatedCount\n    totalCount\n  }\n}\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;