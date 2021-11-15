/*--------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * See License.txt in the project root for license information.
 *--------------------------------------------------------------*/

/* eslint-disable no-duplicate-imports */
import {
    AddToOrderTemplateComponent, AddToWishlistComponent, CartLineItemComponent,
    IAddToOrderTemplateDialogResources, ICartlineResourceString, IDuplicateItemsWhenAddingToOrderTemplateDialogResources,
    IItemAddedToOrderTemplateDialogResources, IOrderTemplateNameDialogResources, IWishlistActionSuccessResult } from '@msdyn365-commerce/components';
import { IAny, ICoreContext, IGeneric, IGridSettings, IImageSettings, ITelemetry, TelemetryEvent } from '@msdyn365-commerce/core';
import { ICartState } from '@msdyn365-commerce/global-state';
import {
    CartLine,
    ChannelDeliveryOptionConfiguration,
    CommerceList,
    Customer,
    LineDataValidationFailure,
    OrgUnitLocation,
    ProductDeliveryOptions,
    SimpleProduct
} from '@msdyn365-commerce/retail-proxy';
import { ProductDimensionType, ReleasedProductType } from '@msdyn365-commerce/retail-proxy/dist/Entities/CommerceTypes.g';
import { IStoreSelectorStateManager } from '@msdyn365-commerce-modules/bopis-utilities';
import {
    ArrayExtensions,
    getInvoiceDetailsPageUrlSync,
    getProductUrlSync,
    IProductInventoryInformation,
    ObjectExtensions,
    OrderTemplate
} from '@msdyn365-commerce-modules/retail-actions';
import { Button, getPayloadObject, getTelemetryAttributes, ITelemetryContent } from '@msdyn365-commerce-modules/utilities';
import classnames from 'classnames';
import * as React from 'react';

import { getProductByProductId, getProductByProductIdAndWarehouse } from '@msdyn365-commerce-modules/cart';
import { IPickUpInStoreViewProps, PickUpInStore } from './cart-pick-up-in-store';

export interface ICartLineItemsProps {
    cartlines: CartLine[];
    cartlinesErrors: LineDataValidationFailure[];
    cartState: ICartState | undefined;
    orgUnitLocations: OrgUnitLocation[] | undefined;
    resources: ICartlineResourceString;
    productAvailabilites: IProductInventoryInformation[] | undefined;
    products: SimpleProduct[] | undefined;
    productDeliveryOptions: ProductDeliveryOptions[] | undefined;
    pickupDeliveryModeCode?: string;

    /**
     * GridSettings for the product image in cartline
     */
    gridSettings: IGridSettings;

    /**
     * ImageSettings for the product image in cartline
     */
    imageSettings: IImageSettings;
    id: string;
    typeName: string;
    context: ICoreContext<IGeneric<IAny>>;
    telemetry: ITelemetry;
    removeButtonText: string;
    addToWishlistButtonText: string;
    removeFromWishlistButtonText: string;
    shipItText: string;
    pickitUpText: string;
    changeStoreText: string;
    outOfStockText: string;
    outOfRangeOneText: string;
    outOfRangeFormatText: string;
    storeSelectorStateManager: IStoreSelectorStateManager | undefined;
    isStockCheckEnabled: boolean;
    wishlists: CommerceList[] | undefined;
    defaultWishlistName: string;
    maxCartlineQuantity: number;
    includeErrors?: boolean;
    showShippingChargesForLineItems?: boolean;
    telemetryContent?: ITelemetryContent;
    isQuantityLimitsFeatureEnabled: boolean;
    storeSelectorModuleId?: string;
    channelDeliveryOptionConfig?: ChannelDeliveryOptionConfiguration;

    addToOrderTemplateDialogResources: IAddToOrderTemplateDialogResources;
    createOrderTemplateDialogResources: IOrderTemplateNameDialogResources;
    itemAddedToOrderTemplateDialogResources: IItemAddedToOrderTemplateDialogResources;
    duplicateItemsWhenAddingToOrderTemplateDialogResources: IDuplicateItemsWhenAddingToOrderTemplateDialogResources;

