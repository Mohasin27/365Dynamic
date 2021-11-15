/*--------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * See License.txt in the project root for license information.
 *--------------------------------------------------------------*/

/* eslint-disable no-duplicate-imports */
import { IActionContext } from '@msdyn365-commerce/core';
import { getCheckoutState } from '@msdyn365-commerce/global-state';
import { checkoutAsync } from '@msdyn365-commerce/retail-proxy/dist/DataActions/CartsDataActions.g';
import {
    getTenderTypesAsync, resolveCardTypesAsync
} from '@msdyn365-commerce/retail-proxy/dist/DataActions/StoreOperationsDataActions.g';
import {
    Address, CardPaymentAcceptResult, CardType, CartTenderLine, RetailOperation, SalesOrder, TenderType, TokenizedPaymentCard
} from '@msdyn365-commerce/retail-proxy/dist/Entities/CommerceTypes.g';

export const OPERATIONS = {
    PayCard: 201,
    PayGiftCertificate: 214,
    PayLoyalty: 207,
    PayCustomerAccount: 202
};

const getCardTypeId = async (ctx: IActionContext, cardPrefix: string = ''): Promise<string | undefined> => {
    try {
        const response = await resolveCardTypesAsync({ callerContext: ctx }, cardPrefix, CardType.Unknown);
        if (response && response.length > 0) {
            return response[0].TypeId;
        }
    } catch (error) {
        ctx.telemetry.error('Call to resolveCardTypesAsync failed.', error);
    }
    return undefined;
};

const findTenderIdTypeByOperationId = (tenderTypes: TenderType[], operationId: RetailOperation): string | undefined => {
    const matchedTenderType = tenderTypes.find(tenderType => tenderType.OperationId === operationId);
    if (matchedTenderType) {
        return matchedTenderType.TenderTypeId;
    }
    return;
};

const roundNumber = (value: number) => Number(value.toFixed(2));

async function getLoyaltyTenderLine(
    ctx: IActionContext,
    LoyaltyCardId: string,
    Amount: number = 0,
    Currency: string = 'USD'
): Promise<CartTenderLine> {
    const tenderTypes = await getTenderTypesAsync({ callerContext: ctx, queryResultSettings: {} }).catch(error => {
        throw error;
    });

    if (!tenderTypes) {
        throw new Error('Fail to get gift card tender line');
    }

    const TenderTypeId = findTenderIdTypeByOperationId(tenderTypes, OPERATIONS.PayLoyalty);
    return {
        // @ts-expect-error
        '@odata.type': '#Microsoft.Dynamics.Commerce.Runtime.DataModel.CartTenderLine',

        'Amount@odata.type': '#Decimal',
        Currency,
        TenderTypeId,
        Amount,
        LoyaltyCardId
    };
}

async function getGiftCardTenderLine(
    ctx: IActionContext,
    GiftCardId: string = '',
    Amount: number = 0,
    Currency: string = 'USD',
    tenderTypeId?: string,
    giftCardPin?: string,
    giftCardExpirationYear?: number,
    giftCardExpirationMonth?: number
): Promise<CartTenderLine> {
    let TenderTypeId = tenderTypeId;

    if (!TenderTypeId) {
        const tenderTypes = await getTenderTypesAsync({ callerContext: ctx, queryResultSettings: {} }).catch(error => {
            throw error;
        });
        if (!tenderTypes) {
            throw new Error('Fail to get gift card tender line');
        }
        TenderTypeId = findTenderIdTypeByOperationId(tenderTypes, OPERATIONS.PayGiftCertificate);
    }

    const GiftCardPin = giftCardPin;
    const GiftCardExpirationYear = giftCardExpirationYear;
    const GiftCardExpirationMonth = giftCardExpirationMonth;
    return {
        // @ts-expect-error
        '@odata.type': '#Microsoft.Dynamics.Commerce.Runtime.DataModel.CartTenderLine',
        'Amount@odata.type': '#Decimal',
        Currency,
        TenderTypeId,
        Amount,
        GiftCardId,
        GiftCardPin,
        GiftCardExpirationYear,
        GiftCardExpirationMonth
    };
}

