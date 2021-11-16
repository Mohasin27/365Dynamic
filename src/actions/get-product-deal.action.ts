/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import * as Msdyn365 from '@msdyn365-commerce/core';

/**
 * GetProductDeal Input Action
 */
export class GetProductDealInput implements Msdyn365.IActionInput {
    // TODO: Construct the input needed to run the action
    constructor(productId: string) {
        this.productId = productId;
    }

    // TODO: Determine if the results of this get action should cache the results and if so provide
    // a cache object type and an appropriate cache key
    public getCacheKey = () => `TODO`;
    public getCacheObjectType = () => 'TODO';
    public dataCacheType = (): Msdyn365.CacheType => 'application';
    public productId: string;
}

// TODO: Create a data model here or import one to capture the response of the action
export interface IGetProductDealData {
    expiredIn: number;
}

export interface IProductDealData {
    productId: string,
    productSku: string,
    productName: string,
    productPrice: string,
    productChannelId: string,
    productChannelName: string
    productCategoryId: string,
    productCategoryName: string,
    productQuantity: string,
    productCurrency: string
}




/**
 * TODO: Use this function to create the input required to make the action call
 */
const createInput = (args: Msdyn365.ICreateActionContext): Msdyn365.IActionInput => {
    let productId  = args.requestContext.urlTokens.recordId ?? '';    
    // console.log(s.urlTokens.recordId);
    // var ssss = args.data;
    // console.log(ssss)
    return new GetProductDealInput(productId);
};

/**
 * TODO: Use this function to call your action and process the results as needed
 */
async function action(input: GetProductDealInput, ctx: Msdyn365.IActionContext): Promise<IGetProductDealData> {
    // const apiSettings = Msdyn365.msdyn365Commerce.apiSettings;

    // TODO: Uncomment the below line to get the value from a service
    // const response = await Msdyn365.sendRequest<IGetProductDealData[]>('/get/example/id/1', 'get');
    if(input.productId == "22565424007"){
        return { expiredIn : 6 }
    }
    else{
        return { expiredIn : 0}
    }
    
}

export default Msdyn365.createObservableDataAction({
    action: <Msdyn365.IAction<IGetProductDealData>>action,
    // TODO: Give your data action a unique id
    id: 'GetProductDeal',
    input: createInput
    // TODO: Uncomment the below line if this is a meant to be a batched data action
    // isBatched: true
});