    addToOrderTemplateButtonText: string;
    addToOrderTemplateButtonTooltip: string;
    addToOrderTemplateMessage: string;
    addItemToOrderTemplateError: string;
    orderTemplates: OrderTemplate[] | undefined;
    customerInformation: Customer | undefined;
    shouldIgnoreWarehouse: boolean | undefined;
    productExpirationMessage: string | undefined;
    removeItemClickHandler(cartlineToRemove: CartLine): void;
    moveToWishlistSuccessHandler(result: IWishlistActionSuccessResult, cartlineId: CartLine): void;
    updateCartLinesQuantitySuccessHandler(cartline: CartLine, quantity: number, lineIndex?: number): boolean;
    locationChangedHandler(): void;
}

export interface ICartlinesViewProps {
    cartline: React.ReactNode;
    pickUpInStore?: IPickUpInStoreViewProps;
    remove: React.ReactNode;
    addToWishlist: React.ReactNode | undefined;
    addToOrderTemplate: React.ReactNode | undefined;

    error?: string;
    cartlineId?: string;
    hasError?: boolean;
    data?: {
        product?: SimpleProduct;
        cartline: CartLine;
    };
}

const _getCartItemAvailableQuantity = (isStockCheckEnabled: boolean, productAvailability: IProductInventoryInformation | undefined): number => {
    if (!isStockCheckEnabled ||
        !productAvailability ||
        !productAvailability.ProductAvailableQuantity ||
        !productAvailability.IsProductAvailable ||
        !productAvailability.ProductAvailableQuantity.AvailableQuantity) {
        return 0;
    }

    return productAvailability.ProductAvailableQuantity.AvailableQuantity;
};

const _getCartItemMaxQuantity = (
    maxQuantityByConfig: number,
    isStockCheckEnabled: boolean,
    availableQuantityInStock: number,
    isQuantityLimitsFeatureEnabled: boolean,
    maxByQuantityLimitsFeature: number) => {
    if (isQuantityLimitsFeatureEnabled) {
        let maxByQuantityLimitsFeatureResult = maxByQuantityLimitsFeature;

        // If max by feature in not defined when feature is on then we suggest that there no max by feature
        // and consider available qty if stock check enabled and max from config in site settings.
        if (!maxByQuantityLimitsFeature) {
            maxByQuantityLimitsFeatureResult = maxQuantityByConfig || 10;
        }

        return isStockCheckEnabled ? (maxByQuantityLimitsFeatureResult < availableQuantityInStock ? maxByQuantityLimitsFeatureResult : availableQuantityInStock) : maxByQuantityLimitsFeatureResult;
    }
    if (isStockCheckEnabled) {
        return availableQuantityInStock < maxQuantityByConfig ? availableQuantityInStock : maxQuantityByConfig;
    }
    return maxQuantityByConfig;

};

const _getErrorMessage = (availableQuantityInStock: number, currentQuantity: number, props: ICartLineItemsProps, lineIndex: number, isServiceItem: boolean): string | undefined => {
    const finalErrorMessages: string[] = [];
    if (props.includeErrors) {
        if (props.isStockCheckEnabled && !isServiceItem) {
            if (availableQuantityInStock <= 0) {
                finalErrorMessages.push(props.outOfStockText);
            } else if (availableQuantityInStock < currentQuantity) {
                if (availableQuantityInStock === 1) {
                    finalErrorMessages.push(props.outOfRangeOneText);
                } else {
                    finalErrorMessages.push(props.outOfRangeFormatText.replace('{numLeft}', availableQuantityInStock.toString()));
                }
            }
        }
    }

    // Server-side validation
    props.cartlinesErrors
        .filter(i => i.LineIndex === lineIndex)
        .forEach(i => {
            if (i.DataValidationFailure?.ErrorContext) {
                finalErrorMessages.push(i.DataValidationFailure.ErrorContext);
            }
        });

    if (finalErrorMessages.length > 0) {
        return finalErrorMessages.join(' ');
    }

    return undefined;
};

/**
 * On Remove Click functionality.
 * @param removeItemClickHandler -Remove item click function.
 * @param cartline -CartLine.
 * @returns Remove change value.
 */
const onRemoveClickFunction = (removeItemClickHandler: (cartlineToRemove: CartLine) => void, cartline: CartLine) => () => {
    removeItemClickHandler(cartline);
};