async function getCreditCardTenderLine(
    ctx: IActionContext,
    tokenizedPaymentCard: TokenizedPaymentCard,
    cardPrefix: string = '',
    Amount: number = 0,
    Currency: string = 'USD',
    billingAddress?: Address
): Promise<CartTenderLine> {
    const tenderTypes = await getTenderTypesAsync({ callerContext: ctx, queryResultSettings: {} }).catch(error => {
        throw error;
    });

    let cartTypeId = tokenizedPaymentCard.CardTypeId;

    if (!cartTypeId) {
        cartTypeId = await getCardTypeId(ctx, cardPrefix);
    }

    if (!tenderTypes) {
        throw new Error('Fail to get card tender type');
    }

    if (!cartTypeId) {
        throw new Error('Fail to get card type id');
    }

    const TenderTypeId = tokenizedPaymentCard.TenderType ?? findTenderIdTypeByOperationId(tenderTypes, OPERATIONS.PayCard);
    const cardTenderLine: CartTenderLine = {
        // @ts-expect-error
        '@odata.type': '#Microsoft.Dynamics.Commerce.Runtime.DataModel.CartTenderLine',
        'Amount@odata.type': '#Decimal',
        Currency,
        Amount,
        TenderTypeId,
        CardTypeId: cartTypeId
    };
    cardTenderLine.TokenizedPaymentCard = {
        ...tokenizedPaymentCard,
        CardTypeId: cartTypeId,

        // @ts-expect-error
        '@odata.type': '#Microsoft.Dynamics.Commerce.Runtime.DataModel.TokenizedPaymentCard',
        House: tokenizedPaymentCard.House || 'N/A',
        ...(tokenizedPaymentCard.CardTokenInfo && {
            CardTokenInfo: {
                ...tokenizedPaymentCard.CardTokenInfo,
                '@odata.type': '#Microsoft.Dynamics.Commerce.Runtime.DataModel.CardTokenInfo'
            }
        }),
        ...(billingAddress && {
            Phone: billingAddress.Phone,
            Country: billingAddress.ThreeLetterISORegionName,
            Address1: billingAddress.Street,
            City: billingAddress.City,
            State: billingAddress.State,
            Zip: billingAddress.ZipCode
        })
    };

    return cardTenderLine;
}

/**
 * Get credit card tender line.
 * @param context - Action context.
 * @param amount - Due amount for credit card.
 * @param currency - Currency.
 * @param cardPaymentAcceptResult - CardPaymentAcceptResult.
 * @returns - The credit card tender line.
 */
async function getCreditCardTenderLineForSinglePaymentAuth(
    context: IActionContext,
    amount: number = 0,
    currency: string = 'USD',
    cardPaymentAcceptResult?: CardPaymentAcceptResult
): Promise<CartTenderLine> {
    const tenderTypes = await getTenderTypesAsync({ callerContext: context, queryResultSettings: {} }).catch(error => {
        throw error;
    });

    const tenderTypeId = findTenderIdTypeByOperationId(tenderTypes, OPERATIONS.PayCard);

    const cardTenderLine: CartTenderLine = {
        // @ts-expect-error -- existing data.
        '@odata.type': '#Microsoft.Dynamics.Commerce.Runtime.DataModel.CartTenderLine',
        'Amount@odata.type': '#Decimal',
        Currency: currency,
        Amount: amount,
        TenderTypeId: tenderTypeId,
        CardPaymentAcceptResult: cardPaymentAcceptResult
    };

    return cardTenderLine;
}

async function createCustomerAccountTenderLine(
    ctx: IActionContext,
    Amount: number,
    Currency: string = 'USD'
): Promise<CartTenderLine> {
    const CustomerId = null;
    if (!ctx.requestContext.user.isAuthenticated) {
        ctx.telemetry.error('A customer id is required to pay with customer account');
    }

    const tenderTypes = await getTenderTypesAsync({ callerContext: ctx, queryResultSettings: {} }).catch(error => {
        throw error;
    });

    if (!tenderTypes) {
        ctx.telemetry.error('No tender types found for this channel');
    }

    const TenderTypeId = findTenderIdTypeByOperationId(tenderTypes, OPERATIONS.PayCustomerAccount);
    if (!TenderTypeId) {
        ctx.telemetry.error('No customer account tender type');
    }
    return {
        '@odata.type': '#Microsoft.Dynamics.Commerce.Runtime.DataModel.CartTenderLine',
        'Amount@odata.type': '#Decimal',
        Currency,
        TenderTypeId,
        Amount,

        // @ts-expect-error
        CustomerId
    };
}

