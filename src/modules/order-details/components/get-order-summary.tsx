/*--------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * See License.txt in the project root for license information.
 *--------------------------------------------------------------*/

/* eslint-disable no-duplicate-imports */
import { PriceComponent } from '@msdyn365-commerce/components';
import * as React from 'react';

import { IGetOrderSummaryInput, IOrderSummary, IPriceContext } from '@msdyn365-commerce-modules/order-management';

interface ISummaryLineProps {
    priceContext?: IPriceContext;
    name: string;
    label: string;
    value?: number;
}

const OrderSummaryLine: React.SFC<ISummaryLineProps> = ({ name, label, value = 0, priceContext }) => (
    <p className={`ms-order-details__order-summary-line-${name}`}>
        <span className='ms-order-details__order-summary-label'>
            {label}
        </span>
        {priceContext ? (
            <PriceComponent
                {...priceContext}
                className='ms-order-details__order-summary-price'
                data={{ price: { CustomerContextualPrice: value } }}
            />
        ) : (
            <span className='ms-order-details__order-summary-price'>
                {value}
            </span>
        )}
    </p>
);

export const getOrderDetailsOrderSummary = ({
    order,
    priceContext,
    earnedPoints,
    resource: {
        orderSummaryHeading,
        orderSummaryItemsTotalLabel,
        orderSummaryShippingFeeLabel,
        orderSummaryTaxLabel,
        orderSummaryGrandTotalLabel,
        pointsEarnedLabel
    },
    canShip
}: IGetOrderSummaryInput): IOrderSummary => {
    console.log("Aakash");
    return {
        orderSummaryProps: { className: 'ms-order-details__order-summary' },
        heading: <p className='ms-order-details__order-summary-heading'>
            {orderSummaryHeading}
        </p>,
        subtotal: (
            <div>test</div>
            // <OrderSummaryLine
            //     name='subtotal'
            //     label={orderSummaryItemsTotalLabel}
            //     value={order.SubtotalAmount}
            //     priceContext={priceContext}
            // />
        ),
        shipping: canShip ? (
            <OrderSummaryLine
                name='shipping' label={orderSummaryShippingFeeLabel} value={order.ChargeAmount}
                priceContext={priceContext} />
        ) : '',
        tax: <OrderSummaryLine
            name='tax-amount' label={orderSummaryTaxLabel} value={order.TaxAmount}
            priceContext={priceContext} />,
        totalAmount: (
            <OrderSummaryLine
                name='total-amount'
                label={orderSummaryGrandTotalLabel}
                value={order.TotalAmount}
                priceContext={priceContext}
            />
        ),
        earnedPoints: earnedPoints ? <OrderSummaryLine name='earned-points' label={pointsEarnedLabel} value={earnedPoints} /> : undefined
    };
};
