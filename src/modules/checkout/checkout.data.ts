/*--------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * See License.txt in the project root for license information.
 *--------------------------------------------------------------*/

/* eslint-disable no-duplicate-imports */
import { ICheckoutState } from '@msdyn365-commerce/global-state';
import { AsyncResult, ChannelDeliveryOptionConfiguration, Customer, FeatureState, OrgUnitLocation, ProductDeliveryOptions, SimpleProduct } from '@msdyn365-commerce/retail-proxy';

export interface ICheckoutData {
    checkout: AsyncResult<ICheckoutState>;
    products: AsyncResult<SimpleProduct[]>;
    orgUnitLocations: AsyncResult<OrgUnitLocation[]>;
    deliveryOptions: AsyncResult<ProductDeliveryOptions[]>;
    customerInformation: AsyncResult<Customer>;
    channelDeliveryOptionConfig: AsyncResult<ChannelDeliveryOptionConfiguration>;
    featureState: AsyncResult<FeatureState[]>;
}
