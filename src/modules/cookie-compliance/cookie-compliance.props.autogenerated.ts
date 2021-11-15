/**
 * Copyright (c) Microsoft Corporation
 * All rights reserved. See License.txt in the project root for license information.
 * ICookieCompliance contentModule Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';

export interface ICookieComplianceConfig extends Msdyn365.IModuleConfig {
    content?: Msdyn365.RichText;
    actionLinks?: IActionLinksData[];
    className?: string;
}

export interface ICookieComplianceResources {
    acceptCookiesButtonText: string;
    acceptCookiesAriaLabel: string;
}

export interface IActionLinksData {
    linkText?: string;
    linkUrl: Msdyn365.ILinkData;
    ariaLabel?: string;
    openInNewTab?: boolean;
}

export interface ICookieComplianceProps<T> extends Msdyn365.IModule<T> {
    resources: ICookieComplianceResources;
    config: ICookieComplianceConfig;
}
