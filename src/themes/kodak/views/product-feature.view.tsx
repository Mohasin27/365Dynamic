/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import { Category } from '@msdyn365-commerce/retail-proxy';
import * as React from 'react';
import { IProductFeatureViewProps } from '../../../modules/product-feature/./product-feature';


export default (props: IProductFeatureViewProps) => {
    console.log(props)
    return (
        
        <div className='row'>
            { props.categories && props.categories?.map(m=><p>{m.Name}</p>)}
            <h2>Config Value: {props.config.showText}</h2>
            <h2>Resource Value: {props.resources.resourceKey}</h2>
        </div>
    );
};

// const _renderCategory = (category: Category): JSX.Element => {
    

//     return (
//         <p>{category}</p>
//     );
// };