export default async (ctx: IActionContext, updatedCartVersion?: number, isPaymentVerificationRedirection?: boolean): Promise<SalesOrder> => {
    const checkoutState = await getCheckoutState(ctx).catch(error => {
        throw error;
    });

    const cartState = checkoutState.checkoutCart;

    const channelConfiguration = ctx.requestContext.channel;

    if (!cartState || Object.keys(cartState).length === 0 || !channelConfiguration) {
        throw new Error('Fail to placeOrder');
    }

    const {
        giftCardExtends,
        tokenizedPaymentCard,
        cardPrefix,
        guestCheckoutEmail,
        billingAddress,
        loyaltyAmount,
        cardPaymentAcceptResult,
        shouldEnableSinglePaymentAuthorizationCheckout
    } = checkoutState;
    const { Currency } = channelConfiguration;

    let amountDue = cartState.cart.AmountDue || 0;
    let cartTenderLines;
    const getTenderLinePromises = [];
    const loyaltyCardNumber = cartState.cart.LoyaltyCardId;

    // Pay by loyalty first
    if (loyaltyAmount && loyaltyCardNumber) {
        const chargedAmount = roundNumber(Math.min(loyaltyAmount, amountDue));
        const loyaltyTenderLinePromise = getLoyaltyTenderLine(ctx, loyaltyCardNumber, chargedAmount, Currency);
        getTenderLinePromises.push(loyaltyTenderLinePromise);
        amountDue = roundNumber(amountDue - chargedAmount);
    }

    // Then by gift card
    if (giftCardExtends && giftCardExtends.length > 0) {
        giftCardExtends.some(giftCardExtend => {
            if (giftCardExtend.Balance && amountDue > 0) {
                const chargedAmount = roundNumber(Math.min(giftCardExtend.Balance, amountDue));
                const tenderTypeId = giftCardExtend.TenderTypeId;
                const giftCardPin = giftCardExtend.Pin;
                const giftCardExpirationYear = giftCardExtend.ExpirationDate ? Number.parseInt(giftCardExtend.ExpirationDate?.split('/')[1], 10) : undefined;
                const giftCardExpirationMonth = giftCardExtend.ExpirationDate ? Number.parseInt(giftCardExtend.ExpirationDate?.split('/')[0], 10) : undefined;
                const creditCardTenderLinePromise = getGiftCardTenderLine(ctx, giftCardExtend.Id, chargedAmount, Currency, tenderTypeId, giftCardPin, giftCardExpirationYear, giftCardExpirationMonth);
                getTenderLinePromises.push(creditCardTenderLinePromise);
                amountDue = roundNumber(amountDue - chargedAmount);
            }
            return amountDue === 0;
        });
    }

    // Then by customer account
    if (checkoutState.customerAccountAmount > 0) {
        const chargedAmount = roundNumber(Math.min(checkoutState.customerAccountAmount, amountDue));
        const customerAccountTenderLinePromise = createCustomerAccountTenderLine(ctx, chargedAmount, Currency);
        getTenderLinePromises.push(customerAccountTenderLinePromise);
        amountDue = roundNumber(amountDue - chargedAmount);
    }

    // Pay the rest by credit card
    if (amountDue > 0) {
        let creditCardTenderLinePromise: Promise<CartTenderLine>;

        if (shouldEnableSinglePaymentAuthorizationCheckout) {
            creditCardTenderLinePromise = getCreditCardTenderLineForSinglePaymentAuth(
                ctx,
                amountDue,
                Currency,
                cardPaymentAcceptResult
            );
        } else {
            if (!tokenizedPaymentCard) {
                throw new Error('Fail to placeOrder: no token found');
            }
            creditCardTenderLinePromise = getCreditCardTenderLine(
                ctx,
                tokenizedPaymentCard,
                cardPrefix,
                amountDue,
                Currency,
                billingAddress
            );
        }

        getTenderLinePromises.push(creditCardTenderLinePromise);
    }

    if (getTenderLinePromises.length > 0) {
        // When payment methods is required
        cartTenderLines = await Promise.all(getTenderLinePromises).catch(error => {
            throw error;
        });

        if (!cartTenderLines || cartTenderLines.length === 0) {
            throw new Error('Fail to placeOrder: fail to get cart tender lines');
        }
    }

    const cartVersion = updatedCartVersion || cartState.cart.Version;

    // Proceed checkout
    const salesOrder = await checkoutAsync(
        { callerContext: ctx, bypassCache: 'get' },
        cartState.cart.Id,
        guestCheckoutEmail,
        undefined,
        undefined,
        cartTenderLines || null,
        cartVersion
    ).catch(async error => {
        if (checkoutState.shouldEnableSinglePaymentAuthorizationCheckout) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- unknown type.
            if (error.data?.AdditionalContext) {
                await checkoutState.updateShouldCollapsePaymentSection({ newShouldCollapsePaymentSection: true });
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- unknown type.
                await checkoutState.updateRedirectAdditionalContext({ newRedirectAdditionalContext: error?.data?.AdditionalContext as string });
            } else if (isPaymentVerificationRedirection) {
                await checkoutState.updateIsCheckoutCallFailed({ newIsCheckoutCallFailed: true });
            }
        }

        throw error;
    });

    if (!salesOrder) {
        throw new Error('Fail to placeOrder: fail to checkout');
    }

    return salesOrder;
};
