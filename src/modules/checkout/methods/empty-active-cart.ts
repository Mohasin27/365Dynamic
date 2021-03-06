/*--------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * See License.txt in the project root for license information.
 *--------------------------------------------------------------*/

/* eslint-disable no-duplicate-imports */
import { IActionContext } from '@msdyn365-commerce/core';
import { getCartState, getCheckoutState } from '@msdyn365-commerce/global-state';

async function emptyActiveCart(ctx: IActionContext): Promise<void> {
    let cartState;
    let checkoutState;
    const lineItemIdsToRemove = [];

    try {
        cartState = await getCartState(ctx);
        checkoutState = await getCheckoutState(ctx);
    } catch (error) {
        throw error;
    }

    if (!cartState || !cartState.cart) {
        throw new Error('Fail to fetch active cart');
    }

    if (!checkoutState || !checkoutState.checkoutCart) {
        throw new Error('Fail to fetch checkoutCart cart');
    }

    const activeCart = cartState.cart;
    const checkoutCart = checkoutState.checkoutCart.cart;

    for (const activeCartLine of activeCart.CartLines || []) {
        for (const checkoutCartLine of checkoutCart.CartLines || []) {
            if (activeCartLine.LineId && activeCartLine.LineId === checkoutCartLine.LineId) {
                lineItemIdsToRemove.push(activeCartLine.LineId);
            }
        }
    }

    try {
        await cartState.removeCartLines({ cartLineIds: lineItemIdsToRemove });
        await cartState.removeAllPromoCodes({});
        await checkoutState.removeCheckoutCartId({});
    } catch (error) {
        throw error;
    }
}

export default emptyActiveCart;
