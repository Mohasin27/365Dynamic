/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */


import { Category } from '@msdyn365-commerce/retail-proxy';
import * as React from 'react';

import { IProductFeatureData } from './product-feature.data';
import { IProductFeatureProps } from './product-feature.props.autogenerated';

export interface IProductFeatureViewProps extends IProductFeatureProps<IProductFeatureData> {
    categories: Category[] | undefined;
}

/**
 *
 * ProductFeature component
 * @extends {React.PureComponent<IProductFeatureProps<IProductFeatureData>>}
 */



class ProductFeature extends React.PureComponent<IProductFeatureProps<IProductFeatureData>> {

    
    public render(): JSX.Element | null {
        console.log( this.props.context.request.apiSettings.channelId)
        const { config, resources, data } = this.props;        
        const viewProps : IProductFeatureViewProps = {
            ...(this.props as IProductFeatureProps<IProductFeatureData>),
            categories: data.categories.result,
            config: config,
            resources:resources
        }
        return this.props.renderView( viewProps );
    }
}

export default ProductFeature;
