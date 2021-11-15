/*--------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * See License.txt in the project root for license information.
 *--------------------------------------------------------------*/

/* eslint-disable no-duplicate-imports */
import { getUrlSync, IActionContext } from '@msdyn365-commerce/core';
import { ICheckoutState } from '@msdyn365-commerce/global-state';
import { SalesOrder, SimpleProduct } from '@msdyn365-commerce/retail-proxy';

import checkout from './checkout';
import emptyActiveCart from './empty-active-cart';

export default async (ctx: IActionContext, checkoutState: ICheckoutState | undefined, orderedProducts: SimpleProduct[] | undefined,
    redirect: boolean, updatedCartVersion?: number, isPaymentVerificationRedirection?: boolean) => {
    return new Promise(async (resolve: () => void, reject: (reason?: Error) => void) => {
        let salesOrder: SalesOrder;

        // Proceed checkout
        try {
            salesOrder = await checkout(ctx, updatedCartVersion, isPaymentVerificationRedirection);
        } catch (error) {
            reject(error); return;
        }

        // Remove purchased items from the active cart
        try {
            await emptyActiveCart(ctx);
        } catch (error) {
            reject(error); return;
        }

        if (redirect) {
            // Redirect to the order confirmation page
            const orderConfirmationUrl = getUrlSync('orderConfirmation', ctx) || '';
            if (!orderConfirmationUrl) {
                reject(new Error('Error: No orderConfirmationUrl')); return;
            }

            const separator = orderConfirmationUrl.includes('?') ? '&' : '?';
            const url = `${orderConfirmationUrl}${separator}transactionId=${salesOrder.Id}`;
            window.location.assign(url);
        } else {
            if (checkoutState) {
                const result = await checkoutState.updateSalesOrder({ newSalesOrder: salesOrder, newOrderedProducts: orderedProducts || [] });

                if (result.status === 'FAILED') {
                    reject(new Error('Error: Updating error state failed')); return;
                }
            } else {
                reject(new Error('Error: No checkout state')); return;
            }
            resolve();
        }
    });
};
