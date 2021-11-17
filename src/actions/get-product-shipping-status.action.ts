/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import * as Msdyn365 from '@msdyn365-commerce/core';

/**
 * GetProductShippingStatus Input Action
 */
export class GetProductShippingStatusInput implements Msdyn365.IActionInput {
    // TODO: Construct the input needed to run the action
    
    public id: string;
    

    constructor(id: string) {
        this.id = id;

    }

    
    // TODO: Determine if the results of this get action should cache the results and if so provide
    // a cache object type and an appropriate cache key
    public getCacheKey = () => `ProductShippingStatus`;
    public getCacheObjectType = () => 'ProductShippingStatus';
    public dataCacheType = (): Msdyn365.CacheType => 'application';


}

// TODO: Create a data model here or import one to capture the response of the action
export interface IGetProductShippingStatusData {
    text: string;
}

/**
 * TODO: Use this function to create the input required to make the action call
 */
const createInput = (args: Msdyn365.ICreateActionContext, id : any): Msdyn365.IActionInput => {
    debugger
    return new GetProductShippingStatusInput(id);
};

/**
 * TODO: Use this function to call your action and process the results as needed
 */
async function action(id: any, ctx: Msdyn365.IActionContext): Promise<IGetProductShippingStatusData> {
    // const apiSettings = Msdyn365.msdyn365Commerce.apiSettings;
    debugger;
    // TODO: Uncomment the below line to get the value from a service
    // const response = await Msdyn365.sendRequest<IGetProductShippingStatusData[]>('/get/example/id/1', 'get');
    return { text: 'Static data from action ' + id.id };
}

export default Msdyn365.createObservableDataAction({
    action: <Msdyn365.IAction<IGetProductShippingStatusData>>action,
    // TODO: Give your data action a unique id
    id: 'GetProductShippingStatus',
    input: createInput
    // TODO: Uncomment the below line if this is a meant to be a batched data action
    // isBatched: true
});