// eslint-disable-next-line complexity -- Auto-suppressed.
const _assembleNode = (
    cartline: CartLine,
    product: SimpleProduct | undefined,
    props: ICartLineItemsProps,
    index: number,
    foundProductAvailability?: IProductInventoryInformation,
    foundProductDeliveryOptions?: ProductDeliveryOptions): ICartlinesViewProps => {
    const { imageSettings, gridSettings, id, typeName, context, resources, removeButtonText,
        removeItemClickHandler, moveToWishlistSuccessHandler, addToOrderTemplateButtonText, addToOrderTemplateButtonTooltip,
        addToOrderTemplateDialogResources, createOrderTemplateDialogResources,
        itemAddedToOrderTemplateDialogResources, duplicateItemsWhenAddingToOrderTemplateDialogResources,
        addToWishlistButtonText, removeFromWishlistButtonText, orderTemplates, customerInformation,
        wishlists, defaultWishlistName, storeSelectorModuleId } = props;

    const isAuthenticated = context.request.user.isAuthenticated;
    const nameOfWishlist = wishlists && wishlists.length > 0 && wishlists[0].Name ? wishlists[0].Name : defaultWishlistName;
    const availableQuantityInStock = _getCartItemAvailableQuantity(props.isStockCheckEnabled, foundProductAvailability);

    const defaultMaxQuantity = 0;
    const maxQuantity = product && _getCartItemMaxQuantity(
        props.maxCartlineQuantity,
        props.isStockCheckEnabled,
        availableQuantityInStock,
        props.isQuantityLimitsFeatureEnabled,
        product?.Behavior?.MaximumQuantity ?? defaultMaxQuantity);

    // Check if the product is service or not by product type
    const isServiceItem = product?.ItemTypeValue === ReleasedProductType.Service;

    const errorMessage = ObjectExtensions.isNullOrUndefined(maxQuantity) ? undefined : _getErrorMessage(availableQuantityInStock, cartline.Quantity!, props, index, isServiceItem);

    const onRemoveClickHandler = onRemoveClickFunction(removeItemClickHandler, cartline);

    const payload = getPayloadObject(TelemetryEvent.RemoveFromCart, props.telemetryContent!, removeButtonText, '');
    const attributes = getTelemetryAttributes(props.telemetryContent!, payload);

    const inventoryLbl = foundProductAvailability?.StockLevelLabel;
    const inventoryCode = foundProductAvailability ? `ms-cart-line__inventory-code-${foundProductAvailability.StockLevelCode?.toLowerCase()}` : undefined;
    const productDimension = 4;
    const customPriceDimensionType = productDimension as ProductDimensionType.Style;
    const isCustomPriceSelected = product?.Dimensions?.find(dimension => dimension.DimensionTypeValue === customPriceDimensionType)?.DimensionValue?.Value === 'Custom';

    return {
        data: {
            product,
            cartline
        },
        cartlineId: cartline.LineId,
        error: errorMessage,
        hasError: (!isServiceItem && props.isStockCheckEnabled) ? cartline.Quantity! > (maxQuantity ?? defaultMaxQuantity) : false,
        cartline: (
            <CartLineItemComponent
                data={{
                    cartLine: cartline,
                    product
                }}
                currentQuantity={cartline.Quantity}
                maxQuantity={maxQuantity}
                isOutOfStock={(!isServiceItem && props.isStockCheckEnabled) ? (availableQuantityInStock <= 0) : false}
                gridSettings={gridSettings}
                imageSettings={imageSettings}
                id={id}
                typeName={typeName}
                productUrl={product ? getProductUrlSync(product, props.context.actionContext, undefined) : getInvoiceDetailsPageUrlSync(cartline.Description || '', props.context.actionContext)}
                context={context}
                resources={resources}
                key={index}
                lineIndex={index}
                isQuantityEditable={!ObjectExtensions.isNullOrUndefined(product)}
                quantityOnChange={props.updateCartLinesQuantitySuccessHandler}
                primaryImageUrl={product?.PrimaryImageUrl}
                errorMessage={errorMessage}
                inventoryInformationLabel={inventoryLbl}
                inventoryLabelClassName={inventoryCode}
                isCartStateReady={props.cartState?.status === 'READY'}
                showShippingChargesForLineItems={props.showShippingChargesForLineItems}
                telemetryContent={props.telemetryContent}
                channelDeliveryOptionConfig={props.channelDeliveryOptionConfig}
            />),
        pickUpInStore: product ? (
            PickUpInStore({
                storeSelectorModuleId,
                cartState: props.cartState,
                cartline,
                product,
                shipitText: props.shipItText,
                pickUpInStoreText: props.pickitUpText,
                changeStoreText: props.changeStoreText,
                storeSelectorStateManager: props.storeSelectorStateManager,
                orgUnitLocations: props.orgUnitLocations,
                deliveryOptions: foundProductDeliveryOptions,
                pickupDeliveryModeCode: cartline.DeliveryMode !== (undefined || '') ? cartline.DeliveryMode : props.pickupDeliveryModeCode,
                locationChangedHandler: props.locationChangedHandler
            })
        ) : undefined,
        remove: (
            <Button
                className='msc-cart-line__remove-item'
                onClick={onRemoveClickHandler}
                title={removeButtonText}
                {...attributes}
            >
                {removeButtonText}
            </Button>
        ),
        addToWishlist: (
            isAuthenticated && product && !isCustomPriceSelected ? (
                <AddToWishlistComponent
                    className='msc-cart-line__add-to-wishlist'
                    addToWishlistButtonText={addToWishlistButtonText}
                    removeFromWishlistButtonText={removeFromWishlistButtonText}
                    context={context}
                    id={id}
                    key={cartline.LineId}
                    typeName={typeName}
                    nameOfWishlist={nameOfWishlist}
                    cartline={cartline}
                    showButtonText
                    showStatusMessage={false}
                    showRemoveButton={false}
                    showButtonTooltip={false}
                    ariaRole='button'
                    data={{
                        wishlists,
                        product
                    }}
                    onSuccess={moveToWishlistSuccessHandler}
                />
            ) : undefined
        ),
        addToOrderTemplate: (
            isAuthenticated && orderTemplates && product ? (
                <AddToOrderTemplateComponent
                    className={classnames('msc-cart-line__add-to-order-template', isCustomPriceSelected ? 'disabled' : '')}
                    addToOrderTemplateButtonText={addToOrderTemplateButtonText}
                    addToOrderTemplateButtonTooltip={addToOrderTemplateButtonTooltip}
                    addToOrderTemplateDialogResources={addToOrderTemplateDialogResources}
                    createOrderTemplateDialogResources={createOrderTemplateDialogResources}
                    itemAddedToOrderTemplateDialogResources={itemAddedToOrderTemplateDialogResources}
                    duplicateItemsWhenAddingToOrderTemplateDialogResources={duplicateItemsWhenAddingToOrderTemplateDialogResources}
                    data={{ product, quantity: cartline.Quantity || 1, orderTemplates, customerInformation }}
                    context={context}
                    showButtonText
                    shouldShowButtonFailedTooltip={isCustomPriceSelected}
                    disableButton={isCustomPriceSelected}
                    id={id}
                    typeName={typeName}
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- App config settings are of "any" value
                    showButtonTooltip={!props.context.app.config.disableTooltip || false}
                />
            ) : undefined
        )
    };
};

