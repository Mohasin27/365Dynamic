/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import * as React from 'react';
import { IProductFeatureViewProps } from './product-feature';
import { ArrayExtensions } from '@msdyn365-commerce-modules/retail-actions';
import action from '../../actions/get-product-reviews.action';

export default (props: IProductFeatureViewProps) => {
    console.log(props.data);
    console.log(ArrayExtensions);
    var ssss =  action;
    console.log(ssss);
    return (
        <div className='row'>
            <h2>Config Value: {props.config.showText}</h2>
            <h2>Resource Value: {props.resources.resourceKey}</h2>
        </div>
    );
};
