/** @type {import('./$types').PageServerLoad} */
// +page.js

// Import urql modules
import { Client, query, gql } from '@urql/svelte';

// Create a client instance
const client = new Client({
  url: 'http://localhost:8080/graphql',
});

export async function load() {
  const divisionCode = '11';
  const salesChannels = ['SELLIN'];

  // Define your GraphQL query using gql
  const GET_OPTIONS_BY_DIVISION_CODE_AND_SALES_CHANNEL = gql`
    query optionsByDivisionAndChannel {
        optionsByDivisionAndChannel(divisionCode: "${divisionCode}", salesChannels: ${JSON.stringify(salesChannels)}) {
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

  // Fetch data using urql's query function
  const { data, fetching, error } = query(GET_OPTIONS_BY_DIVISION_CODE_AND_SALES_CHANNEL);

  // Handle loading and error states
  return {
    props: {
      data,
      fetching,
      error,
    },
  };
}
