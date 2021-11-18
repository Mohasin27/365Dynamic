/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */


import * as React from 'react';
import { IProductFeatureViewProps } from '../../../modules/product-feature/./product-feature';


export default (props: IProductFeatureViewProps) => {
    console.log(props)
    return (
        
        <div className='row'>
            { props.categories && props.categories?.map(m=><p>{m.Name}</p>)}
            { props.categories && props.categories?.map(m=> console.log(m))}
          
        </div>
    );
};

// const _renderCategory = (category: Category): JSX.Element => {
    

//     return (
//         <p>{category}</p>
//     );
// };
