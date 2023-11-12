/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Dimensions = {
  __typename?: 'Dimensions';
  heelHeight?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  length?: Maybe<Scalars['Float']['output']>;
  shaftHeight?: Maybe<Scalars['Float']['output']>;
  width?: Maybe<Scalars['Float']['output']>;
};

export type Inseam = {
  __typename?: 'Inseam';
  index?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  sizes?: Maybe<Array<Maybe<Size>>>;
};

export type MerchandisingHierarchy = {
  __typename?: 'MerchandisingHierarchy';
  business?: Maybe<Scalars['String']['output']>;
  category?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Scalars['String']['output']>;
  lifestyle?: Maybe<Scalars['String']['output']>;
  productgroup?: Maybe<Scalars['String']['output']>;
  productsubgroup?: Maybe<Scalars['String']['output']>;
  world?: Maybe<Scalars['String']['output']>;
};

export type Option = {
  __typename?: 'Option';
  activeOption?: Maybe<Scalars['Boolean']['output']>;
  brand?: Maybe<Scalars['String']['output']>;
  brandCode?: Maybe<Scalars['String']['output']>;
  certificationStyles?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  channels?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  closure?: Maybe<Scalars['String']['output']>;
  collar?: Maybe<Scalars['String']['output']>;
  collection?: Maybe<Scalars['String']['output']>;
  collectionStructure?: Maybe<Scalars['String']['output']>;
  color?: Maybe<Scalars['String']['output']>;
  colorDescription1?: Maybe<Scalars['String']['output']>;
  colorDescription2?: Maybe<Scalars['String']['output']>;
  consumerAssortment?: Maybe<Scalars['String']['output']>;
  consumerAssortmentCode?: Maybe<Scalars['String']['output']>;
  copiedFromOption?: Maybe<Scalars['String']['output']>;
  countryOfOrigin?: Maybe<Scalars['String']['output']>;
  ctpMonth?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  dimensions?: Maybe<Dimensions>;
  distribution?: Maybe<Scalars['String']['output']>;
  divisionCode?: Maybe<Scalars['String']['output']>;
  documentType?: Maybe<Scalars['String']['output']>;
  effectiveHeelHeightCM?: Maybe<Scalars['Float']['output']>;
  fabric?: Maybe<Scalars['String']['output']>;
  fashionability?: Maybe<Scalars['String']['output']>;
  fashionabilityCode?: Maybe<Scalars['String']['output']>;
  fit?: Maybe<Scalars['String']['output']>;
  fitForBottoms?: Maybe<Scalars['String']['output']>;
  fitForTops?: Maybe<Scalars['String']['output']>;
  fmsCollectionCode?: Maybe<Scalars['String']['output']>;
  fmsMainSeasonCode?: Maybe<Scalars['String']['output']>;
  garmentLength?: Maybe<Scalars['String']['output']>;
  hasSustainableMaterials?: Maybe<Scalars['Boolean']['output']>;
  hexCode?: Maybe<Scalars['String']['output']>;
  images?: Maybe<Scalars['String']['output']>;
  innovation?: Maybe<Scalars['Boolean']['output']>;
  innovationAttributes?: Maybe<Scalars['String']['output']>;
  inseams?: Maybe<Inseam>;
  insockComposition?: Maybe<Scalars['String']['output']>;
  internalStyleName?: Maybe<Scalars['String']['output']>;
  internal_id?: Maybe<Scalars['String']['output']>;
  isAvailable?: Maybe<Scalars['Boolean']['output']>;
  isCancelled?: Maybe<Scalars['Boolean']['output']>;
  isClosed?: Maybe<Scalars['Boolean']['output']>;
  isInvalid?: Maybe<Scalars['Boolean']['output']>;
  isLicensed?: Maybe<Scalars['Boolean']['output']>;
  isNew?: Maybe<Scalars['Boolean']['output']>;
  isSoldOut?: Maybe<Scalars['Boolean']['output']>;
  isUpdated?: Maybe<Scalars['Boolean']['output']>;
  keyLook?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  liningComposition?: Maybe<Scalars['String']['output']>;
  llo?: Maybe<Scalars['Int']['output']>;
  mainSeason?: Maybe<Scalars['String']['output']>;
  merchandisingHierarchy?: Maybe<MerchandisingHierarchy>;
  neckline?: Maybe<Scalars['String']['output']>;
  openForEcom?: Maybe<Scalars['Boolean']['output']>;
  optionCode?: Maybe<Scalars['String']['output']>;
  optionType?: Maybe<Scalars['String']['output']>;
  originatingProductLine?: Maybe<Scalars['String']['output']>;
  originatingProductLineCode?: Maybe<Scalars['String']['output']>;
  packingType?: Maybe<Scalars['String']['output']>;
  paddingComposition?: Maybe<Scalars['String']['output']>;
  pimDeliveryDates?: Maybe<PimDeliveryDates>;
  pimOptionKeyNo?: Maybe<Scalars['String']['output']>;
  pimProductKeyNo?: Maybe<Scalars['String']['output']>;
  plannedWashOption?: Maybe<Scalars['String']['output']>;
  platformHeightCM?: Maybe<Scalars['Float']['output']>;
  prepackSizeOffer?: Maybe<Scalars['String']['output']>;
  priceBySize?: Maybe<Scalars['Boolean']['output']>;
  productStory?: Maybe<Scalars['String']['output']>;
  program?: Maybe<Scalars['String']['output']>;
  referenceOptionNumber?: Maybe<Scalars['String']['output']>;
  referenceStyleNumber?: Maybe<Scalars['String']['output']>;
  rise?: Maybe<Scalars['String']['output']>;
  salesChannels?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  salesComments?: Maybe<Scalars['String']['output']>;
  salesOrganizationCode?: Maybe<Scalars['String']['output']>;
  seasonYear?: Maybe<Scalars['String']['output']>;
  shape?: Maybe<Scalars['String']['output']>;
  shoeOutsoleComposition?: Maybe<Scalars['String']['output']>;
  sizeCode?: Maybe<Scalars['String']['output']>;
  sizeRange?: Maybe<Scalars['String']['output']>;
  sizeRangeOption?: Maybe<Scalars['String']['output']>;
  sleeveLength?: Maybe<Scalars['String']['output']>;
  styleDescription?: Maybe<Scalars['String']['output']>;
  styleDescriptions?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  styleNumber?: Maybe<Scalars['String']['output']>;
  styleSeasonCode?: Maybe<Scalars['String']['output']>;
  sustainableAttribute?: Maybe<Scalars['String']['output']>;
  sustainableFiber?: Maybe<Scalars['String']['output']>;
  sustainableFibers?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  swatchBookNumber?: Maybe<Scalars['String']['output']>;
  theme?: Maybe<Theme>;
  upperComposition?: Maybe<Scalars['String']['output']>;
  wash?: Maybe<Scalars['String']['output']>;
};

