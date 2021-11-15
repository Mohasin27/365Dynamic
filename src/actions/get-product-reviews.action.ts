/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import * as Msdyn365 from '@msdyn365-commerce/core';
import {SelectedVariantInput, ISelectedProduct} from '@msdyn365-commerce-modules/retail-actions/src/get-selected-variant';
import { IActionContext } from '@msdyn365-commerce/core';
/**
 * GetProductReviews Input Action
 */
export class GetProductReviewsInput implements Msdyn365.IActionInput {
    // TODO: Construct the input needed to run the action
    constructor() {
        //super({shouldCacheOutput: true, cacheObjectType: 'MyCacheObjectType', cacheKey: 'MyCacheKey'});
    }

    // TODO: Determine if the results of this get action should cache the results and if so provide
    // a cache object type and an appropriate cache key
    public getCacheKey = () => `MyCacheKey`;
    public getCacheObjectType = () => 'MyCacheObjectType';
    public dataCacheType = (): Msdyn365.CacheType => 'application';
}

// TODO: Create a data model here or import one to capture the response of the action
export interface IGetProductReviewsData {
    // text: string;
    // id: any;
    // value: string;
    // RecordId: string;
    // ItemId: string;
    // Name: string;
    // Description: string;
    // ProductTypeValue: string;
    // DefaultUnitOfMeasure: string;
    // BasePrice: string;
    // Price: string;
    // AdjustedPrice: string;
    // MasterProductId: string;
    // Components: string;
    // Dimensions: string;
    // Behavior: string;
    // LinkedProducts: string;
    // PrimaryImageUrl: string;
    // ExtensionProperties: string;
    message: string;
}

/**
 * TODO: Use this function to create the input required to make the action call
 */
const createInput = (args: Msdyn365.ICreateActionContext): Msdyn365.IActionInput => {
    return new GetProductReviewsInput();
};


/**
 * TODO: Use this function to call your action and process the results as needed
 */
// async function action(input: GetProductReviewsInput, ctx: Msdyn365.IActionContext): Promise<IGetProductReviewsData> {
//     // const apiSettings = Msdyn365.msdyn365Commerce.apiSettings;

//     // TODO: Uncomment the below line to get the value from a service

//     //const response = await Msdyn365.sendRequest<IGetProductReviewsData[]>('/get/example/id/1', 'get');
//    // console.log(response);
// //     return { text: 'Static data from action Aman',
// //     "RecordId": "22565423455",
// //     "ItemId": "2101",
// //     "Name": "Retro Horn-Rimmed Keyhole Sunglasses",
// //     "Description": "High-quality with the perfect blend of timeless classic and modern technology with hint of old school glamor.",
// //     "ProductTypeValue": "3",
// //     "DefaultUnitOfMeasure": "Ea",
// //     "BasePrice": "15",
// //     "Price": "15",
// //     "AdjustedPrice": "14",
// //     "MasterProductId": "12",
// //     "Components": "test",
// //     "Dimensions": "23",
// //     "Behavior": "excellent",
// //     "LinkedProducts": "none",
// //     "PrimaryImageUrl": "https://bit.ly/33cMGxr",
// //     "ExtensionProperties": "none",
// //     "id": 1,
// //     "value":'First Product'

// // };
//      return { message : 'The item will be removed automatically after 2 hours'};
// }


async function action(input: SelectedVariantInput, context: IActionContext): Promise<IGetProductReviewsData | null> {
   // const matchingDimensionValues = input.matchingDimensionValues ?? getDimensionValuesFromQuery(context.requestContext.url.requestUrl);

    
     

        return { message : 'The item will be removed automatically after 2 hours'};
   
}

export default Msdyn365.createObservableDataAction({
    action: <Msdyn365.IAction<IGetProductReviewsData>>action,
    // TODO: Give your data action a unique id
    id: 'GetProductReviews',
    input: createInput
    // TODO: Uncomment the below line if this is a meant to be a batched data action
    // isBatched: true
});
function getDimensionValuesFromQuery(requestUrl: URL): import("@msdyn365-commerce/retail-proxy").ProductDimension[] | undefined {
    throw new Error('Function not implemented.');
}

