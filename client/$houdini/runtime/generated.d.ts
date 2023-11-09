import type { Record } from "./public/record";
import { divisionId$result, divisionId$input } from "../artifacts/divisionId";
import { divisionIdStore } from "../plugins/houdini-svelte/stores/divisionId";

export declare type CacheTypeDef = {
    types: {
        Option: {
            idFields: {
                id: string;
            };
            fields: {
                channels: {
                    type: ((string | null))[] | null;
                    args: never;
                };
                color: {
                    type: string | null;
                    args: never;
                };
                colorDescription1: {
                    type: string | null;
                    args: never;
                };
                colorDescription2: {
                    type: string | null;
                    args: never;
                };
                countryOfOrigin: {
                    type: string | null;
                    args: never;
                };
                deliveryDate: {
                    type: string | null;
                    args: never;
                };
                deliveryDates: {
                    type: ((string | null))[] | null;
                    args: never;
                };
                description: {
                    type: string | null;
                    args: never;
                };
                dimensions: {
                    type: string | null;
                    args: never;
                };
                divisionCode: {
                    type: string | null;
                    args: never;
                };
                documentType: {
                    type: string | null;
                    args: never;
                };
                fabric: {
                    type: string | null;
                    args: never;
                };
                fashionability: {
                    type: string | null;
                    args: never;
                };
                fashionabilityCode: {
                    type: string | null;
                    args: never;
                };
                fit: {
                    type: string | null;
                    args: never;
                };
                hasSustainableMaterials: {
                    type: boolean | null;
                    args: never;
                };
                id: {
                    type: string | null;
                    args: never;
                };
                images: {
                    type: string | null;
                    args: never;
                };
                isAvailable: {
                    type: boolean | null;
                    args: never;
                };
                isCancelled: {
                    type: boolean | null;
                    args: never;
                };
                isNew: {
                    type: boolean | null;
                    args: never;
                };
                isSoldOut: {
                    type: boolean | null;
                    args: never;
                };
                isUpdated: {
                    type: boolean | null;
                    args: never;
                };
                llo: {
                    type: string | null;
                    args: never;
                };
                merchandisingHierarchy: {
                    type: string | null;
                    args: never;
                };
                optionType: {
                    type: string | null;
                    args: never;
                };
                priceBySize: {
                    type: boolean | null;
                    args: never;
                };
                salesOrganizationCode: {
                    type: string | null;
                    args: never;
                };
                styleDescription: {
                    type: string | null;
                    args: never;
                };
                styleDescription1: {
                    type: string | null;
                    args: never;
                };
                styleNumber: {
                    type: string | null;
                    args: never;
                };
                styleSeasonCode: {
                    type: string | null;
                    args: never;
                };
                sustainableAttribute: {
                    type: string | null;
                    args: never;
                };
                sustainableFiber: {
                    type: string | null;
                    args: never;
                };
                theme: {
                    type: string | null;
                    args: never;
                };
                wash: {
                    type: string | null;
                    args: never;
                };
            };
            fragments: [];
        };
        __ROOT__: {
            idFields: {};
            fields: {
                options: {
                    type: ((Record<CacheTypeDef, "Option"> | null))[] | null;
                    args: never;
                };
            };
            fragments: [];
        };
    };
    lists: {};
    queries: [[divisionIdStore, divisionId$result, divisionId$input]];
};