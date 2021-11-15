/**
 * Copyright (c) Microsoft Corporation
 * All rights reserved. See License.txt in the project root for license information.
 * ICheckout containerModule Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';
import * as React from 'react';

export interface ICheckoutConfig extends Msdyn365.IModuleConfig {
    checkoutHeading?: ICheckoutHeadingData;
    lineItemsHeading?: ILineItemsHeadingData;
    orderSummaryHeading?: IOrderSummaryHeadingData;
    showShippingChargesForLineItems?: boolean;
    disableGuidedCheckoutFlow?: boolean;
    imageSettings?: Msdyn365.IImageSettings;
    className?: string;
}

export interface ICheckoutResources {
    checkoutStepTitleFormat: string;
    saveBtnLabel: string;
    saveAndContinueBtnLabel: string;
    changeBtnLabel: string;
    cancelBtnLabel: string;
    genericErrorMessage: string;
    invalidCartVersionErrorMessage: string;
    checkoutOutOfStockErrorMessage: string;
    cookieConsentRequiredMessage: string;
    backToShopping: string;
    placeOrderText: string;
    confirmPaymentText: string;
    discountStringText: string;
    discountOffStringText: string;
    quantityDisplayString: string;
    productDimensionTypeColor: string;
    productDimensionTypeSize: string;
    productDimensionTypeStyle: string;
    productDimensionTypeAmount: string;
    itemLabel: string;
    itemsLabel: string;
    inStorePickUpLabel: string;
    multiplePickUpLabel: string;
    shippingLable: string;
    shippingCountCheckoutLineItem: string;
    pickUpAtStoreWithLocationText: string;
    emailDeliveryText: string;
    editCartText: string;
    configString: string;
    subTotalLabel: string;
    shippingLabel: string;
    otherCharges: string;
    shippingCharges: string;
    freeText: string;
    taxLabel: string;
    loyaltyLabel: string;
    giftcardLabel: string;
    totalAmountLabel: string;
    totalSavingsLabel: string;
    orderTotalLabel: string;
    totalDiscountsLabel: string;
    toBeCalculatedText: string;
    inputQuantityAriaLabel: string;
    invoiceSummaryTitle: string;
    invoiceLabel: string;
}

export const enum CheckoutHeadingTag {
    h1 = 'h1',
    h2 = 'h2',
    h3 = 'h3',
    h4 = 'h4',
    h5 = 'h5',
    h6 = 'h6'
}

export interface ICheckoutHeadingData {
    text: string;
    tag?: CheckoutHeadingTag;
}

export const enum LineItemsHeadingTag {
    h1 = 'h1',
    h2 = 'h2',
    h3 = 'h3',
    h4 = 'h4',
    h5 = 'h5',
    h6 = 'h6'
}

export interface ILineItemsHeadingData {
    text: string;
    tag?: LineItemsHeadingTag;
}

export const enum OrderSummaryHeadingTag {
    h1 = 'h1',
    h2 = 'h2',
    h3 = 'h3',
    h4 = 'h4',
    h5 = 'h5',
    h6 = 'h6'
}

export interface IOrderSummaryHeadingData {
    text: string;
    tag?: OrderSummaryHeadingTag;
}

export interface ICheckoutProps<T> extends Msdyn365.IModule<T> {
    resources: ICheckoutResources;
    config: ICheckoutConfig;
    slots: {
        checkoutInformation: React.ReactNode[];
        orderConfirmation: React.ReactNode[];
        termsAndConditions: React.ReactNode[];
    };
}