export type OptionCounts = {
  __typename?: 'OptionCounts';
  isAvailableCount?: Maybe<Scalars['Int']['output']>;
  isCancelledCount?: Maybe<Scalars['Int']['output']>;
  isNewCount?: Maybe<Scalars['Int']['output']>;
  isSoldOutCount?: Maybe<Scalars['Int']['output']>;
  isUpdatedCount?: Maybe<Scalars['Int']['output']>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type PimDeliveryDates = {
  __typename?: 'PimDeliveryDates';
  additionalDeliveryDate?: Maybe<Scalars['String']['output']>;
  adjustedDeliveryDate?: Maybe<Scalars['String']['output']>;
  dropDate?: Maybe<Scalars['Float']['output']>;
  modifiedOn?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  optionCounts?: Maybe<OptionCounts>;
  options?: Maybe<Array<Maybe<Option>>>;
  optionsByDivisionAndChannels?: Maybe<Array<Maybe<Option>>>;
  optionsByDivisionCode?: Maybe<Array<Maybe<Option>>>;
  optionsByDivisionCodeAndSalesChannel?: Maybe<Array<Maybe<Option>>>;
  optionsPage?: Maybe<Array<Maybe<Option>>>;
  todos: Array<Todo>;
  todosPage: Array<Todo>;
};


export type QueryOptionCountsArgs = {
  divisionCode: Scalars['String']['input'];
  salesChannels?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryOptionsByDivisionAndChannelsArgs = {
  divisionCode: Scalars['String']['input'];
  salesChannels?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryOptionsByDivisionCodeArgs = {
  divisionCode: Scalars['String']['input'];
};


export type QueryOptionsByDivisionCodeAndSalesChannelArgs = {
  divisionCode: Scalars['String']['input'];
  salesChannels?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryOptionsPageArgs = {
  from: Scalars['Int']['input'];
  limit: Scalars['Int']['input'];
};


export type QueryTodosPageArgs = {
  from: Scalars['Int']['input'];
  limit: Scalars['Int']['input'];
};

export type Size = {
  __typename?: 'Size';
  EAN?: Maybe<Scalars['String']['output']>;
  index?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  pimVariantKeyNo?: Maybe<Scalars['String']['output']>;
  sapVariant?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Status>;
};

export type Status = {
  __typename?: 'Status';
  code?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  isAvailable?: Maybe<Scalars['Boolean']['output']>;
  isCancelled?: Maybe<Scalars['Boolean']['output']>;
  isClosed?: Maybe<Scalars['Boolean']['output']>;
  isInvalid?: Maybe<Scalars['Boolean']['output']>;
  isSoldOut?: Maybe<Scalars['Boolean']['output']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  countdown: Scalars['Int']['output'];
};


export type SubscriptionCountdownArgs = {
  from: Scalars['Int']['input'];
};

export type Theme = {
  __typename?: 'Theme';
  name?: Maybe<Scalars['String']['output']>;
};

export type Todo = {
  __typename?: 'Todo';
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
};

export type OptionsByDivisionCodeQueryVariables = Exact<{
  divisionCode: Scalars['String']['input'];
}>;


export type OptionsByDivisionCodeQuery = { __typename?: 'Query', optionsByDivisionCode?: Array<{ __typename?: 'Option', description?: string | null, images?: string | null, isAvailable?: boolean | null, isNew?: boolean | null, isUpdated?: boolean | null, isSoldOut?: boolean | null } | null> | null };

export type GetOptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOptionsQuery = { __typename?: 'Query', options?: Array<{ __typename?: 'Option', description?: string | null, images?: string | null, isAvailable?: boolean | null, isNew?: boolean | null, isUpdated?: boolean | null, isSoldOut?: boolean | null } | null> | null };

export type GetOptionsPageQueryVariables = Exact<{
  from: Scalars['Int']['input'];
  limit: Scalars['Int']['input'];
}>;


export type GetOptionsPageQuery = { __typename?: 'Query', optionsPage?: Array<{ __typename?: 'Option', description?: string | null, images?: string | null, isAvailable?: boolean | null, isNew?: boolean | null, isUpdated?: boolean | null, isSoldOut?: boolean | null } | null> | null };

export type OptionsByDivisionCodeAndSalesChannelQueryVariables = Exact<{
  divisionCode: Scalars['String']['input'];
  salesChannels?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type OptionsByDivisionCodeAndSalesChannelQuery = { __typename?: 'Query', optionsByDivisionCodeAndSalesChannel?: Array<{ __typename?: 'Option', activeOption?: boolean | null, brand?: string | null, brandCode?: string | null, certificationStyles?: Array<string | null> | null, collection?: string | null, collectionStructure?: string | null, color?: string | null, colorDescription1?: string | null, colorDescription2?: string | null, copiedFromOption?: string | null, countryOfOrigin?: string | null, ctpMonth?: string | null, description?: string | null, divisionCode?: string | null, fabric?: string | null, fashionability?: string | null, fashionabilityCode?: string | null, fmsCollectionCode?: string | null, fmsMainSeasonCode?: string | null, hasSustainableMaterials?: boolean | null, hexCode?: string | null, images?: string | null, innovation?: boolean | null, internalStyleName?: string | null, internal_id?: string | null, isAvailable?: boolean | null, isCancelled?: boolean | null, isClosed?: boolean | null, isInvalid?: boolean | null, isLicensed?: boolean | null, isNew?: boolean | null, isSoldOut?: boolean | null, isUpdated?: boolean | null, keyLook?: string | null, label?: string | null, llo?: number | null, mainSeason?: string | null, openForEcom?: boolean | null, optionCode?: string | null, optionType?: string | null, originatingProductLine?: string | null, originatingProductLineCode?: string | null, packingType?: string | null, pimOptionKeyNo?: string | null, pimProductKeyNo?: string | null, priceBySize?: boolean | null, productStory?: string | null, program?: string | null, referenceOptionNumber?: string | null, referenceStyleNumber?: string | null, salesChannels?: Array<string | null> | null, salesOrganizationCode?: string | null, seasonYear?: string | null, shape?: string | null, sizeCode?: string | null, sizeRange?: string | null, sizeRangeOption?: string | null, sleeveLength?: string | null, styleDescription?: string | null, styleDescriptions?: Array<string | null> | null, styleNumber?: string | null, styleSeasonCode?: string | null, sustainableAttribute?: string | null, sustainableFiber?: string | null, sustainableFibers?: Array<string | null> | null, swatchBookNumber?: string | null, wash?: string | null, dimensions?: { __typename?: 'Dimensions', heelHeight?: number | null, height?: number | null, length?: number | null, shaftHeight?: number | null, width?: number | null } | null, merchandisingHierarchy?: { __typename?: 'MerchandisingHierarchy', business?: string | null, category?: string | null, code?: string | null, gender?: string | null, lifestyle?: string | null, productgroup?: string | null, productsubgroup?: string | null, world?: string | null } | null, pimDeliveryDates?: { __typename?: 'PimDeliveryDates', additionalDeliveryDate?: string | null, adjustedDeliveryDate?: string | null, dropDate?: number | null, modifiedOn?: string | null } | null, theme?: { __typename?: 'Theme', name?: string | null } | null, inseams?: { __typename?: 'Inseam', sizes?: Array<{ __typename?: 'Size', name?: string | null, index?: number | null, pimVariantKeyNo?: string | null, EAN?: string | null, sapVariant?: string | null, status?: { __typename?: 'Status', isAvailable?: boolean | null, isCancelled?: boolean | null, code?: string | null, isClosed?: boolean | null, isSoldOut?: boolean | null, description?: string | null, isInvalid?: boolean | null } | null } | null> | null } | null } | null> | null };

export type OptionCountsQueryVariables = Exact<{
  divisionCode: Scalars['String']['input'];
  salesChannels?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type OptionCountsQuery = { __typename?: 'Query', optionCounts?: { __typename?: 'OptionCounts', isAvailableCount?: number | null, isCancelledCount?: number | null, isNewCount?: number | null, isSoldOutCount?: number | null, isUpdatedCount?: number | null, totalCount?: number | null } | null };


export const OptionsByDivisionCodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"optionsByDivisionCode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"divisionCode"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"optionsByDivisionCode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"divisionCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"divisionCode"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"isAvailable"}},{"kind":"Field","name":{"kind":"Name","value":"isNew"}},{"kind":"Field","name":{"kind":"Name","value":"isUpdated"}},{"kind":"Field","name":{"kind":"Name","value":"isSoldOut"}}]}}]}}]} as unknown as DocumentNode<OptionsByDivisionCodeQuery, OptionsByDivisionCodeQueryVariables>;
export const GetOptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"isAvailable"}},{"kind":"Field","name":{"kind":"Name","value":"isNew"}},{"kind":"Field","name":{"kind":"Name","value":"isUpdated"}},{"kind":"Field","name":{"kind":"Name","value":"isSoldOut"}}]}}]}}]} as unknown as DocumentNode<GetOptionsQuery, GetOptionsQueryVariables>;
export const GetOptionsPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOptionsPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"optionsPage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"isAvailable"}},{"kind":"Field","name":{"kind":"Name","value":"isNew"}},{"kind":"Field","name":{"kind":"Name","value":"isUpdated"}},{"kind":"Field","name":{"kind":"Name","value":"isSoldOut"}}]}}]}}]} as unknown as DocumentNode<GetOptionsPageQuery, GetOptionsPageQueryVariables>;
export const OptionsByDivisionCodeAndSalesChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"optionsByDivisionCodeAndSalesChannel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"divisionCode"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"salesChannels"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"optionsByDivisionCodeAndSalesChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"divisionCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"divisionCode"}}},{"kind":"Argument","name":{"kind":"Name","value":"salesChannels"},"value":{"kind":"Variable","name":{"kind":"Name","value":"salesChannels"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activeOption"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"brandCode"}},{"kind":"Field","name":{"kind":"Name","value":"certificationStyles"}},{"kind":"Field","name":{"kind":"Name","value":"collection"}},{"kind":"Field","name":{"kind":"Name","value":"collectionStructure"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"colorDescription1"}},{"kind":"Field","name":{"kind":"Name","value":"colorDescription2"}},{"kind":"Field","name":{"kind":"Name","value":"copiedFromOption"}},{"kind":"Field","name":{"kind":"Name","value":"countryOfOrigin"}},{"kind":"Field","name":{"kind":"Name","value":"ctpMonth"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"dimensions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"heelHeight"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"length"}},{"kind":"Field","name":{"kind":"Name","value":"shaftHeight"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"divisionCode"}},{"kind":"Field","name":{"kind":"Name","value":"fabric"}},{"kind":"Field","name":{"kind":"Name","value":"fashionability"}},{"kind":"Field","name":{"kind":"Name","value":"fashionabilityCode"}},{"kind":"Field","name":{"kind":"Name","value":"fmsCollectionCode"}},{"kind":"Field","name":{"kind":"Name","value":"fmsMainSeasonCode"}},{"kind":"Field","name":{"kind":"Name","value":"hasSustainableMaterials"}},{"kind":"Field","name":{"kind":"Name","value":"hexCode"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"innovation"}},{"kind":"Field","name":{"kind":"Name","value":"internalStyleName"}},{"kind":"Field","name":{"kind":"Name","value":"internal_id"}},{"kind":"Field","name":{"kind":"Name","value":"isAvailable"}},{"kind":"Field","name":{"kind":"Name","value":"isCancelled"}},{"kind":"Field","name":{"kind":"Name","value":"isClosed"}},{"kind":"Field","name":{"kind":"Name","value":"isInvalid"}},{"kind":"Field","name":{"kind":"Name","value":"isLicensed"}},{"kind":"Field","name":{"kind":"Name","value":"isNew"}},{"kind":"Field","name":{"kind":"Name","value":"isSoldOut"}},{"kind":"Field","name":{"kind":"Name","value":"isUpdated"}},{"kind":"Field","name":{"kind":"Name","value":"keyLook"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"llo"}},{"kind":"Field","name":{"kind":"Name","value":"mainSeason"}},{"kind":"Field","name":{"kind":"Name","value":"merchandisingHierarchy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"business"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"lifestyle"}},{"kind":"Field","name":{"kind":"Name","value":"productgroup"}},{"kind":"Field","name":{"kind":"Name","value":"productsubgroup"}},{"kind":"Field","name":{"kind":"Name","value":"world"}}]}},{"kind":"Field","name":{"kind":"Name","value":"openForEcom"}},{"kind":"Field","name":{"kind":"Name","value":"optionCode"}},{"kind":"Field","name":{"kind":"Name","value":"optionType"}},{"kind":"Field","name":{"kind":"Name","value":"originatingProductLine"}},{"kind":"Field","name":{"kind":"Name","value":"originatingProductLineCode"}},{"kind":"Field","name":{"kind":"Name","value":"packingType"}},{"kind":"Field","name":{"kind":"Name","value":"pimDeliveryDates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"additionalDeliveryDate"}},{"kind":"Field","name":{"kind":"Name","value":"adjustedDeliveryDate"}},{"kind":"Field","name":{"kind":"Name","value":"dropDate"}},{"kind":"Field","name":{"kind":"Name","value":"modifiedOn"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pimOptionKeyNo"}},{"kind":"Field","name":{"kind":"Name","value":"pimProductKeyNo"}},{"kind":"Field","name":{"kind":"Name","value":"priceBySize"}},{"kind":"Field","name":{"kind":"Name","value":"productStory"}},{"kind":"Field","name":{"kind":"Name","value":"program"}},{"kind":"Field","name":{"kind":"Name","value":"referenceOptionNumber"}},{"kind":"Field","name":{"kind":"Name","value":"referenceStyleNumber"}},{"kind":"Field","name":{"kind":"Name","value":"salesChannels"}},{"kind":"Field","name":{"kind":"Name","value":"salesOrganizationCode"}},{"kind":"Field","name":{"kind":"Name","value":"seasonYear"}},{"kind":"Field","name":{"kind":"Name","value":"shape"}},{"kind":"Field","name":{"kind":"Name","value":"sizeCode"}},{"kind":"Field","name":{"kind":"Name","value":"sizeRange"}},{"kind":"Field","name":{"kind":"Name","value":"sizeRangeOption"}},{"kind":"Field","name":{"kind":"Name","value":"sleeveLength"}},{"kind":"Field","name":{"kind":"Name","value":"styleDescription"}},{"kind":"Field","name":{"kind":"Name","value":"styleDescriptions"}},{"kind":"Field","name":{"kind":"Name","value":"styleNumber"}},{"kind":"Field","name":{"kind":"Name","value":"styleSeasonCode"}},{"kind":"Field","name":{"kind":"Name","value":"sustainableAttribute"}},{"kind":"Field","name":{"kind":"Name","value":"sustainableFiber"}},{"kind":"Field","name":{"kind":"Name","value":"sustainableFibers"}},{"kind":"Field","name":{"kind":"Name","value":"swatchBookNumber"}},{"kind":"Field","name":{"kind":"Name","value":"theme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"wash"}},{"kind":"Field","name":{"kind":"Name","value":"inseams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sizes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"pimVariantKeyNo"}},{"kind":"Field","name":{"kind":"Name","value":"EAN"}},{"kind":"Field","name":{"kind":"Name","value":"sapVariant"}},{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isAvailable"}},{"kind":"Field","name":{"kind":"Name","value":"isCancelled"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"isClosed"}},{"kind":"Field","name":{"kind":"Name","value":"isSoldOut"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isInvalid"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<OptionsByDivisionCodeAndSalesChannelQuery, OptionsByDivisionCodeAndSalesChannelQueryVariables>;
export const OptionCountsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"optionCounts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"divisionCode"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"salesChannels"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"optionCounts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"divisionCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"divisionCode"}}},{"kind":"Argument","name":{"kind":"Name","value":"salesChannels"},"value":{"kind":"Variable","name":{"kind":"Name","value":"salesChannels"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isAvailableCount"}},{"kind":"Field","name":{"kind":"Name","value":"isCancelledCount"}},{"kind":"Field","name":{"kind":"Name","value":"isNewCount"}},{"kind":"Field","name":{"kind":"Name","value":"isSoldOutCount"}},{"kind":"Field","name":{"kind":"Name","value":"isUpdatedCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<OptionCountsQuery, OptionCountsQueryVariables>;