export const assembleCartlines = (
    cartlines: CartLine[],
    products: SimpleProduct[] | undefined,
    props: ICartLineItemsProps): ICartlinesViewProps[] | null => {
    const reactNodes: ICartlinesViewProps[] = [];

    cartlines.map((cartline, index) => {
        let product;
        if (props.isQuantityLimitsFeatureEnabled) {
            // When feature is enabled the same products could have different quantity limits in Behavior so we need
            // to check productId and WarehouseId for identification.
            product = getProductByProductIdAndWarehouse(cartline.ProductId, products, cartline.WarehouseId, props.cartState);
        } else {
            product = getProductByProductId(cartline.ProductId, products);
        }
        let foundProductAvailability;
        if (props.productAvailabilites && ArrayExtensions.hasElements(props.productAvailabilites)) {
            foundProductAvailability = props.productAvailabilites.find((productAvailability) => {
                if (props.shouldIgnoreWarehouse) {
                    return productAvailability.ProductAvailableQuantity?.ProductId === cartline.ProductId;
                }
                return productAvailability.ProductAvailableQuantity?.ProductId === cartline.ProductId &&
                productAvailability.InventLocationId === cartline.WarehouseId;
            });
        }
        let foundProductDeliveryOption;
        if (props.productDeliveryOptions && props.productDeliveryOptions.length > 0) {
            foundProductDeliveryOption = props.productDeliveryOptions.find((deliveryOption) => {
                return deliveryOption && deliveryOption.ProductId === cartline.ProductId;
            });
        }
        reactNodes.push(_assembleNode(cartline, product, props, index, foundProductAvailability, foundProductDeliveryOption));
    });

    return reactNodes;
};

/**
 * CartLineItems component.
 * @param props
 */
export const CartLineItems = (props: ICartLineItemsProps) => {
    const { products, cartlines } = props;
    return (
        assembleCartlines(cartlines, products, props)
    );
};
